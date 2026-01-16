import { Outlet } from "@remix-run/react";

import changesStyles from "~/styles/changes.css?url";
import changeListStyles from "~/components/ChangeList.css?url";
import sortAndFilterBarStyles from "~/components/SortAndFilterBar.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: changesStyles },
    { rel: "stylesheet", href: changeListStyles },
    { rel: "stylesheet", href: sortAndFilterBarStyles },
  ];
}
export default function ChangesLayout() {
  return <Outlet />;
}
