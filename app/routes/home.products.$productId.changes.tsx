import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getFilteredChangeSetsByProduct, getTotalChangesCount } from "~/server/changes.server";
import { NormDiff } from "~/types";
import ChangeSetList from "~/components/route_based/ChangeSetList";
import { requireUserRole } from "~/server/auth.server";
import { ChangeSetStatus, Prisma } from "@prisma/client";
import { SortAndFilterBar } from "~/components/common/SortAndFilter/SortAndFilterBar";
import { Pagination } from "~/components/common/Pagination";
import ChnagesTable from "~/components/route_based/ChangesTable";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  // invariant(params.productId, "Missing contactId param");
  // const userIdFromSession = await getUserId(request);

  const formData = await request.formData();
  const raw = Object.fromEntries(formData);
  console.log(raw);

  return null;
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const role = await requireUserRole(request);
  const productId = params.productId;
  const lastPendingChanges = await getFilteredChangeSetsByProduct(params.productId, { createdAt: "desc" }, { status: "DRAFT" }, 0, 20);
  // todo - tmp solution
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

  // const role = await requireUserRole(request);


  // invariant(params.productId, "Missing productId param");
  // try {
  //   const { product, currentSnapshot } = await getProductWithNormsById(params.productId);
  //   return {
  //     product,
  //     norms: currentSnapshot.rows,
  //   };
  // } catch (error) {
  //   mapProductErrorToResponse(error);
  // }
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
