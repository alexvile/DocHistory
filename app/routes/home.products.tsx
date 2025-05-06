import { Outlet } from "@remix-run/react";

import extenderStyles from "~/components/Extender.css?url";
import backLinkStyles from "~/components/BackLink.css?url";
import tableStyles from "~/components/ProductNormsTable.css?url";
import lastChangedTooltipStyles from "~/components/LastChangedTooltip.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: extenderStyles },
    { rel: "stylesheet", href: tableStyles },
    { rel: "stylesheet", href: lastChangedTooltipStyles },
    { rel: "stylesheet", href: backLinkStyles },
  ];
}

export default function ProductsLayout() {
  return <Outlet />;
}
