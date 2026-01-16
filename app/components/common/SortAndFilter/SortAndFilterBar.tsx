import { useSearchParams } from "@remix-run/react";
import { SortBox } from "./SortBox";
import { FilterBox } from "./FilterBox";
import { LimitSelect } from "./LimitSelect";
import styles from "./SortAndFilterBar.module.css";

export function SortAndFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasActiveFilters =
    searchParams.has("q") ||
    searchParams.has("sort") ||
    searchParams.has("dir") ||
    searchParams.has("page") ||
    searchParams.has("limit");

  function handleClear() {
    setSearchParams({});
  }

  return (
    <div className={styles.filterBar}>
      <SortBox searchParams={searchParams} setSearchParams={setSearchParams} />
      <FilterBox
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <LimitSelect
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      {hasActiveFilters && (
        <button onClick={handleClear} className={styles.clearBtn}>
          Очистити
        </button>
      )}
    </div>
  );
}
