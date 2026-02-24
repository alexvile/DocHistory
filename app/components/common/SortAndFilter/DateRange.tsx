export function DateRange({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}) {
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }

    searchParams.set("page", "1");
    setSearchParams(new URLSearchParams(searchParams));
  }

  return (
    <fieldset>
      <legend className="visually-hidden">
        Фільтр за датою створення
      </legend>

      <label style={{ marginInlineEnd: '8px'  }}>
        <span className="visually-hidden">Дата від</span>
        <input
          type="date"
          className="p-input"
          name="from"
          value={from}
          onChange={handleChange}
          aria-label="Дата початку періоду"
        />
      </label>

      <label>
        <span className="visually-hidden">Дата до</span>
        <input
          type="date"
          className="p-input"
          name="to"
          value={to}
          onChange={handleChange}
          aria-label="Дата завершення періоду"
        />
      </label>
    </fieldset>
  );
}