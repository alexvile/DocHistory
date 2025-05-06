import { useSearchParams } from "@remix-run/react";
import { SortBox } from "./SortBox";
import { FilterBox } from "./FilterBox";
import { LimitSelect } from "./LimitSelect";


export function SortAndFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleClear() {
    setSearchParams({});
  }

  return (
    <div className="filter-bar">
      <SortBox searchParams={searchParams} setSearchParams={setSearchParams} />
      <FilterBox searchParams={searchParams} setSearchParams={setSearchParams} />
      <LimitSelect searchParams={searchParams} setSearchParams={setSearchParams} />
      <button onClick={handleClear} className="clear-btn">Очистити</button>
    </div>
  );
}
