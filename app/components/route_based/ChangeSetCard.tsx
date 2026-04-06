import { ChangeSetVM, UserRoleVM } from "~/types";
import { formatDateForUA } from "~/utils/formatDateUA";
import Badge from "../ui/Badge";
import styles from "./ChangeSetCard.module.css";
import { Accordion } from "../ui/Accordion";
import NormsTable from "../NormsTable";
import NormsTableWithChanges from "../NormsTableWithChanges";
import { Icon } from "../ui/Icon";
import { ApproverCombobox } from "./ApproverCombobox";
import { useState } from "react";
import { Form, useNavigation } from "@remix-run/react";
import translate from "~/utils/translate";
import * as Ariakit from "@ariakit/react";
import clsx from "clsx";

type ChangeSetCardMetaProps = Pick<ChangeSetVM, "createdBy" | "approver" | "createdAt" | "status" | "decidedAt">;

const STATUS_TONE_MAP: Record<ChangeSetVM["status"], "green" | "yellow" | "blue" | "red"> = {
  DRAFT: "yellow",
  ON_REVIEW: "blue",
  APPROVED: "green",
  REJECTED: "red",
};

function ChangeSetCardMeta({ createdBy, createdAt, status, approver, decidedAt }: ChangeSetCardMetaProps) {
  const tone = STATUS_TONE_MAP[status];
  return (
    <div className={styles.changeSetCardMetaContainer}>
      <div className={styles.changeSetCardMetaTop}>
        <p>
          <strong>Зміна від: </strong>
          {createdBy.firstName} {createdBy.lastName}
        </p>
        <Badge tone={tone}>{translate("CHANGE_STATUS", status)}</Badge>
      </div>
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
      {(status === "APPROVED" || status === "REJECTED") && decidedAt && (
        <>
          <p className={styles.changeSetCardMetaField}>
            <strong>Рішення прийнято: </strong>
            {formatDateForUA(decidedAt, { withYear: true })}
            {/* todo - add who approved */}
          </p>
          <p className={styles.changeSetCardMetaField}>
            <strong>Ким: </strong>
            {approver.firstName} {approver.lastName}
          </p>
        </>
      )}
      {/* todo - who viewed  + styling*/}
    </div>
  );
}

type ChangeType = "added" | "removed" | "changed";

function renderSummaryCard(type: ChangeType, items?: any[]) {
  if (!items || items.length === 0) return null;

  let icon: React.ReactNode;
  let label: React.ReactNode;
  let content: React.ReactNode;

  const count = items.length;

  switch (type) {
    case "added":
      icon = <Icon name="change-added" color="#2ea44f" />;
      label = <>Додано ({count})</>;
      content = <NormsTable normsJson={items} />;
      break;

    case "removed":
      icon = <Icon name="change-removed" color="#cb2431" />;
      label = <>Видалено ({count})</>;
      content = <NormsTable normsJson={items} />;
      break;

    case "changed":
      icon = <Icon name="change-modified" color="#1f72eb" />;
      label = <>Змінено ({count})</>;
      content = <NormsTableWithChanges changes={items} />;
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

function AdminActions({ id }: { id: string }) {
  return (
    <div role="group" aria-label="Admin actions" className="adminActions">
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

function CommitterActions({ id, approvers }: { id: string; approvers: any }) {
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
  id: string;
  status: ChangeSetVM["status"];
  userId: string;
  approverId: ChangeSetVM["approverId"];
  approvers: any;
};

function ChangeSetCardActions({ role, id, status, userId, approverId, approvers }: ChangeSetCardActionsProps) {
  switch (role) {
    case "ADMIN":
      const isApprover = Boolean(approverId && approverId === userId);
      return status === "ON_REVIEW" && isApprover && <AdminActions id={id} />;

    case "COMMITTER":
      return status === "DRAFT" ? <CommitterActions id={id} approvers={approvers} /> : null;

    case "VIEWER":
    default:
      return <ViewerActions />;
  }
}

type ChangeSetCardProps = ChangeSetVM & {
  role: UserRoleVM;
  userId: string;
};
export default function ChangeSetCard({
  id,
  status,
  createdAt,
  diff,
  createdBy,
  role,
  approver,
  approverId,
  userId,
  decidedAt,
  approvers,
}: ChangeSetCardProps) {
  return (
    <div className={styles.container}>
      <ChangeSetCardMeta createdBy={createdBy} createdAt={createdAt} status={status} approver={approver} decidedAt={decidedAt} />
      <ChangeSetCardSummary diff={diff} />
      <ChangeSetCardActions role={role} id={id} status={status} userId={userId} approverId={approverId} approvers={approvers} />
    </div>
  );
}
