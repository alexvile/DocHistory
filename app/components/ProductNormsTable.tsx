import { Link } from "@remix-run/react";
import { ProductWithNorms, UsersListProps } from "~/types";
import Table from "./Table";

// todo - create Class

function generateTableRows(data) {
  const rows = [];

  function createDetail(detailData) {}

  function handleMain(main) {
    console.log(222, main)
    const row = { material: main?.title };
    rows.push(row);

    if (!main?.details || !main?.detail_order) return;
    main.detail_order.forEach((itemKey) => {
      const nestedDetail = main.details[itemKey];
      const row = { material: nestedDetail?.title };
      rows.push(row);
      console.log(1111, rows)
    });

    // then push included
  }

  data.order.forEach((itemKey) => {
    const item = data[itemKey];
    switch (item.type) {
      case "main":
        console.log("main", item);
        handleMain(item);
        break;
      case "group":
        console.log("group", item);
        break;
      case "heading":
        console.log("heading", item);
        break;
      case "spacing":
        console.log("spacing", item);
        break;
      case "detail":
        console.log("detail", item);
        break;
      default:
        break;
    }
  });
  return rows;

}
export default function ProductNormsTable({
  id,
  norms,
  productTitle,
  updatedAt,
}: ProductWithNorms) {
    const rows = generateTableRows(norms);
    console.log(111, rows)
  return (
    <Table
      headings={[
        "№",
        "Material",
        "Assortment",
        "Standard",
        "Unit",
        "Consumption rate",
        "Consumption rate per item",
        "Price ?",
        "Sum ?",
        "Notes ?",
      ]}
    >
      {/* {users.map(({ id, firstName, lastName, email, role }) => (
        <Table.Row key={id}>
          <Table.Cell>{firstName}</Table.Cell>
          <Table.Cell>{lastName}</Table.Cell>
          <Table.Cell>{email}</Table.Cell>
          <Table.Cell>{role}</Table.Cell>
          <Table.Cell>
            {role === "VIEWER" ? null : <Link to={id}>show</Link>}
          </Table.Cell>
        </Table.Row>
      ))} */}
    </Table>
  );
}
