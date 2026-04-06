import { isRouteErrorResponse, Outlet, redirect, useLoaderData, useRouteError } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import BackLink from "~/components/common/BackLink";
import {
  approveChangeSet,
  assignApproverToChangeSet,
  deleteChangeSetWithSnapshot,
  getLightChangeById,
  getPopulatedChangeSetById,
  rejectChangeSet,
  viewChange,
} from "~/server/changes.server";
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

  // if role === commiter - status == draft and intent === 'remove'

  if (intent === "remove") {
    console.log("remove");
    // todo remove changset
    // todo remove connected product snapshot
    // todo redirect to home/changes
  }

  if (intent === "remove") {
    const changeSet = await getLightChangeById(changeSetId);

    if (!changeSet) {
      throw new Error("ChangeSet not found");
    }

    // // ❌ не даємо видаляти підтверджені
    // if (changeSet.status === "APPROVED") {
    //   throw new Error("Cannot delete approved ChangeSet");
    // }

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
    return redirect("/home/changes");
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

  const changeId = params.changeId;
  if (role === "VIEWER") {
    // await viewChange(userId, changeId);
  }

  // todo
  // const viewersCount = await prisma.changeSetView.count({
  //   where: { changeSetId: id },
  // });

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
  const data = useLoaderData();
  console.log(121212, data);
  const { role, userId, changeSet, approvers } = data;
  const { id, status, createdAt, diff, createdBy, approver, approverId, decidedAt, product } = changeSet;
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
        <ChangeSetCard {...{ id, status, createdAt, diff, createdBy, role, approver, userId, approverId, decidedAt, approvers }} />
        <Outlet />
      </div>
    </>
  );
}
