import { ChangeSetVM, UserRoleVM } from "~/types";
import ChangeSetCard from "./ChangeSetCard";

type ChangeSetListProps = {
  changes: ChangeSetVM[];
  role: UserRoleVM
}

export default function ChangeSetList({ changes, role }: ChangeSetListProps) {
  return (
    <ul className="list-unstyled">
      {changes.map(({ id, status, createdAt, diff, createdBy }) => (
        <li key={id}>
          <ChangeSetCard {...{ id, status, createdAt, diff, createdBy, role }} />
        </li>
      ))}
    </ul>
  );
}
