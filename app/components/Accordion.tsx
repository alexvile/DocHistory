import styles from "./Accordion.module.css";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) {
  return (
    <details className={styles.accordion} open={defaultOpen}>
      <summary className={styles.summary}>
        {title}
        <span className={styles.icon} />
      </summary>

      <div className={styles.content}>{children}</div>
    </details>
  );
}
