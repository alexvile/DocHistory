import React, { ReactNode, Children, isValidElement } from "react";

type TableProps = {
  headings: string[];
  children: ReactNode;
  layout?: boolean;
};
// todo - check this error

function Table({ children, headings, layout }: TableProps) {
  //   Children.forEach(children, (child) => {
  //     if (!isValidElement(child) || child.type !== TableRow) {
  //       throw new Error("Table accepts only Table.Row as children.");
  //     }
  //   });
  const hasChildren = React.Children.count(children) > 0;
  return (
    <div className="table__wrapper">
      {!hasChildren ? (
        "No data"
      ) : (
        <table className="table">
          {layout && (
            <colgroup>
              {headings.map((heading, index) => (
                <col key={index}></col>
              ))}
            </colgroup>
          )}
          {headings && (
            <thead className="table__head">
              <tr>
                {headings.map((heading, index) => (
                  <th key={index} className="table__heading-cell">
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
};

function TableRow({ children }: TableRowProps) {
  //   Children.forEach(children, (child) => {
  //     if (!isValidElement(child) || child.type !== Table.Cell) {
  //       throw new Error("Table.Row accepts only Table.Cell as children.");
  //     }
  //   });

  return <tr className="table__row">{children}</tr>;
}

type TableCellProps = {
  children: ReactNode;
};

function TableCell({ children }: TableCellProps) {
  return <td className="table__cell">{children}</td>;
}

Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
