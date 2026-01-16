import styles from "./Accordion.module.css";
import type { ReactNode } from "react";

type AccordionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
};

function AccordionRoot({ children, defaultOpen = false }: AccordionProps) {
  return (
    <details className={styles.accordion} open={defaultOpen}>
      {children}
    </details>
  );
}

type SummaryProps = {
  children: ReactNode;
};

function AccordionSummary({ children }: SummaryProps) {
  return (
    <summary className={styles.summary}>
      {children}
      <span className={styles.icon} />
    </summary>
  );
}

type ContentProps = {
  children: ReactNode;
};

function AccordionContent({ children }: ContentProps) {
  return <div className={styles.content}>{children}</div>;
}

/* compound export */
export const Accordion = Object.assign(AccordionRoot, {
  Summary: AccordionSummary,
  Content: AccordionContent,
});
