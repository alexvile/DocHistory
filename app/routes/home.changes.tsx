import { Outlet } from "@remix-run/react";

import changeListStyles from "~/components/ChangeList.css?url";
import backLinkStyles from "~/components/BackLink.css?url";
import sortAndFilterBarStyles from "~/components/SortAndFilterBar.css?url";
import paginationStyles from "~/components/Pagination.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: changeListStyles },
    { rel: "stylesheet", href: backLinkStyles },
    { rel: "stylesheet", href: sortAndFilterBarStyles },
    { rel: "stylesheet", href: paginationStyles },
  ];
}
export default function ChangesLayout() {
  return <Outlet />;
}
