import { Link } from "@remix-run/react";
import { ProductsListProps } from "~/types";
import Table from "./Table";
import { formatDateForUA } from "~/utils/formatDateUA";

export default function ProductsTable({ products }: ProductsListProps) {
  return (
    <Table headings={["Name", "Last update"]}>
      {products.map(({ id, productTitle, updatedAt }) => (
        <Table.Row key={id}>
          <Table.Cell>
            <Link
              className="link"
              to={id}
              aria-label={`Переглянути продукт "${productTitle}"`}
            >
              {productTitle}
            </Link>
          </Table.Cell>
          <Table.Cell>
            {formatDateForUA(updatedAt, { withYear: true })}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
