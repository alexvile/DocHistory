import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ProductSnapshotsTable from "~/components/route_based/ActiveSnapshotsTable";
import { getArchivedSnapshots } from "~/server/changes.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const productId = params.productId;
  const snapshots = await getArchivedSnapshots(productId);
  return {snapshots};
};
// todo - link to history/productid/snapshotId
export default function ProductSnapshots() {
  const loaderData = useLoaderData<typeof loader>();
  console.log(loaderData.snapshots);
  // #
  // Стан від
  return <div>Product snapshots<ProductSnapshotsTable snapshots={loaderData.snapshots} /></div>;
}
