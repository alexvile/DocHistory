import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import UsersList from "~/components/UsersList";
import { requireUserRole } from "~/server/auth.server";
import { getFilteredUsers } from "~/server/user.server";
import type { User, Prisma } from "@prisma/client";
import { getAllChanges } from "~/server/changes.server";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  await requireUserRole(request);
  //  todo paginatino, filtration. sort, where filter etc
  // return null;
  const changes = await getAllChanges();
  return json({ changes });
};

const ChangeDisplay = ({ change }: { change: Record<string, { before: number; after: number }> }) => {
  return (
    <div>
      <h3>Зміни</h3>
      <ul>
        {Object.entries(change).map(([key, value]) => (
          <li key={key}>
            <strong>{key}</strong>: 
            <span style={{ color: "red" }}> До: {value.before}</span>, 
            <span style={{ color: "green" }}> Після: {value.after}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default function Changes() {
  const { changes } = useLoaderData<typeof loader>();
  console.log(12121, changes);
  return (
    <>
      <h2>Changes</h2>
      {changes.length ? (
        <ul>
          {changes.map((change) => (
            <li key={change.id}>
              <p>Where: {change.norm.productName}</p>
              <p>
                Whom: {change.user.firstName}_{change.user.lastName}
              </p>
              <p>When: {change.createdAt}</p>
              <p>What: 
              <ChangeDisplay change={change?.changes} />
              </p>
            </li>
          ))}
        </ul>
      ) : (
        "No data"
      )}
      <Outlet />
    </>
  );
}
