export function LimitSelect({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}) {
  const limit = searchParams.get("limit") ?? "10";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set("limit", e.target.value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <select value={limit} onChange={handleChange} className="limit-select">
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
    </select>
  );
}

