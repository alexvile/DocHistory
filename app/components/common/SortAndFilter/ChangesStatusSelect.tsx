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
      <select value={value} onChange={handleChange} className="p-select" name="change_status">
        <option value="all">Усі</option>
        <option value="DRAFT">Чорновий</option>
        <option value="ON_REVIEW">На розгляді</option>
        <option value="APPROVED">Схвалено</option>
        <option value="REJECTED">Відхилено</option>
      </select>
    </label>
  );
}
