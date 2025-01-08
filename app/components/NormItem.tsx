import { Link, NavLink } from "@remix-run/react";
import { NormItem } from "~/types";

export default function NormsList({
  productName,
  createdAt,
  updatedAt,
  norm1,
  norm2,
  creatorId,
  id
}: NormItem) {
  // todo - edit -delete
  return (
    <li>
        {productName}
        {/* use NavLink to prevent rerendering in parent component */}
        {/* usememo to prevent rerender */}
        <Link to={id}>norm details</Link>

      {/* {productName}--{createdAt.toString()}--{updatedAt.toString()}--{norm1}--
      {norm2}--{creatorId} */}
    </li>
  );
}
