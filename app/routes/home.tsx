import {
  ActionFunctionArgs,
  createCookieSessionStorage,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import SideMenu from "~/components/SideMenu";
import UserBar from "~/components/UserBar";
import { getUser, requireUserId, requireUserRole } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);
  const user = await getUser(request);
  if(!user) {
    throw redirect("/login");
  }
  // console.log('fetch in index')
  return json({ user: user });
};

// todo - structure

export default function Home() {
  const { user } = useLoaderData<typeof loader>();
// ts check
  return (
    <>
      <header>
        <h1>Website Header</h1>
        <UserBar user={user} />
      </header>
      <SideMenu role={user.role} />
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2025 Your Company</p>
      </footer>
    </>
  );
}
