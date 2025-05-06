import { Link } from "@remix-run/react";
import { Icon } from "./Icon";
type BackLinkProps = {
  ariaLabel?: string;
  type?: "history" | "default";
};

export default function BackLink({
  ariaLabel = "Назад",
  type = "default",
}: BackLinkProps) {
  return (
    <Link to=".." relative="path" aria-label={ariaLabel} className="backlink">
      <Icon name="back" />
    </Link>
  );
}
