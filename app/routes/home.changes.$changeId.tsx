import { isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import BackLink from "~/components/common/BackLink";
import { approveChangeSet, assignApproverToChangeSet, getPopulatedChangeSetById, rejectChangeSet } from "~/server/changes.server";
import ChangeSetCard from "~/components/route_based/ChangeSetCard";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { getApprovers } from "~/server/user.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.changeId, "Missing contactId param");
  const changeSetId = params.changeId;
  const userId = await getUserId(request);
  if (!userId) return null;

  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log(intent);

  if (intent === "assign-approver") {
    const approverId = formData.get("approverId");

    if (!approverId) return null;
    if (typeof approverId !== "string") return null;

    await assignApproverToChangeSet({
      changeSetId,
      approverId,
    });

    return null;
    // return redirect(request.url);
  }
  // todo validation!!!!!!
  if (intent === "reject") {
    await rejectChangeSet({
      changeSetId,
      decidedById: userId,
    });
    return null;
    // return redirect(request.url);
  }

  if (intent === "approve") {
    const res = await approveChangeSet({ changeSetId, decidedById: userId });
    console.log("approve", res);
    return null;
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


  if(role === 'VIEWER') {
    //  await prisma.changeSetView.upsert({
    //   where: {
    //     changeSetId_userId: {
    //       changeSetId,
    //       userId: user.id,
    //     },
    //   },
    //   update: {},
    //   create: {
    //     changeSetId,
    //     userId: user.id,
    //   },
    // });
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
            Зміна....від такого для продукта
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
