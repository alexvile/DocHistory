import { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUserId, requireUserRole } from "~/server/auth.server";
import { ChangeSetStatus, Prisma } from "@prisma/client";
import { SortAndFilterBar } from "~/components/common/SortAndFilter/SortAndFilterBar";
import { Pagination } from "~/components/common/Pagination";
import ChangesTable from "~/components/route_based/ChangesTable";
import { getFilteredChangeSets, getTotalChangesCount } from "~/server/changes.server";
import changesSortConfig from "./changesSortConfig";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);
  const userId = await getUserId(request);

  const url = new URL(request.url);

  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const take = Math.max(1, Number(url.searchParams.get("limit") ?? 10));
  const skip = (page - 1) * take;

  const defaultSort = changesSortConfig.default;
  const dir = url.searchParams.get("dir") ?? defaultSort.split(":")[1];
  const direction: Prisma.SortOrder = dir === "asc" ? "asc" : "desc";
  const orderBy: Prisma.ChangeSetOrderByWithRelationInput = {
    createdAt: direction,
  };
  // фільтри
  const productId = url.searchParams.get("productId"); // з комбобокса
  const statusParam = url.searchParams.get("status"); // DRAFT | APPROVED | REJECTED
  const myOnly = url.searchParams.get("my") === "1";

  // where формується динамічно
  const where: Prisma.ChangeSetWhereInput = {
    ...(productId && { productId }),
    ...(statusParam && { status: statusParam as ChangeSetStatus }),
  };

  if (myOnly) {
    // todo - fix warning
    if (role === "ADMIN") {
      where.approverId = userId;
    }

    if (role === "COMMITTER") {
      where.createdById = userId;
    }
  }

  const totalCount = await getTotalChangesCount(where);
  const totalPages = Math.ceil(totalCount / take);

  const changes = await getFilteredChangeSets(where, orderBy, skip, take);

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

export default function Changes() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <SortAndFilterBar
        sortConfig={changesSortConfig}
        showChangeStatusFilter={true}
        showMyFilter={data.role === "ADMIN" || data.role === "COMMITTER"}
      />
      <div>
        <ChangesTable changes={data?.changes} />
      </div>
      {data?.changes?.length > 0 && (
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
