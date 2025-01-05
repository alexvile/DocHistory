import { ActionFunctionArgs, createCookieSessionStorage, json, LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import SideMenu from "~/components/SideMenu";
import UserBar from "~/components/UserBar";
import { requireUserId, requireUserRole } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);
  // await requireUserId(request);
  return json({ role });
};

// todo - structure

export default function Home() {
  const { role } = useLoaderData<typeof loader>();

  return (
    <>
      <header>
        <h1>Website Header</h1>
        <UserBar/>
      </header>
      <SideMenu />
      <main>
        <h2>Main Content</h2>
        <p> You role is: {role}</p>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2025 Your Company</p>
      </footer>
    </>
  );
}
