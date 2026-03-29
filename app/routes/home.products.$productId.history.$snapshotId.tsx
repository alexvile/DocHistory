import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import NormsTable from "~/components/NormsTable";
import { getSnapshotById } from "~/server/changes.server";
import { CanonicalRow } from "~/types";
import { formatDateForUA } from "~/utils/formatDateUA";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  invariant(params.snapshotId, "Missing productId param");
  const snapshotId = params.snapshotId;

  const snapshot = await getSnapshotById(snapshotId);

  return { snapshot };
};

export default function ProductSnapshot() {
  const loaderData = useLoaderData<typeof loader>();

  console.log(loaderData.snapshot);
// todo - navigate next -previous ??
  return (
    <div>
      <p>Продукт {loaderData.snapshot.product.title}</p>
      <p>Снапшот від: {formatDateForUA(loaderData.snapshot?.createdAt)}</p>
      <NormsTable normsJson={loaderData.snapshot.rows as CanonicalRow[]} />
    </div>
  );
}
