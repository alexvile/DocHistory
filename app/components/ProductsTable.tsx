import { Link } from "@remix-run/react";
import { ProductsListProps } from "~/types";
import Table from "./ui/Table";
import { formatDateForUA } from "~/utils/formatDateUA";

export default function ProductsTable({ products }: ProductsListProps) {
  return (
    <Table headings={["№", "Назва", "Остання зміна"]}>
      {products.map(({ id, title, updatedAt }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell>
            <Link className="link" to={id} aria-label={`Переглянути продукт: ${title}`}>
              {title}
            </Link>
          </Table.Cell>
          <Table.Cell>{formatDateForUA(updatedAt, { withYear: true })}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
