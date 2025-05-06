import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredProducts } from "~/server/products.server";
import ProductsTable from "~/components/ProductsTable";
import { Prisma } from "@prisma/client";
import { SortAndFilterBar } from "~/components/SortAndFilterBar";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);

  const url = new URL(request.url);
  const sort = url.searchParams.get("sort") ?? "name";
  const dir = url.searchParams.get("dir") ?? "asc";
  const filter = url.searchParams.get("q") ?? "";

  const direction: Prisma.SortOrder = dir === "desc" ? "desc" : "asc";
  let sortOptions: Prisma.ProductOrderByWithRelationInput = {};
  if (sort) {
    if (sort === "title") {
      sortOptions = { productTitle: `${direction}` };
    }
    if (sort === "updated") {
      sortOptions = { updatedAt: `${direction}` };
    }
  }
  const whereFilter: Prisma.ProductWhereInput = filter
    ? { productTitle: { contains: filter, mode: "insensitive" } }
    : {};

  const products: any = await getFilteredProducts(sortOptions, whereFilter);
  return Response.json(products, { status: 200 });
};

// todo - create can commiter or ADMIN
// todo - show all norms

export default function Products() {
  const products = useLoaderData<typeof loader>();
  // console.log(111, norms)
  return (
    <>
      <SortAndFilterBar />
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
