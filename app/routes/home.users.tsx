import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredUsers } from "~/server/user.server";
import type { Prisma } from "@prisma/client";
import UsersTable from "~/components/UsersTable";
import { FilteredUser } from "~/types";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);
  if (role !== "ADMIN") {
    throw new Response("Forbidden: Access denied", { status: 403 });
  }
  // return null;

  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const filter = url.searchParams.get("filter");
  const dir = url.searchParams.get("dir");

  const direction: Prisma.SortOrder = dir as Prisma.SortOrder;
  let sortOptions: Prisma.UserOrderByWithRelationInput = {};
  if (sort) {
    if (sort === "name") {
      sortOptions = { firstName: `${direction}` };
    }
    if (sort === "surname") {
      sortOptions = { lastName: `${direction}` };
    }
  }
  let whereFilter: Prisma.UserWhereInput = {};
  let textFilter: Prisma.UserWhereInput = {};
  if (filter) {
    textFilter = {
      OR: [
        { lastName: { mode: "insensitive", contains: filter } },
        { firstName: { mode: "insensitive", contains: filter } },
      ],
    };
  }
  whereFilter = { ...textFilter };

  const filteredUsers: FilteredUser[] = await getFilteredUsers(
    sortOptions,
    whereFilter
  );
  return json({ filteredUsers });
};

export default function Users() {
  const { filteredUsers } = useLoaderData<typeof loader>();
  const typedUsers = filteredUsers as FilteredUser[];
  return (
    <>
      <h2>Users</h2>
      <UsersTable users={typedUsers} />
      <Outlet />
    </>
  );
}
