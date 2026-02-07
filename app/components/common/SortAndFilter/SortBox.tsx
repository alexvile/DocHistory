import { SortBoxProps } from "~/types";
import styles from "./SortAndFilterBar.module.css";

export function SortBox({ searchParams, setSearchParams, config }: SortBoxProps) {
  const sort = searchParams.get("sort") ?? "title";
  const dir = searchParams.get("dir") ?? "asc";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [newSort, newDir] = e.target.value.split(":");
    searchParams.set("sort", newSort);
    searchParams.set("dir", newDir);
    setSearchParams(searchParams);
  }

  return (
    <select value={`${sort}:${dir}`} onChange={handleChange} className={styles.sortBox}>
      {config.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
