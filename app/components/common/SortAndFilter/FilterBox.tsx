import { useEffect, useState } from "react";
import { debounce } from "~/utils/debounce";

export function FilterBox({
  searchParams,
  setSearchParams,
  placeholder = "Пошук за назвою",
}: {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  placeholder?: string;
}) {
  const initialFilter = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(initialFilter);

  useEffect(() => {
    setInputValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (inputValue.trim() === (searchParams.get("q") ?? "")) return;

    const updateSearchParams = debounce(() => {
      const trimmed = inputValue.trim();
      const next = new URLSearchParams(searchParams);

      if (trimmed) {
        next.set("q", trimmed);
      } else {
        next.delete("q");
      }
      next.delete("page");

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
        placeholder={placeholder}
        className="p-input"
      />
    </label>
  );
}
