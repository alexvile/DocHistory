
import { NormsListProps } from "~/types";

export default function NormsList({ norms }: NormsListProps) {
console.log(norms)
    // todo - edit -delete
  return (
    <ol>
      {norms.map(({ id, productName, createdAt, updatedAt, norm1, norm2, creatorId }) => (

        <li key={id}>{productName}--{createdAt.toString()}--{updatedAt.toString()}--{norm1}--{norm2}--{creatorId}</li>
      ))}
    </ol>
  );
}
