import { formatDateForUA } from "~/utils/formatDateUA";
import Table from "../ui/Table";
import { ChangeVM } from "~/types";
import translate from "~/utils/translate";

type ChangesTableProps = {
  changes: Pick<ChangeVM, "id" | "createdAt" | "status">[];
};

export default function ChangesTable({ changes }: ChangesTableProps) {
  return (
    <Table headings={["№", "Статус", "Дата"]}>
      {changes.map(({ id, createdAt, status }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{translate("CHANGE_STATUS", status)}</Table.Cell>
          <Table.Cell>{formatDateForUA(createdAt, { withYear: true })}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
