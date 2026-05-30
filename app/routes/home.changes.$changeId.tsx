import { Form, Outlet, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import BackLink from "~/components/common/BackControls";
import {
  approveChangeSet,
  assignApproverToChangeSet,
  deleteChangeSetWithSnapshot,
  getLightChangeById,
  getPopulatedChangeSetById,
  rejectChangeSet,
  viewChange,
} from "~/server/changes.server";
import { requireUserId, requireUserRole } from "~/server/auth.server";
import { getApprovers } from "~/server/user.server";
import { CanonicalRow, ChangeSetVM, NormDiff, UserRoleVM } from "~/types";
import styles from "~/components/route_based/ChangeSetCard.module.css";
import Badge from "~/components/ui/Badge";
import translate from "~/utils/translate";
import { formatDateForUA, formatDateShortUA } from "~/utils/formatDateUA";
import { Icon } from "~/components/ui/Icon";
import NormsTable from "~/components/NormsTable";
import NormsTableWithChanges from "~/components/NormsTableWithChanges";
import { Accordion } from "~/components/ui/Accordion";
import { useState } from "react";
import * as Ariakit from "@ariakit/react";
import { ApproverCombobox } from "~/components/route_based/ApproverCombobox";
import clsx from "clsx";
import { shortenFirstName } from "~/utils/formatName";
import RouteError from "~/components/ui/RouteError";
import { throwDevelopmentActionTestError, throwDevelopmentLoaderTestError } from "~/server/development-errors.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.changeId, "Missing contactId param");
  throwDevelopmentActionTestError(request);
  const changeSetId = params.changeId;
  const role = await requireUserRole(request);
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log(intent);

  if (intent === "assign-approver") {
    if (role !== "COMMITTER") {
      throw new Response("Forbidden: Access denied", { status: 403 });
    }

    const approverId = formData.get("approverId");

    if (typeof approverId !== "string" || !approverId) {
      throw new Response("Approver is required", { status: 422 });
    }

    await assignApproverToChangeSet({
      changeSetId,
      approverId,
      createdById: userId,
    });

    return null;
    // return redirect(request.url);
  }
  // todo validation!!!!!!
  if (intent === "reject") {
    if (role !== "APPROVER") {
      throw new Response("Forbidden: Access denied", { status: 403 });
    }

    await rejectChangeSet({
      changeSetId,
      decidedById: userId,
    });
    return null;
    // return redirect(request.url);
  }

  if (intent === "remove") {
    if (role !== "COMMITTER") {
      throw new Response("Forbidden: Access denied", { status: 403 });
    }

    const changeSet = await getLightChangeById(changeSetId);

    if (!changeSet) {
      throw new Response("ChangeSet not found", { status: 404 });
    }

    if (changeSet.createdById !== userId || changeSet.status !== "DRAFT") {
      throw new Response("Forbidden: Access denied", { status: 403 });
    }

    //   if (!changeSet) {
    //   return {
    //     error: "Зміну не знайдено",
    //   };
    // }

    // // 2. бізнес-логіка
    // if (changeSet.status === "APPROVED") {
    //   return {
    //     error: "Не можна видалити підтверджену зміну",
    //   };
    // }

    // // (опціонально)
    // // if (changeSet.status === "ON_REVIEW") {
    // //   return { error: "Зміна вже на перевірці" };
    // // }

    // // 3. delete
    await deleteChangeSetWithSnapshot(changeSet);
    // todo - ADD TRY-CAtch
    // todo - if possible - show toast
    return redirect("/home/changes");
  }

  if (intent === "approve") {
    if (role !== "APPROVER") {
      throw new Response("Forbidden: Access denied", { status: 403 });
    }

    const res = await approveChangeSet({ changeSetId, decidedById: userId });
    console.log("approve", res);
    return null;
  }
  throw new Response("Unknown action", { status: 422 });
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.changeId, "Missing productId param");
  throwDevelopmentLoaderTestError(params.changeId);

  // todo optimize

  const role = await requireUserRole(request);
  const userId = await requireUserId(request);

  let approvers: Awaited<ReturnType<typeof getApprovers>> = [];
  if (role === "COMMITTER") {
    approvers = await getApprovers(userId);
  }

  const changeId = params.changeId;
  const changeSet = await getPopulatedChangeSetById(params.changeId);
  if (!changeSet) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (role === "VIEWER") {
    if (changeSet.status !== "APPROVED") {
      throw new Response("Forbidden: Access denied", { status: 403 });
    }
    await viewChange(userId, changeId);
  }

  return { role, userId, changeSet, approvers };
};

export function ErrorBoundary() {
  return <RouteError />;
}

type ChangeSetRouteData = ReturnType<typeof useLoaderData<typeof loader>>;
type SerializedChangeSet = NonNullable<ChangeSetRouteData>["changeSet"];
type ChangeSetView = SerializedChangeSet["views"][number];

function ViewsPopover({ views, viewsCount }: { views: ChangeSetView[]; viewsCount: number }) {
  return (
    <span className="hovercard-wrapper">
      <Ariakit.HovercardProvider>
        <Ariakit.HovercardAnchor className="anchor">({viewsCount})</Ariakit.HovercardAnchor>
        <Ariakit.HovercardDisclosure className="disclosure">
          <Ariakit.VisuallyHidden>Інформація про перегляди</Ariakit.VisuallyHidden>
            <Icon name="asda"/>
        </Ariakit.HovercardDisclosure>
        <Ariakit.Hovercard portal gutter={16} className="hovercard">
          <ul className="list-unstyled viewes-list">
            {views.map((v) => (
              <li className="viewes-list__item" key={v.id}>
                <span className="views-list__name">
                  {shortenFirstName(v.user.firstName)}
                  {v.user.lastName} -
                </span>
                <time className="views-list__date" dateTime={new Date(v.viewedAt).toISOString()}>
                  &nbsp;{formatDateShortUA(v.viewedAt)}
                </time>
              </li>
            ))}
          </ul>
          {/* if > 25 - button fecth all!! */}
        </Ariakit.Hovercard>
      </Ariakit.HovercardProvider>
    </span>
  );
}

type ChangeSetCardMetaProps = Pick<SerializedChangeSet, "createdBy" | "approver" | "createdAt" | "status" | "decidedAt" | "views"> & {
  viewsCount: number;
};

const STATUS_TONE_MAP: Record<ChangeSetVM["status"], "green" | "yellow" | "blue" | "red"> = {
  DRAFT: "yellow",
  ON_REVIEW: "blue",
  APPROVED: "green",
  REJECTED: "red",
};

function ChangeSetCardMeta({ createdBy, createdAt, status, approver, decidedAt, views, viewsCount }: ChangeSetCardMetaProps) {
  const tone = STATUS_TONE_MAP[status];
  return (
    <div className={styles.changeSetCardMetaContainer}>
      <div className="flex justify-between">
        <div>
          <p className={styles.changeSetCardMetaField}>
            <strong>Зміна від: </strong>
            {createdBy.firstName} {createdBy.lastName}
          </p>
          <p className={styles.changeSetCardMetaField}>
            <strong>Дата внесення: </strong>
            {formatDateForUA(createdAt, { withYear: true })}
          </p>
          {approver && status === "ON_REVIEW" && (
            <p className={styles.changeSetCardMetaField}>
              <strong>На розгляді: </strong>
              {approver.firstName} {approver.lastName}
            </p>
          )}
          {(status === "APPROVED" || status === "REJECTED") && approver && decidedAt && (
            <>
              <p className={styles.changeSetCardMetaField}>
                <strong>Рішення прийнято: </strong>
                {formatDateForUA(decidedAt, { withYear: true })}
              </p>
              <p className={styles.changeSetCardMetaField}>
                <strong>Ким: </strong>
                {approver.firstName} {approver.lastName}
              </p>
            </>
          )}
        </div>
        <div>
          <Badge tone={tone}>{translate("CHANGE_STATUS", status)}</Badge>
          {/* lazy popover ???????? or regular popover???? use loading to additional and use just count fecth or not */}
          {status === "APPROVED" && (
            <p className="views-block">
              Переглянули бух. {viewsCount > 0 ? <ViewsPopover viewsCount={viewsCount} views={views} /> : "(0)"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type ChangeType = "added" | "removed" | "changed";

function renderSummaryCard(type: ChangeType, items?: unknown[]) {
  if (!items || items.length === 0) return null;

  let icon: React.ReactNode;
  let label: React.ReactNode;
  let content: React.ReactNode;

  const count = items.length;

  switch (type) {
    case "added":
      icon = <Icon name="change-added" color="#2ea44f" />;
      label = <>Додано ({count})</>;
      content = <NormsTable normsJson={items as CanonicalRow[]} />;
      break;

    case "removed":
      icon = <Icon name="change-removed" color="#cb2431" />;
      label = <>Видалено ({count})</>;
      content = <NormsTable normsJson={items as CanonicalRow[]} />;
      break;

    case "changed":
      icon = <Icon name="change-modified" color="#1f72eb" />;
      label = <>Змінено ({count})</>;
      content = <NormsTableWithChanges changes={items as { before: CanonicalRow; after: CanonicalRow; fields: (keyof CanonicalRow)[] }[]} />;
      break;

    default:
      return null;
  }

  return (
    <Accordion>
      <Accordion.Summary>
        <span className={styles.summaryTitle}>
          {icon}
          {label}
        </span>
      </Accordion.Summary>

      <Accordion.Content>{content}</Accordion.Content>
    </Accordion>
  );
}

type ChangeSetCardSummaryProps = Pick<ChangeSetVM, "diff">;

function ChangeSetCardSummary({ diff }: ChangeSetCardSummaryProps) {
  return (
    <div className={styles.summaryContainer}>
      {diff?.added?.length ? renderSummaryCard("added", diff?.added) : null}
      {diff?.removed?.length ? renderSummaryCard("removed", diff?.removed) : null}
      {diff?.changed?.length ? renderSummaryCard("changed", diff?.changed) : null}
    </div>
  );
}

function ApproverActions() {
  return (
    <div role="group" aria-label="Approver actions" className="adminActions">
      <Form method="post">
        <button type="submit" name="intent" value="reject" className="button button--primary button--critical">
          Відхилити
        </button>
      </Form>
      <Form method="post">
        <button type="submit" name="intent" value="approve" className="button button--primary">
          Прийняти
        </button>
      </Form>
    </div>
  );
}

function CommitterActions({ approvers }: { approvers: Awaited<ReturnType<typeof getApprovers>> }) {
  const [approverId, setApproverId] = useState<string | undefined>();
  const dialog = Ariakit.useDialogStore();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // console.log(11, approvers);
  return (
    <div role="group" className="commiterActions" aria-label="Commiter actions">
      <Form method="post" aria-label="Approve change set" className="commiterActionsSetApprover">
        <input type="hidden" name="intent" value="assign-approver" />

        <ApproverCombobox approverOptions={approvers} value={approverId} setValue={setApproverId} />
        <button type="submit" disabled={!approverId} className="button button--primary">
          Надіслати
        </button>
      </Form>

      <button className="button button--secondary" type="button" aria-label="Відкрити підтвердження видалення" onClick={dialog.show}>
        Видалити
      </button>
      <Ariakit.Dialog store={dialog} backdrop={<div className="backdrop" />} className="dialog">
        <Ariakit.DialogHeading className="heading">Видалити зміну?</Ariakit.DialogHeading>
        <p className="text-md margin-0">
          Ви впевнені, що хочете видалити цю зміну? Після видалення буде втрачено саму зміну, а також чорновий снапшот продукту, пов’язаний
          із нею. Цю дію неможливо скасувати.
        </p>

        <div className="flex justify-end gap-12">
          <Ariakit.DialogDismiss disabled={isSubmitting} className={clsx("button button--secondary", isSubmitting && "is-loading")}>
            Cкасувати
          </Ariakit.DialogDismiss>
          <Form method="post">
            <input type="hidden" name="intent" value="remove" />
            <button
              disabled={isSubmitting}
              className={clsx("button button--primary button--critical", isSubmitting && "is-loading")}
              aria-label="Видалити зміну"
            >
              Підтвердити
            </button>
          </Form>
        </div>
      </Ariakit.Dialog>
    </div>
  );
}

function ViewerActions() {
  return <div role="group" aria-label="Admin actions"></div>;
}

type ChangeSetCardActionsProps = {
  role: UserRoleVM;
  status: ChangeSetVM["status"];
  userId: string;
  approverId: ChangeSetVM["approverId"];
  approvers: Awaited<ReturnType<typeof getApprovers>>;
};

function ChangeSetCardActions({ role, status, userId, approverId, approvers }: ChangeSetCardActionsProps) {
  switch (role) {
    case "APPROVER": {
      const isApprover = Boolean(approverId && approverId === userId);
      return status === "ON_REVIEW" && isApprover && <ApproverActions />;
    }

    case "COMMITTER":
      return status === "DRAFT" ? <CommitterActions approvers={approvers} /> : null;

    case "VIEWER":
    default:
      return <ViewerActions />;
  }
}

export default function ChangeSet() {
  const data = useLoaderData<typeof loader>();
  // skeleton
  // fade
  // overlay
  //   const navigation = useNavigation()
  // navigation.state === "submitting"
  /* <button disabled={isSubmitting}>
  {isSubmitting ? "Saving..." : "Save"}
</button> */

  // const fetcher = useFetcher()
  // console.log(121212, data);
  if (!data) return null;

  const { role, userId, changeSet, approvers } = data;
  const { status, createdAt, diff, createdBy, approver, approverId, decidedAt, product, _count } = changeSet;
  return (
    <>
      <div>
        {/* <h1>Product {productId}</h1> */}
        <div className="dashboard-topbar">
          <BackLink />
          <h3 className="1product-details__title">
            Зміна по продукту: {product.title}
            {/* {loaderData.product.title}
              <LastChanged date={loaderData.product.updatedAt} /> */}
          </h3>
        </div>
        <div className={styles.container}>
          {/* viewes = [] or empty [] */}
          <ChangeSetCardMeta
            views={changeSet.views}
            viewsCount={_count.views}
            createdBy={createdBy}
            createdAt={createdAt}
            status={status}
            approver={approver}
            decidedAt={decidedAt}
          />
          <ChangeSetCardSummary diff={diff as NormDiff} />
          <ChangeSetCardActions role={role} status={status} userId={userId} approverId={approverId} approvers={approvers} />
        </div>
        <Outlet />
      </div>
    </>
  );
}
