import styles from "./Status.module.css";

type StatusProps = {
  tone?: "default" | "yellow" | "red" | "green" | "blue";
};

export default function Status({ tone = "default" }: StatusProps) {
  return <span className={`${styles.status} ${styles[tone]}`}></span>;
}
