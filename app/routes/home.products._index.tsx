import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import {
  getFilteredProducts,
  getTotalProductsCount,
} from "~/server/products.server";
import ProductsTable from "~/components/ProductsTable";
import { Prisma } from "@prisma/client";
import { SortAndFilterBar } from "~/components/SortAndFilterBar";
import { prisma } from "~/server/prisma.server";
import { Pagination } from "~/components/Pagination";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  // const role = await requireUserRole(request);

  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page") ?? "1";
  const limitParam = url.searchParams.get("limit") ?? "10";
  const page = Math.max(1, parseInt(pageParam));
  const take = Math.max(1, parseInt(limitParam));
  const skip = (page - 1) * take;

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
  const totalCount = await getTotalProductsCount(whereFilter);
  const totalPages = Math.ceil(totalCount / take);

  const products = await getFilteredProducts(
    sortOptions,
    whereFilter,
    skip,
    take
  );
  return Response.json({ products, page, totalPages }, { status: 200 });
};

// todo - create can commiter or ADMIN
// todo - show all norms

export default function Products() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <SortAndFilterBar />
      <Pagination page={data.page} totalPages={data.totalPages} />
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
        <ProductsTable products={data?.products} />
      </div>
      <Outlet />
    </>
  );
}
