import { CanonicalRow } from "~/types";
import Table from "./Table";

type ChangedRow = {
  before: CanonicalRow;
  after: CanonicalRow;
  fields: (keyof CanonicalRow)[];
};

type NormsTableWithChangesProps = {
  changes: ChangedRow[];
};

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
  return (
    <Table headings={["№", "Назва", "Сортамент", "ДСТУ", "Од.", "Норма", "Норма на од.", "Примітки"]}>
      {changes.map(({ before, after, fields }, index) => (
        <Table.Row key={before.businessKey}>
          <Table.Cell>{index}</Table.Cell>
          <Table.Cell>{renderCell("name", before, after, fields)}</Table.Cell>
          <Table.Cell>{renderCell("assortment", before, after, fields)}</Table.Cell>
          <Table.Cell>{renderCell("dstu", before, after, fields)}</Table.Cell>
          <Table.Cell>{renderCell("unit", before, after, fields)}</Table.Cell>
          <Table.Cell>{renderCell("consumption", before, after, fields)}</Table.Cell>
          <Table.Cell>{renderCell("consumptionPerUnit", before, after, fields)}</Table.Cell>
          <Table.Cell>{renderCell("notes", before, after, fields)}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
