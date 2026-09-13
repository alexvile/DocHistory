import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredUsers, getUsersCount } from "~/server/user.server";
import type { Prisma } from "@prisma/client";
import UsersTable from "~/components/UsersTable";
import type { SortConfig } from "~/types";
import { SortAndFilterBar } from "~/components/common/SortAndFilter/SortAndFilterBar";
import { Pagination } from "~/components/common/Pagination";
import { parsePaginationParams } from "~/utils/pagination.server";

const usersSortConfig: SortConfig = {
  default: "surname:asc",
  groups: [
    {
      label: "Прізвище",
      options: [
        { value: "surname:asc", label: "Прізвище: А–Я" },
        { value: "surname:desc", label: "Прізвище: Я–А" },
      ],
    },
    {
      label: "Ім’я",
      options: [
        { value: "name:asc", label: "Ім’я: А–Я" },
        { value: "name:desc", label: "Ім’я: Я–А" },
      ],
    },
  ],
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("q")?.trim();
  const direction: Prisma.SortOrder = url.searchParams.get("dir") === "desc" ? "desc" : "asc";
  const sortOptions: Prisma.UserOrderByWithRelationInput[] = [
    ...(sort === "name"
      ? [{ firstName: direction }, { lastName: direction }]
      : [{ lastName: direction }, { firstName: direction }]),
    { id: "asc" },
  ];
  const whereFilter: Prisma.UserWhereInput = {};
  if (filter) {
    whereFilter.OR = [
      { lastName: { mode: "insensitive", contains: filter } },
      { firstName: { mode: "insensitive", contains: filter } },
    ];
  }

  const { page: requestedPage, take } = parsePaginationParams(url.searchParams);
  const totalCount = await getUsersCount(whereFilter);
  const totalPages = Math.ceil(totalCount / take);
  const page = Math.min(requestedPage, Math.max(1, totalPages));
  const skip = (page - 1) * take;
  const filteredUsers = await getFilteredUsers(sortOptions, whereFilter, skip, take);
  return json({
    filteredUsers,
    page,
    totalPages,
    totalCount,
    fromPagination: totalCount === 0 ? 0 : skip + 1,
    toPagination: Math.min(skip + take, totalCount),
  });
};

export default function Users() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <h2>Користувачі</h2>
      <SortAndFilterBar
        sortConfig={usersSortConfig}
        showQueryFilter
        queryPlaceholder="Пошук за ім’ям або прізвищем"
      />
      <UsersTable users={data.filteredUsers} />
      {data.totalCount > 0 ? (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          fromPagination={data.fromPagination}
          toPagination={data.toPagination}
        />
      ) : (
        <p>Користувачів не знайдено.</p>
      )}
      <Outlet />
    </>
  );
}
