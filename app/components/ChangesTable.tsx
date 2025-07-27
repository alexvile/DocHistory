import { Link } from "@remix-run/react";
import { ChangesListProps } from "~/types";
import Table from "./Table";
import { formatDateForUA } from "~/utils/formatDateUA";

export default function ChangesTable({ changes }: ChangesListProps) {
  return (
    <Table headings={["Id", "Created", "Product", "Creator"]}>
      {changes.map(({ id, createdAt, product, creator }) => (
        <Table.Row key={id}>
          <Table.Cell>
            <Link className="link" to={id} aria-label={`Деталі по "${id}"`}>
              {id}
            </Link>
          </Table.Cell>
          <Table.Cell>{formatDateForUA(createdAt, { withYear: true })}</Table.Cell>
          <Table.Cell>{product.productTitle}</Table.Cell>
          <Table.Cell>
            {creator.firstName}-{creator.lastName}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
