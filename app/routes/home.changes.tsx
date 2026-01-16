import { Outlet } from "@remix-run/react";

import changesStyles from "~/styles/changes.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: changesStyles },
  ];
}
export default function ChangesLayout() {
  return <Outlet />;
}
