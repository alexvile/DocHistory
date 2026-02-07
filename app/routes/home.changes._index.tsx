import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredProducts, getTotalProductsCount } from "~/server/products.server";
import ProductsTable from "~/components/ProductsTable";
import { ChangeSetStatus, Prisma } from "@prisma/client";
import { SortAndFilterBar } from "~/components/common/SortAndFilter/SortAndFilterBar";
import { Pagination } from "~/components/common/Pagination";
import ChnagesTable from "~/components/route_based/ChangesTable";
import { getFilteredChangeSets, getFilteredChangeSetsByProduct, getTotalChangesCount } from "~/server/changes.server";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);

  const url = new URL(request.url);

  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const take = Math.max(1, Number(url.searchParams.get("limit") ?? 10));
  const skip = (page - 1) * take;

  // фільтри
  const productId = url.searchParams.get("productId"); // з комбобокса
  const statusParam = url.searchParams.get("status"); // DRAFT | APPROVED | REJECTED

  // сортування — ТІЛЬКИ по даті
  const orderBy: Prisma.ChangeSetOrderByWithRelationInput = {
    createdAt: "desc",
  };

  // where формується динамічно
  const where: Prisma.ChangeSetWhereInput = {
    ...(productId && { productId }),
    ...(statusParam && { status: statusParam as ChangeSetStatus }),
  };

  const totalCount = await getTotalChangesCount(where);
  const totalPages = Math.ceil(totalCount / take);

  const changes = await getFilteredChangeSets(
    where,
    orderBy,
    skip,
    take
  );

  return {
    changes,
    page,
    totalPages,
    totalCount,
    fromPagination: skip + 1,
    toPagination: Math.min(skip + take, totalCount),
    role,
  };
};
// todo - rewrite all to future responses

// todo - create can commiter or ADMIN
// todo - show all norms

export default function Products() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <SortAndFilterBar />
      <div>
        <ChnagesTable changes={data?.changes} />
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
