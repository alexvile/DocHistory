import React, { ReactNode } from "react";
import styles from "./Table.module.css";
import { Icon } from "./Icon";
import clsx from "clsx";

type TableProps = {
  headings: string[];
  children: ReactNode;
  layout?: boolean;
};
// todo - check this error

function EmptyState() {
  return (
    <div className={styles.emptyStateContainer}>
      <Icon name="magnify" />
      <p className={styles.emptyStateHeading}>No data found</p>
      <p className={styles.emptyStateDescription}>Try changing the filters or search term</p>
    </div>
  );
}
function Table({ children, headings, layout }: TableProps) {
  //   Children.forEach(children, (child) => {
  //     if (!isValidElement(child) || child.type !== TableRow) {
  //       throw new Error("Table accepts only Table.Row as children.");
  //     }
  //   });
  const hasChildren = React.Children.count(children) > 0;
  return (
    <div className={styles.tableWrapper}>
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
            <thead className={styles.tableHead}>
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
  //   Children.forEach(children, (child) => {
  //     if (!isValidElement(child) || child.type !== Table.Cell) {
  //       throw new Error("Table.Row accepts only Table.Cell as children.");
  //     }
  //   });

  return <tr className={clsx(styles.tableRow, className)}>{children}</tr>;
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

function TableCell({ children, className }: TableCellProps) {
  return <td className={clsx(styles.tableCell, className)}>{children}</td>;
}

Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
