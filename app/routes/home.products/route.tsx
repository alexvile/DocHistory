import { Outlet } from "@remix-run/react";

import productsStyles from "~/styles/products.css?url";
import lastChangedTooltipStyles from "~/components/LastChangedTooltip.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: productsStyles },
    { rel: "stylesheet", href: lastChangedTooltipStyles },
  ];
}

export default function ProductsLayout() {
  return <Outlet />;
}
