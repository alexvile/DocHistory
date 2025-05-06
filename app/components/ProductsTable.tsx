import { Link } from "@remix-run/react";
import { ProductsListProps } from "~/types";
import Table from "./Table";

export default function ProductsTable({ products }: ProductsListProps) {
  return (
    <Table headings={["Name", "Last update", "Details"]}>
      {products.map(({ id, productTitle, updatedAt }) => (
        <Table.Row key={id}>
          <Table.Cell>{productTitle}</Table.Cell>
          <Table.Cell>{updatedAt.toString()}</Table.Cell>
          <Table.Cell>
            <Link
              className="link"
              to={id}
              aria-label={`Переглянути продукт "${productTitle}"`}
            >
              Перейти
            </Link>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
