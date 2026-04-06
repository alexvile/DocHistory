import { useNavigation } from "@remix-run/react";
import clsx from "clsx";
import styles from "./Page.module.css";

type PageProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Page({ children, className }: PageProps) {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";

  return (
    <div className={clsx(styles.page, isNavigating && styles["is-loading"], className)}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

// useEffect(() => {
//   if (isNavigating) {
//     const t = setTimeout(() => setShowLoading(true), 150);
//     return () => clearTimeout(t);
//   } else {
//     setShowLoading(false);
//   }
// }, [isNavigating]);