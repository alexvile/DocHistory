import { Outlet } from "@remix-run/react";

import extenderStyles from "~/components/Extender.css?url";
import tableStyles from "~/components/ProductNormsTable.css?url";
import lastChangedTooltipStyles from "~/components/LastChangedTooltip.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: extenderStyles },
    { rel: "stylesheet", href: tableStyles },
    { rel: "stylesheet", href: lastChangedTooltipStyles },
  ];
}

export default function ProductsLayout() {
  return <Outlet />;
}
