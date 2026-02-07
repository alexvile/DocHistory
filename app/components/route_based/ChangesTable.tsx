import { Link } from "@remix-run/react";
import { formatDateForUA } from "~/utils/formatDateUA";
import Table from "../ui/Table";

export default function ChangesTable({ changes }: any) {
  return (
    <Table headings={["№", "Остання зміна", "Статус"]}>
      {changes.map(({ id, createdAt, status }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{status}</Table.Cell>
          <Table.Cell>{formatDateForUA(createdAt, { withYear: true })}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
