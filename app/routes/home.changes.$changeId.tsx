import { isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import BackLink from "~/components/common/BackLink";
import { assignApproverToChangeSet, getPopulatedChangeSetById, rejectChangeSet } from "~/server/changes.server";
import ChangeSetCard from "~/components/route_based/ChangeSetCard";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { getApprovers } from "~/server/user.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.changeId, "Missing contactId param");
  const userId = await getUserId(request);
  if (!userId) return null;

  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log(intent);

  if (intent === "assign-approver") {
    const changeSetId = formData.get("changeSetId");
    const approverId = formData.get("approverId");

    if (!changeSetId || !approverId) return null;
    if (typeof changeSetId !== "string" || typeof approverId !== "string") return null;

    await assignApproverToChangeSet({
      changeSetId,
      approverId,
    });

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
  invariant(params.changeId, "Missing productId param");

  // todo optimize

  const role = await requireUserRole(request);
  const userId = await getUserId(request);

  if (typeof userId !== "string") return null;

  let approvers = [];
  if (role === "COMMITTER") {
    approvers = await getApprovers(userId);
  }

  const changeSet = await getPopulatedChangeSetById(params.changeId);
  if (!changeSet) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { role, userId, changeSet, approvers };
};

// export function ErrorBoundary() {
//   const error = useRouteError();
//   if (isRouteErrorResponse(error)) {
//     if (error.status === 404) {
//       return <p>Зміну не знайдено (404)</p>;
//     }

//     return (
//       <div>
//         <h1>Помилка: {error.status}</h1>
//         <p>{error.statusText}</p>
//       </div>
//     );
//   }

//   return <p>Щось пішло не так</p>;
// }

export default function ChangeSet() {
  const { role, userId, changeSet, approvers } = useLoaderData();
  const { id, status, createdAt, diff, createdBy, approver, approverId, decidedAt } = changeSet;
  return (
    <>
      <div>
        {/* <h1>Product {productId}</h1> */}
        <div className="dashboard-topbar">
          <BackLink />
          <h3 className="1product-details__title">
            Зміна....від такого
            {/* {loaderData.product.title}
              <LastChanged date={loaderData.product.updatedAt} /> */}
          </h3>
        </div>
        <ChangeSetCard {...{ id, status, createdAt, diff, createdBy, role, approver, userId, approverId, decidedAt, approvers }} />
        <Outlet />
      </div>
    </>
  );
}
