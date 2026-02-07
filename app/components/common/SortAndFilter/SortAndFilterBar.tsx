import { useSearchParams } from "@remix-run/react";
import { SortBox } from "./SortBox";
import { FilterBox } from "./FilterBox";
import { LimitSelect } from "./LimitSelect";
import styles from "./SortAndFilterBar.module.css";
import { SortAndFilterBarProps } from "~/types";

export function SortAndFilterBar({
  sortConfig,
  showStatusFilter = false,
  showProductFilter = false,
  showLimit = true,
}: SortAndFilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasActiveFilters =
    searchParams.has("q") || searchParams.has("sort") || searchParams.has("dir") || searchParams.has("page") || searchParams.has("limit");

  function handleClear() {
    setSearchParams({});
  }

  return (
    <div className={styles.filterBar}>
      {sortConfig && <SortBox searchParams={searchParams} setSearchParams={setSearchParams} config={sortConfig} />}
      <FilterBox searchParams={searchParams} setSearchParams={setSearchParams} />
      <LimitSelect searchParams={searchParams} setSearchParams={setSearchParams} />
      {hasActiveFilters && (
        <button onClick={handleClear} className={styles.clearBtn}>
          Очистити
        </button>
      )}
    </div>
  );
}
