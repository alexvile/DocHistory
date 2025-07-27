import { Prisma } from "@prisma/client";
import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import ChangesTable from "~/components/ChangesTable";
import { Pagination } from "~/components/Pagination";
import { SortAndFilterBar } from "~/components/SortAndFilterBar";
import { getFilteredChanges, getTotalChangesCount } from "~/server/changes.server";

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  return null;
};

export default function Help() {
  return (
    <>
      Допомога
      <Outlet />
    </>
  );
}
