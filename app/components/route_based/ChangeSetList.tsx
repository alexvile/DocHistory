import { ChangeSetVM } from "~/types";
import ChangeSetCard from "./ChangeSetCard";

// todo = fix ts issues
export default function ChangeSetList({ changes }: ChangeSetVM[]) {
  return (
    <ul className="list-unstyled">
      {changes.map(({ id, status, createdAt, diff, createdBy }) => (
        <li key={id}>
          <ChangeSetCard {...{ id, status, createdAt, diff, createdBy }} />
        </li>
      ))}
    </ul>
  );
}
