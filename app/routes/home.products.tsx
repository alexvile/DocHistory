import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredProducts } from "~/server/products.server";
import ProductsTable from "~/components/ProductsTable";

import extenderStyles from "~/components/Extender.css?url";
import tableStyles from "~/components/ProductNormsTable.css?url";
import lastChangedTooltipStyles from "~/components/LastChangedTooltip.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: extenderStyles },
    { rel: "stylesheet", href: tableStyles },
    { rel: "stylesheet", href: lastChangedTooltipStyles },
  ];
}
export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);

  // return null;
  const products = await getFilteredProducts();
  return json({ products });
};

// todo - create can commiter or ADMIN
// todo - show all norms
export default function Products() {
  const { products } = useLoaderData<typeof loader>();
  // console.log(111, norms)
  return (
    <>
      <h2>== Продукти ==</h2>
      <Link
        to={"new"}
        className="link-unstyled button button--primary"
        aria-label="Додати продукт"
      >
        Додати продукт
      </Link>
      <h3>Всі продукти</h3>
      <div className="products-table__wrapper">
        <ProductsTable products={products} />
      </div>
      <Outlet />
    </>
  );
}
