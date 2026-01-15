import { Link } from "@remix-run/react";
import { Icon } from "../Icon";
import styles from "./BackLink.module.css";
type BackLinkProps = {
  ariaLabel?: string;
  type?: "history" | "default";
};

export default function BackLink({
  ariaLabel = "Назад",
  type = "default",
}: BackLinkProps) {
  return (
    <Link to=".." relative="path" aria-label={ariaLabel} className={styles.link}>
      <Icon name="back" />
    </Link>
  );
}
