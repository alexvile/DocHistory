import styles from "./SortAndFilterBar.module.css";

type Props = {
  searchParams: URLSearchParams;
  setSearchParams: (next: URLSearchParams) => void;
};

export default function ChangeStatusFilter({ searchParams, setSearchParams }: Props) {
  const value = searchParams.get("status") ?? "all";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(searchParams);

    if (e.target.value === "all") {
      next.delete("status");
    } else {
      next.set("status", e.target.value);
    }

    setSearchParams(next);
  };

  return (
    <label>
      <span className="visually-hidden">Статус змін</span>
      <select value={value} onChange={handleChange} className={styles.filterSelect} name="change_status">
        <option value="all">Усі</option>
        <option value="DRAFT">Draft</option>
        <option value="ON_REVIEW">On review</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </label>
  );
}
