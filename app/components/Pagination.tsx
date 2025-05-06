import { useSearchParams } from "@remix-run/react";

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
      {page > 1 && (
        <a href={createLink(page - 1)} className="pagination__btn">
          ← Назад
        </a>
      )}
      <span className="pagination__info">
        Сторінка {page} з {totalPages}
      </span>
      <span>&nbsp;
        Показано: {fromPagination}–{toPagination} з {totalCount}
      </span>
      {page < totalPages && (
        <a href={createLink(page + 1)} className="pagination__btn">
          Вперед →
        </a>
      )}
    </div>
  );
}
