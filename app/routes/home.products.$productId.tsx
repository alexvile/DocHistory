import { LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet, useActionData, useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";
import BackLink from "~/components/BackLink";
import { LastChanged } from "~/components/LastChangedTooltip";
import { mapProductErrorToResponse } from "~/server/products.http.server";
import { getProductWithNormsById } from "~/server/products.server";

// todo - use props to path deeper
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
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
  const { productId } = useParams();
  const loaderData = useLoaderData<typeof loader>();
  // const actionData = useActionData<typeof action>();
  
  return (
    <div>
      {/* <h1>Product {productId}</h1> */}
      <div className="dashboard-topbar">
        <BackLink />
        <h3 className="product-details__title">
          {loaderData.product.title}
          <LastChanged date={loaderData.product.updatedAt} />
        </h3>
      
      </div>
      <nav style={{ display: "flex", gap: 16 }}>
        <NavLink to="overview">Overview</NavLink>
        <NavLink to="changes">Pending changes</NavLink>
        <NavLink to="history">History</NavLink>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}
