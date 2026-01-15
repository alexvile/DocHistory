import { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = {
  children: ReactNode;
  tone?: "draft" | "active" | "default";
};

export default function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {children}
    </span>
  );
}
