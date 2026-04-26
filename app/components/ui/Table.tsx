import React, { ReactNode } from "react";
import styles from "./Table.module.css";
import { Icon } from "./Icon";
import clsx from "clsx";
import { debounce } from "~/utils/debounce";

type TableProps = {
  headings: string[];
  children: ReactNode;
  layout?: boolean;
  stickyHeader?: boolean;
};

function EmptyState() {
  return (
    <div className={styles.emptyStateContainer}>
      <Icon name="magnify" />
      <p className={styles.emptyStateHeading}>Інформації не знайдено</p>
      <p className={styles.emptyStateDescription}>Спробуйте змінити фільтри або пошуковий запит</p>
    </div>
  );
}
function Table({ children, headings, layout, stickyHeader = false }: TableProps) {
  const hasChildren = React.Children.count(children) > 0;
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const tableHeadRef = React.useRef<HTMLTableSectionElement>(null);

  React.useEffect(() => {
    if (!stickyHeader || !wrapperRef.current || !tableHeadRef.current) return;

    const wrapper = wrapperRef.current;
    const tableHead = tableHeadRef.current;

    function updateHeaderHeight() {
      wrapper.style.setProperty("--sticky-table-header-height", `${tableHead.offsetHeight - 2}px`);
    }

    const debouncedUpdateHeaderHeight = debounce(updateHeaderHeight, 50);

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(debouncedUpdateHeaderHeight);
    resizeObserver.observe(tableHead);

    return () => {
      debouncedUpdateHeaderHeight.cancel();
      resizeObserver.disconnect();
    };
  }, [stickyHeader]);

  return (
    <div ref={wrapperRef} className={clsx(styles.tableWrapper, stickyHeader && [styles.stickyHeader, "table-sticky-header"])}>
      {!hasChildren ? (
        <EmptyState />
      ) : (
        <table className={styles.table}>
          {layout && (
            <colgroup>
              {headings.map((heading, index) => (
                <col key={index}></col>
              ))}
            </colgroup>
          )}
          {headings && (
            <thead ref={tableHeadRef} className={styles.tableHead}>
              <tr>
                {headings.map((heading, index) => (
                  <th key={index} className={styles.tableHeadingCell}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>{children}</tbody>
        </table>
      )}
    </div>
  );
}

type TableRowProps = {
  children: ReactNode;
  className?: string;
};
function TableRow({ children, className }: TableRowProps) {
  return <tr className={clsx(styles.tableRow, className)}>{children}</tr>;
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
  colSpan?: number;
};

function TableCell({ children, className, colSpan }: TableCellProps) {
  return (
    <td className={clsx(styles.tableCell, className)} colSpan={colSpan}>
      {children}
    </td>
  );
}

Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
