import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser, requireUserRole } from "~/server/auth.server";

import { ModalProvider } from "~/components/ModalProvider";
import SideMenu from "~/components/common/SideMenu";
import UserBar from "~/components/common/UserBar";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);
  const user = await getUser(request);
  if (!user) {
    throw redirect("/login");
  }
  // console.log('fetch in index')
  return { user: user };
};

// todo - structure

export default function Home() {
  const { user } = useLoaderData<typeof loader>();
  // ts check
  return (
    <>
      <ModalProvider>
        <header>
          {/* <h1>Document history</h1> */}
          <UserBar user={user} />
        </header>
        <SideMenu role={user.role} />
        <main>
          <Outlet />
        </main>
        <footer>
          <p>&copy; 2025 Your Company</p>
        </footer>
        <div id="modal-root"></div>
      </ModalProvider>
    </>
  );
}
