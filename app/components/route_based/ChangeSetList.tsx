import { ChangeSetVM, UserRoleVM } from "~/types";
import ChangeSetCard from "./ChangeSetCard";

type ChangeSetListProps = {
  changes: ChangeSetVM[];
  role: UserRoleVM;
  userId: string;
};

export default function ChangeSetList({ changes, role, userId }: ChangeSetListProps) {
  return (
    <ul className="list-unstyled">
      {changes.map(({ id, status, createdAt, diff, createdBy, approver, approverId, decidedAt }) => (
        <li key={id}>
          <ChangeSetCard {...{ id, status, createdAt, diff, createdBy, role, approver, userId, approverId, decidedAt }} />
        </li>
      ))}
    </ul>
  );
}
