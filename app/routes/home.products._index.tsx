import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredProducts } from "~/server/products.server";
import ProductsTable from "~/components/ProductsTable";

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
      <div className="products-all__top">
        <h2 className="products-all__title">Всі продукти</h2>
        <Link
          to={"new"}
          className="link-unstyled button button--primary"
          aria-label="Додати продукт"
        >
          Додати
        </Link>
      </div>

      <div className="products-table__wrapper">
        <ProductsTable products={products} />
      </div>
      <Outlet />
    </>
  );
}
