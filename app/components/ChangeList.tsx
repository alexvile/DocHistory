import { NormChange } from "~/types";
import ChangeItem from "./ChangeItem";

export default function ChangeList({ diff }: { diff: NormChange[] }) {
  return (
    <div className="changelist__container">
      Change list
      <ul className="changelist__list">
        {diff.map((change, index) => (
          <ChangeItem key={index} change={change} />
        ))}
      </ul>
    </div>
  );
}
