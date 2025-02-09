import { ProductNormsTableProps } from "~/types";
import Table from "./Table";
import NormsGenerator from "~/utils/normsGenerator";
import React, { useMemo } from "react";
import Extender from "./Extender";
import { Icon } from "./Icon";

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
        "G",
        "Назва",
        "Сортамент",
        "ДСТУ",
        "Од.",
        "Норма",
        "Норма на од.",
        "Ціна ?",
        "Сума ?",
        "Примітки ?",
      ]}
    >
      {rows.map((data, index) => (
        <Table.Row key={data?.id}>
          {/* todo different numbers (including separate for groups) */}
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>
            {data.type !== "spacing" && (
              <div
                className="group-circle"
                style={{
                  backgroundColor: data.groupColor ? data.groupColor : "#fff",
                }}
              ></div>
            )}
          </Table.Cell>
          <Table.Cell>
            {/* todo - refactor */}
            {data.type === "spacing" ? (
              <Extender />
            ) : (
              <div className="element__title">
                <div>
                  <input
                    type="text"
                    title={data.title}
                    name={"title_" + data?.id}
                    id={data?.id}
                    defaultValue={data.title}
                    disabled={!isEditable}
                  />
                  {isEditable ? <Extender /> : null}
                </div>
                <div className="show-full-info">
                  <Icon name="zoom" />
                  <span className="show-full-info__data">{data.title}</span>
                </div>
              </div>
            )}

            {/* todo - refactor */}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? data.assortment : null}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? data.standard : null}
          </Table.Cell>
          <Table.Cell>{data.type === "detail" ? data.unit : null}</Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? data.consuption_rate : null}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? data.consuption_rate_per_item : null}
          </Table.Cell>
          <Table.Cell>.</Table.Cell>
          <Table.Cell>.</Table.Cell>
          <Table.Cell>.</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
});

// , (prevProps, nextProps) => {
//   return prevProps.norms === nextProps.norms; // Порівнюємо тільки norms
// });

export default ProductNormsTable;
