import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { assignApproverToChangeSet, getFilteredChangeSets, getFilteredChangeSetsByProduct } from "~/server/changes.server";
import { NormDiff } from "~/types";
import ChangeSetList from "~/components/route_based/ChangeSetList";
import { requireUserRole } from "~/server/auth.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // invariant(params.productId, "Missing contactId param");
  // const userIdFromSession = await getUserId(request);

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
  return null;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const role = await requireUserRole(request);


  // todo - depend on role
  // admin - on review + approved
  // commit - draft + approved + onreview
  // viewer - only approved
  const lastPendingChanges = await getFilteredChangeSets(
    {
      productId: params.productId,
      status: {
        in: ["DRAFT", "ON_REVIEW"],
      },
    },
    { createdAt: "desc" },
    0,
    50,
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
  return { changes: changeSetVMs, role };
};

export default function NormChanges() {
  const { changes, role } = useLoaderData<typeof loader>();
  // const data = useLoaderData<typeof loader>();
  return (
    <>
      <ChangeSetList changes={changes} role={role} />
      <Outlet />
    </>
  );
}
