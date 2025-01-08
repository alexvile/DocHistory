// import { UserBarProps } from "~/types";

import { Link } from "@remix-run/react";
import { UsersListProps } from "~/types";

export default function UsersList({ users }: UsersListProps) {
  // todo - edit -delete
  return (
    <ol>
      {users.map(({ id, firstName, lastName, email, role }) => (
        <li key={id}>
          {firstName}--{lastName}--{email}--{role}
          {role === 'VIEWER' ? null : <p>
            <Link to={id}>show norms and changes</Link>
          </p>}
        </li>
      ))}
    </ol>
  );
}
