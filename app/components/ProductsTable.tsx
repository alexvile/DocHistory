import { Link } from "@remix-run/react";
import { ProductsListProps } from "~/types";
import Table from "./Table";

export default function ProductsTable({ products }: ProductsListProps) {
  const test = {
    productID: "123",
    group: {
      id: "id",
      detail1: {
        id: "id",
        name: "adasd",
        sortament: "asdasd",
        gost: "dfsdf",
        odunucy: "sada",
        "norma-roshode": "",
        "norma-roshodu na odun": "",
        notatku: "",
      },
    },
    spacing: {
      id: "id",
    },
    heading: {
      id: "id",
      value: "Another details",
    },
    detail12: {
      name: "adasd",
      sortament: "asdasd",
      gost: "dfsdf",
      odunucy: "sada",
      "norma-roshode": "",
      "norma-roshodu na odun": "",
      notatku: "",
    },
  };
  return (
    <Table headings={["Name", "Last update", "Details"]}>
      {products.map(({ id, productTitle, updatedAt }) => (
        <Table.Row key={id}>
          <Table.Cell>{productTitle}</Table.Cell>
          <Table.Cell>{updatedAt.toString()}</Table.Cell>
          <Table.Cell>
            <Link to={id}>details</Link>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
