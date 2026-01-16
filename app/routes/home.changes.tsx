import { Outlet } from "@remix-run/react";

import changesStyles from "~/styles/changes.css?url";
import changeListStyles from "~/components/ChangeList.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: changesStyles },
    { rel: "stylesheet", href: changeListStyles },
  ];
}
export default function ChangesLayout() {
  return <Outlet />;
}
