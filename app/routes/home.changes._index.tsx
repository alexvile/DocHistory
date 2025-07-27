import { Prisma } from "@prisma/client";
import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import ChangesTable from "~/components/ChangesTable";
import { Pagination } from "~/components/Pagination";
import { SortAndFilterBar } from "~/components/SortAndFilterBar";
import { getFilteredChanges, getTotalChangesCount } from "~/server/changes.server";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
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
  // const whereFilter: Prisma.ChangeWhereInput = filter
  //   ? { productTitle: { contains: filter, mode: "insensitive" } }
  //   : {};
  const whereFilter = {};
  const totalCount = await getTotalChangesCount(whereFilter);
  const totalPages = Math.ceil(totalCount / take);

  const fromPagination = skip + 1;
  const toPagination = Math.min(skip + take, totalCount);

  const changes = await getFilteredChanges(sortOptions, whereFilter, skip, take);
  return Response.json({ changes, page, totalPages, totalCount, fromPagination, toPagination }, { status: 200 });
};

export default function Changes() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <>
    {/* todo - change sort and filter bar */}
      <SortAndFilterBar />
      {/* todo - update classes, use universal class */}
      <div className="products-all__top">
        <h2 className="products-all__title">Всі зміни</h2>
      </div>

      <div className="products-table__wrapper">
        <ChangesTable changes={data?.changes} />
      </div> 
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        fromPagination={data.fromPagination}
        toPagination={data.toPagination}
        totalCount={data.totalCount}
      />
      <Outlet />
    </>
  );
}
