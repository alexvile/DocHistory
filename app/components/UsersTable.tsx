import { UserVM } from "~/types";
import Table from "./ui/Table";
import translate from "~/utils/translate";
import { Link } from "@remix-run/react";

type UsersListProps = {
  users: UserVM[];
};

export default function UsersTable({ users }: UsersListProps) {
  return (
    <Table headings={["Ім’я", "Прізвище", "Email", "Роль", "Зміни"]}>
      {users.map(({ id, firstName, lastName, email, role }) => (
        <Table.Row key={id}>
          <Table.Cell>{firstName}</Table.Cell>
          <Table.Cell>{lastName}</Table.Cell>
          <Table.Cell>{email}</Table.Cell>
          <Table.Cell>{translate("ROLES", role)}</Table.Cell>
          <Table.Cell>
            {(role === "APPROVER" || role === "COMMITTER") && (
              <Link
                to={`/home/changes?${role === "APPROVER" ? "approverId" : "createdById"}=${id}`}
                aria-label={`Показати зміни: ${firstName} ${lastName}`}
              >
                show
              </Link>
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
