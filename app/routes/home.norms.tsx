import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import UsersList from "~/components/UsersList";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredUsers } from "~/server/user.server";
import type { User, Prisma } from "@prisma/client";
import { getFilteredNorms } from "~/server/norms.server";
import NormsList from "~/components/NormsList";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const role = await requireUserRole(request);

  // return null;
  const norms = await getFilteredNorms();
  return json({  norms });
};

// todo - create can commiter or ADMIN
// todo - show all norms
export default function Norms() {
    const { norms } = useLoaderData<typeof loader>();
    console.log(111, norms)
  return (
    <>
      <h2>Norms</h2>
      <Link to={"new"}>Add new+</Link>
      {norms.length ? <NormsList norms={norms}/> : null}
      <Outlet />
    </>
  );
}
