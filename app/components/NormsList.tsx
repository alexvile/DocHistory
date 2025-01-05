import { NormsListProps } from "~/types";
import NormItem from "./NormItem";

export default function NormsList({ norms }: NormsListProps) {
  console.log(norms);
  // todo - edit -delete
  return (
    <ol>
      {norms.map((norm) => (
        <NormItem key={norm.id} {...norm}/>
      ))}
    </ol>
  );
}
