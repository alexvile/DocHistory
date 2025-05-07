import { ProductNormsTableProps } from "~/types";
import Table from "./Table";
import { useCallback, useEffect, useState } from "react";
import Extender from "./Extender";
import { Icon } from "./Icon";
import { createRows } from "~/utils/rowHandlers";

function ProductNormsTable({ normRows, isEditable }: ProductNormsTableProps) {
  const [rows, setRows] = useState(normRows);
  useEffect(() => {
    setRows(normRows);
  }, [normRows]);

  const handleAddRow = useCallback(
    (
      type: "group" | "detail",
      insertIndex: number,
      parentId?: string,
      groupColor?: string
    ) => {
      console.log("parentId", parentId);
      // todo - use settimeout + block to prevent throttle
      const rowsToAdd = createRows({ type, groupColor, groupId: parentId });
      setRows((prevRows) => {
        const updatedRows = [
          ...prevRows.slice(0, insertIndex),
          ...rowsToAdd,
          ...prevRows.slice(insertIndex),
        ];

        return updatedRows.map((row, index) => ({ ...row, rowOrder: index }));
      });
    },
    [setRows]
  );

  // todo - option to remove row
  // todo - tree structure instead of colors
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
              <Extender
                ariaLabel="Додати групу"
                action={() => {
                  handleAddRow("group", index + 1);
                }}
              />
            ) : (
              <div className="element__title">
                <div>
                  <input
                    type="text"
                    required
                    title={data.title}
                    name={
                      data?.type === "detail"
                        ? `title__${data.groupId}__${data.id}`
                        : `title__${data.id}`
                    }
                    id={"title_" + data?.id}
                    aria-label={`Заголовок ${
                      data?.type === "detail" ? "деталі" : "групи"
                    }`}
                    defaultValue={data.title}
                    disabled={!isEditable}
                  />
                  {isEditable ? (
                    <Extender
                      ariaLabel="Додати деталь до групи"
                      action={() => {
                        handleAddRow(
                          "detail",
                          index + 1,
                          data?.groupId,
                          data.groupColor
                        );
                      }}
                    />
                  ) : null}
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
            {data.type === "detail" ? (
              <input
                type="text"
                className="norms-table__input norms-table__input--small"
                name={`assortment__${data.groupId}__${data.id}`}
                id={"assortment_" + data?.id}
                aria-label="Сортамент деталі"
                defaultValue={data.assortment}
                disabled={!isEditable}
              />
            ) : null}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? (
              <input
                type="text"
                className="norms-table__input norms-table__input--small"
                name={`standard__${data.groupId}__${data.id}`}
                id={"standard_" + data?.id}
                aria-label=" деталі"
                defaultValue={data.standard}
                disabled={!isEditable}
              />
            ) : null}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? (
              <input
                type="text"
                className="norms-table__input norms-table__input--xsmall"
                title={data.unit}
                name={`unit__${data.groupId}__${data.id}`}
                id={"unit_" + data?.id}
                defaultValue={data.unit}
                disabled={!isEditable}
              />
            ) : null}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? (
              <input
                className="norms-table__input norms-table__input--small"
                type="text"
                name={`cr__${data.groupId}__${data.id}`}
                id={"consuption_rate_" + data?.id}
                defaultValue={data.consuption_rate}
                disabled={!isEditable}
              />
            ) : null}
          </Table.Cell>
          <Table.Cell>
            {data.type === "detail" ? (
              <input
                type="text"
                className="norms-table__input norms-table__input--small"
                name={`cr_pi__${data.groupId}__${data.id}`}
                id={"consuption_rate_per_item_" + data?.id}
                defaultValue={data.consuption_rate_per_item}
                disabled={!isEditable}
              />
            ) : null}
          </Table.Cell>
          <Table.Cell>.</Table.Cell>
          <Table.Cell>.</Table.Cell>
          <Table.Cell>.</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}

export default ProductNormsTable;
