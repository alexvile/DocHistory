import { CanonicalRow } from "~/types";
import Table from "./ui/Table";

type ChangedRow = {
  before: CanonicalRow;
  after: CanonicalRow;
  fields: (keyof CanonicalRow)[];
};

type NormsTableWithChangesProps = {
  changes: ChangedRow[];
};

const COLUMNS_COUNT = 8;

function renderCell<T extends keyof CanonicalRow>(field: T, before: CanonicalRow, after: CanonicalRow, fields: (keyof CanonicalRow)[]) {
  const changed = fields.includes(field);

  if (!changed) {
    return String(before[field] ?? "—");
  }

  return (
    <>
      <span className="before">{String(before[field] ?? "—")}</span>
      <span className="arrow"> → </span>
      <span className="after">{String(after[field] ?? "—")}</span>
    </>
  );
}

export default function NormsTableWithChanges({ changes }: NormsTableWithChangesProps) {
  let currentGroupName: string | undefined;

  return (
    <Table headings={["№", "Назва", "Сортамент", "ДСТУ", "Од.", "Норма", "Норма на од.", "Примітки"]} stickyHeader>
      {changes.flatMap(({ before, after, fields }, index) => {
        const rows = [];
        const groupName = after.groupName ?? before.groupName;

        if (groupName && groupName !== currentGroupName) {
          currentGroupName = groupName;
          rows.push(
            <Table.Row key={`group-${groupName}-${before.businessKey}`} className="tableGroupRow">
              <Table.Cell className="tableGroupCell" colSpan={COLUMNS_COUNT}>
                {groupName}
              </Table.Cell>
            </Table.Row>,
          );
        }

        rows.push(
          <Table.Row key={before.businessKey}>
            <Table.Cell>{index}</Table.Cell>
            <Table.Cell>{renderCell("name", before, after, fields)}</Table.Cell>
            <Table.Cell>{renderCell("assortment", before, after, fields)}</Table.Cell>
            <Table.Cell>{renderCell("dstu", before, after, fields)}</Table.Cell>
            <Table.Cell>{renderCell("unit", before, after, fields)}</Table.Cell>
            <Table.Cell>{renderCell("consumption", before, after, fields)}</Table.Cell>
            <Table.Cell>{renderCell("consumptionPerUnit", before, after, fields)}</Table.Cell>
            <Table.Cell>{renderCell("notes", before, after, fields)}</Table.Cell>
          </Table.Row>,
        );

        return rows;
      })}
    </Table>
  );
}
