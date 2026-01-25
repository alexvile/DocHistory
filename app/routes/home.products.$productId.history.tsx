import type { LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";


export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");

  return null;

};

export default function ProductSnapshots() {
  // const loaderData = useLoaderData<typeof loader>();
  return <div>Product snapshots</div>;
}
