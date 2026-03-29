import { UsersListProps } from "~/types";
import Table from "./ui/Table";
import translate from "~/utils/translate";

export default function UsersTable({ users }: UsersListProps) {
  return (
    <Table headings={["Ім’я", "Прізвище", "Email", "Роль", "Зміни"]}>
      {users.map(({ id, firstName, lastName, email, role }) => (
        <Table.Row key={id}>
          <Table.Cell>{firstName}</Table.Cell>
          <Table.Cell>{lastName}</Table.Cell>
          <Table.Cell>{email}</Table.Cell>
          <Table.Cell>{translate("ROLES", role)}</Table.Cell>
          <Table.Cell>{role === "VIEWER" ? "-" : "show"}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
