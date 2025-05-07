import { Outlet } from "@remix-run/react";

import productsStyles from "~/styles/products.css?url";
import extenderStyles from "~/components/Extender.css?url";
import backLinkStyles from "~/components/BackLink.css?url";
import tableStyles from "~/components/ProductNormsTable.css?url";
import lastChangedTooltipStyles from "~/components/LastChangedTooltip.css?url";
import sortAndFilterBarStyles from "~/components/SortAndFilterBar.css?url";
import paginationStyles from "~/components/Pagination.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: productsStyles },
    { rel: "stylesheet", href: extenderStyles },
    { rel: "stylesheet", href: tableStyles },
    { rel: "stylesheet", href: lastChangedTooltipStyles },
    { rel: "stylesheet", href: backLinkStyles },
    { rel: "stylesheet", href: sortAndFilterBarStyles },
    { rel: "stylesheet", href: paginationStyles },
  ];
}

export default function ProductsLayout() {
  return <Outlet />;
}
