import { useEffect, useState } from "react";

export function FilterBox({
  searchParams,
  setSearchParams,
}: {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}) {
  const initialFilter = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(initialFilter);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = inputValue.trim();

      if (trimmed) {
        searchParams.set("q", trimmed);
        searchParams.set("page", "1");
      } else {
        searchParams.delete("q");
      }

      setSearchParams(searchParams);
    }, 400); // debounce 400ms

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Пошук за назвою"
      className="filter-box"
    />
  );
}
