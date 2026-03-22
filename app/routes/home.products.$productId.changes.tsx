import { Link, Outlet, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { assignApproverToChangeSet, getFilteredChangeSets, rejectChangeSet } from "~/server/changes.server";
import { NormDiff } from "~/types";
import { getUserId, requireUserRole } from "~/server/auth.server";
import ChangesTable from "~/components/route_based/ChangesTable";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // invariant(params.productId, "Missing contactId param");
  const userId = await getUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log(intent);

  if (intent === "assign-approver") {
    const changeSetId = formData.get("changeSetId");
    const approverId = formData.get("approverId");

    if (!changeSetId || !approverId) return null;
    if (typeof changeSetId !== "string" || typeof approverId !== "string") return null;

    // await assignApproverToChangeSet({
    //   changeSetId,
    //   approverId,
    // });

    return null;
    // return redirect(request.url);
  }
  // todo validation!!!!!!
  if (intent === "reject") {
    const changeSetId = formData.get("changeSetId") as string;

    await rejectChangeSet({
      changeSetId,
      decidedById: userId,
    });
    return null;

    // return redirect(request.url);
  }
  return null;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const role = await requireUserRole(request);
  const userId = await getUserId(request);

  // todo - depend on role
  // admin - on review + approved
  // commit - draft + approved + onreview
  // viewer - only approved

  // todo - light version. Only link, status, createBy, responsible, date

  const lastPendingChanges = await getFilteredChangeSets(
    {
      productId: params.productId,
    },
    { createdAt: "desc" },
    0,
    10,
  );
  // todo - tmp solution
  // todo - add try-catch
  const changeSetVMs = lastPendingChanges.flatMap((cs) =>
    cs.diff
      ? [
          {
            ...cs,
            diff: cs.diff as NormDiff,
          },
        ]
      : [],
  );
  return { changes: changeSetVMs, role, userId: userId, currentProductId: params.productId };
};

export default function NormChanges() {
  const { changes, role, userId, currentProductId } = useLoaderData<typeof loader>();
  console.log(changes);
  // const data = useLoaderData<typeof loader>();
  return (
    <>
      <div>
        {/* todo - fix issue with link */}
        <ChangesTable changes={changes} />
      </div>

      <div style={{ marginBlockStart: '20px' }}>
        <p className="italic text-sm">* Показано лише останні 10 змін.</p>
        <p className="italic text-sm">Щоб переглянути повну історію змін по цьому продукту, перейдіть за посиланням нижче.</p>
        <Link className="link text-sm" to={`/home/changes?productId=${currentProductId}&page=1`} aria-label="Переглянути всі зміни по продукту">
          Переглянути всі →
        </Link>
      </div>

      <Outlet />
    </>
  );
}
