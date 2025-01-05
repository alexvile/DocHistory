// import { UserBarProps } from "~/types";

import { UsersListProps } from "~/types";

export default function UsersList({ users }: UsersListProps) {

    // todo - edit -delete
  return (
    <ol>
      {users.map(({ id, firstName, lastName, email, role }) => (
        <li key={id}>{firstName}--{lastName}--{email}--{role}</li>
      ))}
    </ol>
  );
}
