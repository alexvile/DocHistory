import { ProductNormsTableProps } from "~/types";
import Table from "./Table";
import NormsGenerator from "~/utils/normsGenerator";
import React, { useMemo } from "react";
import Extender from "./Extender";

const ProductNormsTable = React.memo(function ProductNormsTable({
  norms,
  isEditable,
}: ProductNormsTableProps) {
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
          <Table.Cell>
            <input
              type="text"
              name={"title_" + data?.id}
              id={data?.id}
              defaultValue={data.title}
              disabled={!isEditable}
            />
            {/* todo - refactor */}
            {isEditable ? <Extender /> : null}
          </Table.Cell>
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
