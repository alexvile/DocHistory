export function SortBox({ searchParams, setSearchParams }: {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}) {
  const sort = searchParams.get("sort") ?? "title";
  const dir = searchParams.get("dir") ?? "asc";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const [newSort, newDir] = e.target.value.split(":");
    searchParams.set("sort", newSort);
    searchParams.set("dir", newDir);
    setSearchParams(searchParams);
  }

  return (
    <select value={`${sort}:${dir}`} onChange={handleChange} className="sort-box">
      <option value="title:asc">Назва ↑</option>
      <option value="title:desc">Назва ↓</option>
      <option value="updated:asc">Оновлено ↑</option>
      <option value="updated:desc">Оновлено ↓</option>
    </select>
  );
}
