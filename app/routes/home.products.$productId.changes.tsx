import { Form, isRouteErrorResponse, Outlet, useActionData, useLoaderData, useRouteError } from "@remix-run/react";
import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { createChangeSet, getFilteredChangeSetsByProduct } from "~/server/changes.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const pending = await getFilteredChangeSetsByProduct(params.productId, { createdAt: "desc" }, { status: "DRAFT" }, 0, 20);

  return pending;
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

export default function ProductNorm() {
  const loaderData = useLoaderData<typeof loader>();
  console.log("loaderData", loaderData);
  return (
    <>
      <div className="edit-button__wrapper">changes</div>
      <Outlet />
    </>
  );
}
