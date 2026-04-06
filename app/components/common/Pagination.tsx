import { Link, useSearchParams } from "@remix-run/react";
import { Icon } from "../ui/Icon";
import styles from "./Pagination.module.css";
import clsx from "clsx";

type PaginationProps = {
  page: number;
  totalPages: number;
  fromPagination: number;
  toPagination: number;
  totalCount: number;
};

export function Pagination({ page, totalPages, fromPagination, toPagination, totalCount }: PaginationProps) {
  const [searchParams] = useSearchParams();

  const createLink = (targetPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", targetPage.toString());
    return `?${newParams.toString()}`;
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationButtons}>
        {page > 1 ? (
          <Link to={createLink(page - 1)} className={clsx("link-unstyled", styles.paginationButton, styles.backward)} aria-label="Назад">
            <Icon name="back" />
          </Link>
        ) : (
          <span className={clsx("link-unstyled", "disabled", styles.paginationButton, styles.backward)}>
            <Icon name="back" />
          </span>
        )}
        {page < totalPages ? (
          <Link to={createLink(page + 1)} className={clsx("link-unstyled", styles.paginationButton, styles.forward)} aria-label="Вперед">
            <Icon name="next" />
          </Link>
        ) : (
          <span className={clsx("link-unstyled", "disabled", styles.paginationButton, styles.forward)}>
            <Icon name="next" />
          </span>
        )}
      </div>

      <span className={styles.paginationInfo}>
        Сторінка: {page} з {totalPages}
      </span>
      <span className={styles.paginationShownItems}>
        &nbsp; Показано: {fromPagination}–{toPagination} з {totalCount}
      </span>
    </div>
  );
}
