import { CanonicalRow, NormDiff } from "~/types";
import Table from "../../ui/Table";
import { ColumnKey, columns } from "./constants";

type Props = {
  data: CanonicalRow[];
  visibleColumns: Set<ColumnKey>;
  mode: "before" | "after";
  diffMode?: boolean;
  diff?: NormDiff;
};

const cellMap: Record<ColumnKey, (row: CanonicalRow, index: number) => React.ReactNode> = {
  index: (_, i) => i + 1,
  name: (row) => row.name,
  assortment: (row) => row.assortment,
  dstu: (row) => row.dstu,
  unit: (row) => row.unit,
  consumption: (row) => row.consumption,
  consumptionPerUnit: (row) => row.consumptionPerUnit,
  notes: (row) => row.notes,
};

function isColumnKey(field: string): field is ColumnKey {
  return columns.some((column) => column.key === field);
}

export default function ConfigurableNormsTable({
  data,
  visibleColumns,
  mode,
  diffMode,
  diff,
}: Props) {
  const activeColumns = columns.filter((col) => visibleColumns.has(col.key));
  let currentGroupName: string | undefined;

  return (
    <Table headings={activeColumns.map((c) => c.label)} stickyHeader>
      {data.flatMap((row, rowIndex) => {
        const rows = [];
        let rowClass = "";
        let changedFields: ColumnKey[] = [];

        if (diffMode && diff) {
          const key = row.businessKey;

          const isRemoved = diff.removed.some((r) => r.businessKey === key);
          const isAdded = diff.added.some((r) => r.businessKey === key);
          const changedItem = diff.changed.find((c) => c.key === key);

          // 🔴 removed → тільки ліва таблиця
          if (isRemoved && mode === "before") {
            rowClass = "line-through opacity-50";
          }

          // 🟢 added → тільки права таблиця
          if (isAdded && mode === "after") {
            rowClass = "bg-green-100";
          }

          // 🟡 changed → обидві
          if (changedItem) {
            changedFields = changedItem.fields.filter(isColumnKey);
          }
        }

        if (row.groupName && row.groupName !== currentGroupName) {
          currentGroupName = row.groupName;
          rows.push(
            <Table.Row key={`group-${row.groupName}-${row.businessKey}`} className="tableGroupRow">
              <Table.Cell className="tableGroupCell" colSpan={activeColumns.length}>
                {row.groupName}
              </Table.Cell>
            </Table.Row>,
          );
        }

        rows.push(
          <Table.Row key={row.businessKey} className={rowClass}>
            {activeColumns.map((col) => {
              const isChanged = changedFields.includes(col.key);

              return (
                <Table.Cell
                  key={col.key}
                  className={isChanged ? "yellow" : ""}
                >
                  {cellMap[col.key](row, rowIndex)}
                </Table.Cell>
              );
            })}
          </Table.Row>,
        );

        return rows;
      })}
    </Table>
  );
}
