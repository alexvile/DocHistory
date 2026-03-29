import { formatDateShortUA } from "~/utils/formatDateUA";
import Table from "../ui/Table";
import { Link } from "@remix-run/react";

export default function ProductSnapshotsTable({ snapshots }: any) {
  return (
    <Table headings={["№", "Знімок норми від", "Посилання"]}>
      {snapshots.map(({ id, createdAt }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>{formatDateShortUA(createdAt)}</Table.Cell>
          <Table.Cell>
            <Link className="link" to={id}>
              лінка →
            </Link>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
