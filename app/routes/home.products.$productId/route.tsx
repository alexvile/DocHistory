import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/common/BackControls";
import { LastChanged } from "~/components/LastChangedTooltip";
import ProductNavigation from "~/components/ProductNavigation";
import RouteError from "~/components/ui/RouteError";
import { mapProductErrorToResponse } from "~/server/products.http.server";
import { getProductWithNormsById } from "~/server/products.server";
import { throwDevelopmentLoaderTestError } from "~/server/development-errors.server";

import productNavStyles from "~/styles/product-nav.css?url";

export function links() {
  return [{ rel: "stylesheet", href: productNavStyles }];
}
// todo - use props to path deeper
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  throwDevelopmentLoaderTestError(params.productId);
  try {
    const { product, currentSnapshot } = await getProductWithNormsById(params.productId);
    return {
      product,
      norms: currentSnapshot.rows,
    };
  } catch (error) {
    mapProductErrorToResponse(error);
  }
};

export default function ProductLayout() {
  const loaderData = useLoaderData<typeof loader>();
  // const actionData = useActionData<typeof action>();

  return (
    <div>
      {/* <h1>Product {productId}</h1> */}
      <div className="dashboard-topbar">
        <BackLink />
        <div>
          <div className="flex items-center gap-8">
            <h3 className="margin-0">{loaderData.product.title}</h3>
            <LastChanged date={loaderData.product.updatedAt} />
          </div>
          {loaderData.product.code && <p className="margin-0 text-sm italic">{loaderData.product.code}</p>}
        </div>
      </div>
      <ProductNavigation />
      <Outlet />
    </div>
  );
}

export function ErrorBoundary() {
  return <RouteError />;
}
