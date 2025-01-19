import { Link } from "@remix-run/react";
import { UsersListProps } from "~/types";
import Table from "./Table";

export default function UsersTable({ users }: UsersListProps) {
  return (
    <Table headings={["Name", "Surname", "Email", "Role", "Changes"]}>
      {users.map(({ id, firstName, lastName, email, role }) => (
        <Table.Row key={id}>
          <Table.Cell>{firstName}</Table.Cell>
          <Table.Cell>{lastName}</Table.Cell>
          <Table.Cell>{email}</Table.Cell>
          <Table.Cell>{role}</Table.Cell>
          <Table.Cell>
            {role === "VIEWER" ? null : <Link to={id}>show</Link>}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
