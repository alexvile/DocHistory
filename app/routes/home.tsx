import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser, requireUserRole } from "~/server/auth.server";

import { ModalProvider } from "~/components/ModalProvider";
import SideMenu from "~/components/common/SideMenu";
import { getUnreadCount } from "~/server/changes.server";
import Page from "~/components/ui/Page";
import Breadcrumbs from "~/components/common/Breadcrumbs";

export const loader: LoaderFunction = async ({ request }) => {
  const role = await requireUserRole(request);
  const user = await getUser(request);

  if (!user) {
    throw redirect("/login");
  }
  let count = 0;
  if (role === "VIEWER") {
    const id = user.id;
    count = await getUnreadCount(id);
  }
  // console.log('fetch in index')
  return { user, role, count };
};

// todo - structure

export default function Home() {
  const { user, role, count } = useLoaderData<typeof loader>();
  // if(role === "VIEWER") {

  // }
  // console.log("cc", count);
  // ts check
  return (
    <>
      <ModalProvider>
        {/* <header>
          <UserBar user={user} />
        </header> */}
        <SideMenu user={user} count={count} />
        <main>
          <Page>
            <Breadcrumbs />
            <Outlet />
          </Page>
        </main>
        {/* <footer><p style={{ marginBlock: "6px" }}>&copy; 2026 Your Company</p></footer> */}
        <div id="modal-root"></div>
      </ModalProvider>
    </>
  );
}
