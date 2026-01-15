import { Form, isRouteErrorResponse, Outlet, useActionData, useLoaderData, useRouteError } from "@remix-run/react";
import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createChangeSet, getFilteredChangeSetsByProduct } from "~/server/changes.server";
import ChangeSetCard from "~/components/ChangeSetCard";
import { ChangeSetVM, NormDiff } from "~/types";

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
  console.log("loaderData", loaderData);
  return (
    <>
      <ul className="list-unstyled">
        {loaderData.map(({ id, status, createdAt, diff }) => (
          <li key={id}>
            <ChangeSetCard {...{ id, status, createdAt, diff }} />
          </li>
        ))}
      </ul>
      <Outlet />
    </>
  );
}
