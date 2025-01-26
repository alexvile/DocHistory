import { Link } from "@remix-run/react";
import { ProductWithNorms, UsersListProps } from "~/types";
import Table from "./Table";
import NormsGenerator from "~/utils/normsGenerator";
import React, { useMemo } from "react";

const ProductNormsTable = React.memo(function ProductNormsTable({
  norms,
}: ProductWithNorms) {
  const rows = useMemo(() => NormsGenerator.createRows(norms), [norms]);

  console.log(111, rows);

  return (
    <Table
      headings={[
        "№",
        "Title",
        "Assortment",
        "Standard",
        "Unit",
        "Consumption rate",
        "Consumption rate per item",
        "Price ?",
        "Sum ?",
        "Notes ?",
      ]}
    >
      {rows.map((data) => (
        <Table.Row key={data?.id}>
          {/* todo different numbers */}
          <Table.Cell>-</Table.Cell>
          <Table.Cell>{data.title}</Table.Cell>
          <Table.Cell>e</Table.Cell>
          <Table.Cell>e</Table.Cell>
          <Table.Cell>{data.type === "detail" ? data.unit : null}</Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? data.consuption_rate : null}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? data.consuption_rate_per_item : null}
          </Table.Cell>
          <Table.Cell>e</Table.Cell>
          <Table.Cell>e</Table.Cell>
          <Table.Cell>e</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
});

// , (prevProps, nextProps) => {
//   return prevProps.norms === nextProps.norms; // Порівнюємо тільки norms
// });

export default ProductNormsTable;
