import { ChangeSetVM } from "~/types";
import ChangeSetCard from "./ChangeSetCard";

export default function ChangeSetList({ changes }: { changes: ChangeSetVM[] }) {
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
