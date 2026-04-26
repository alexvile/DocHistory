import { Link } from "@remix-run/react";
import Table from "./ui/Table";
import { formatDateForUA } from "~/utils/formatDateUA";
import { ProductVM } from "~/types";

type ProductsListProps = {
  products: ProductVM[];
  from: number;
};

export default function ProductsTable({ products, from }: ProductsListProps) {
  return (
    <Table headings={["№", "Назва", "Код", "Остання зміна"]}>
      {products.map(({ id, title, updatedAt, code }, index) => (
        <Table.Row key={id}>
          <Table.Cell>{from + index}</Table.Cell>
          <Table.Cell>
            <Link className="link" to={id} aria-label={`Переглянути продукт: ${title}`}>
              {title}
            </Link>
          </Table.Cell>
          <Table.Cell>{code ? code : "-"}</Table.Cell>
          <Table.Cell>{formatDateForUA(updatedAt, { withYear: true })}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
