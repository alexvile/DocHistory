type Props = {
  searchParams: URLSearchParams;
  setSearchParams: (next: URLSearchParams) => void;
};

export default function MyChangesFilter({
  searchParams,
  setSearchParams,
}: Props) {
  const checked = searchParams.get("my") === "1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = new URLSearchParams(searchParams);

    if (e.target.checked) {
      next.set("my", "1");
    } else {
      next.delete("my");
    }

    setSearchParams(next);
  };

  return (
    <label className="p-checkbox-card">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <span>Мої</span>
    </label>
  );
}
