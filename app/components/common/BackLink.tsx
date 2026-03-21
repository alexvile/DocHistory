import { Link, useNavigate } from "@remix-run/react";
import { Icon } from "../ui/Icon";
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

// todo << level top
//  < history back

// export default function BackLink({
//   ariaLabel = "Назад",
//   type = "default",
// }: BackLinkProps) {
//   const navigate = useNavigate();

//   return (
//     <button
//       onClick={() => navigate(-1)}
//       aria-label={ariaLabel}
//       className={styles.link}
//     >
//       <Icon name="back" />
//     </button>
//   );
// }

// onClick={() => {
//   if (window.history.length > 1) {
//     navigate(-1);
//   } else {
//     navigate("/"); // або куди треба
//   }
// }}