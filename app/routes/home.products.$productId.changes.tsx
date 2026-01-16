import { Outlet, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getFilteredChangeSetsByProduct } from "~/server/changes.server";
import ChangeSetCard from "~/components/route_based/ChangeSetCard";
import { ChangeSetVM, NormDiff } from "~/types";
import ChangeSetList from "~/components/route_based/ChangeSetList";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const pendingChanges = await getFilteredChangeSetsByProduct(params.productId, { createdAt: "desc" }, { status: "DRAFT" }, 0, 20);
  // todo - tmp solution
  const changeSetVMs = pendingChanges.flatMap((cs) =>
    cs.diff
      ? [
          {
            ...cs,
            diff: cs.diff as NormDiff,
          },
        ]
      : []
  );
  return changeSetVMs;
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
  const loaderData = useLoaderData<typeof loader>();
  // console.log("loaderData", loaderData);
  return (
    <>
      {/* <ul className="list-unstyled">
        {loaderData.map(({ id, status, createdAt, diff, createdBy }) => (
          <li key={id}>
            <ChangeSetCard {...{ id, status, createdAt, diff, createdBy }} />
          </li>
        ))}
      </ul> */}
      <ChangeSetList changes={loaderData as ChangeSetVM[]}/>
      <Outlet />
    </>
  );
}
