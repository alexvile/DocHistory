import { Link, useSearchParams } from "@remix-run/react";
import { Icon } from "./Icon";

type PaginationProps = {
  page: number;
  totalPages: number;
  fromPagination: number;
  toPagination: number;
  totalCount: number;
};
export function Pagination({
  page,
  totalPages,
  fromPagination,
  toPagination,
  totalCount,
}: PaginationProps) {
  const [searchParams] = useSearchParams();

  const createLink = (targetPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", targetPage.toString());
    return `?${newParams.toString()}`;
  };

  return (
    <div className="pagination">
      <div className="pagination__buttons">
        {page > 1 ? (
          <Link
            to={createLink(page - 1)}
            className="link-unstyled pagination__btn pagination__btn--back"
            aria-label="Назад"
          >
            <Icon name="back" />
          </Link>
        ) : (
          <span className="link-unstyled pagination__btn pagination__btn--back disabled">
            <Icon name="back" />
          </span>
        )}
        {page < totalPages ? (
          <Link
            to={createLink(page + 1)}
            className="link-unstyled pagination__btn pagination__btn--next"
            aria-label="Вперед"
          >
            <Icon name="next" />
          </Link>
        ) : (
          <span className="link-unstyled pagination__btn pagination__btn--next disabled">
            <Icon name="next" />
          </span>
        )}
      </div>

      <span className="pagination__info">
        Сторінка: {page} з {totalPages}
      </span>
      <span>
        &nbsp; Показано: {fromPagination}–{toPagination} з {totalCount}
      </span>
    </div>
  );
}
