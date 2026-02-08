import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredProducts, getTotalProductsCount } from "~/server/products.server";
import ProductsTable from "~/components/ProductsTable";
import { Prisma } from "@prisma/client";
import { SortAndFilterBar } from "~/components/common/SortAndFilter/SortAndFilterBar";
import { Pagination } from "~/components/common/Pagination";
import productSortConfig from "./productSortConfig";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);

  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page") ?? "1";
  const limitParam = url.searchParams.get("limit") ?? "10";
  const page = Math.max(1, parseInt(pageParam));
  const take = Math.max(1, parseInt(limitParam));
  const skip = (page - 1) * take;

  const defaultSort = productSortConfig.default;
  const sort = url.searchParams.get("sort") ?? defaultSort.split(":")[0];
  const dir = url.searchParams.get("dir") ?? defaultSort.split(":")[1];

  const filter = url.searchParams.get("q") ?? "";

  const direction: Prisma.SortOrder = dir === "desc" ? "desc" : "asc";
  let sortOptions: Prisma.ProductOrderByWithRelationInput = {};
  if (sort) {
    if (sort === "title") {
      sortOptions = { title: `${direction}` };
    }
    if (sort === "updated") {
      sortOptions = { updatedAt: `${direction}` };
    }
  }

  const whereFilter: Prisma.ProductWhereInput = filter ? { title: { contains: filter, mode: "insensitive" } } : {};
  const totalCount = await getTotalProductsCount(whereFilter);
  const totalPages = Math.ceil(totalCount / take);

  const fromPagination = skip + 1;
  const toPagination = Math.min(skip + take, totalCount);

  const products = await getFilteredProducts(sortOptions, whereFilter, skip, take);
  return { products, page, totalPages, totalCount, fromPagination, toPagination, role };
};
// todo - rewrite all to future responses

// todo - create can commiter or ADMIN
// todo - show all norms

export default function Products() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <SortAndFilterBar sortConfig={productSortConfig} showQueryFilter={true} />
      <div className="products-all__top">
        <h2 className="products-all__title">Всі продукти</h2>
        {data?.role === "COMMITTER" && (
          <Link to={"new"} className="link-unstyled button button--primary" aria-label="Додати продукт">
            Додати
          </Link>
        )}
      </div>

      <div className="products-table__wrapper">
        <ProductsTable products={data?.products} />
      </div>
      {data?.products?.length > 0 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          fromPagination={data.fromPagination}
          toPagination={data.toPagination}
          totalCount={data.totalCount}
        />
      )}
      <Outlet />
    </>
  );
}
