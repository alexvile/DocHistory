import { ReactNode } from "react";
import styles from "./Badge.module.css";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "yellow" | "red" | "green" | "blue";
};

export default function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {children}
    </span>
  );
}
