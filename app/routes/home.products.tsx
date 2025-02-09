import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import UsersList from "~/components/UsersList";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredUsers } from "~/server/user.server";
import type { User, Prisma } from "@prisma/client";
import { getFilteredProducts } from "~/server/products.server";
import ProductsTable from "~/components/ProductsTable";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);

  // return null;
  const products = await getFilteredProducts();
  return json({  products });
};

// todo - create can commiter or ADMIN
// todo - show all norms
export default function Products() {
    const { products } = useLoaderData<typeof loader>();
    // console.log(111, norms)
  return (
    <>
      <h2>Products</h2>
      <Link to={"new"} className="link-unstyled button--primary">Add new+</Link>
      <h3>All products</h3>
      <ProductsTable products={products}/>
      <Outlet />
    </>
  );
}
