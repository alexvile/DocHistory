import { useEffect, useState } from "react";
import { debounce } from "~/utils/debounce";

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
    setInputValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const updateSearchParams = debounce(() => {
      const trimmed = inputValue.trim();
      const next = new URLSearchParams(searchParams);

      if (trimmed) {
        next.set("q", trimmed);
        next.set("page", "1");
      } else {
        next.delete("q");
      }

      setSearchParams(next);
    }, 400);

    updateSearchParams();

    return () => updateSearchParams.cancel();
  }, [inputValue, searchParams, setSearchParams]);

  // todo - fix error when using "(" in query

  return (
    <label>
      <span className="visually-hidden">Пошук</span>
      <input
        name="q"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Пошук за назвою"
        className="p-input"
      />
    </label>
  );
}
