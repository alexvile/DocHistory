import { useSearchParams } from "@remix-run/react";
import { SortBox } from "./SortBox";
import { FilterBox } from "./FilterBox";
import { LimitSelect } from "./LimitSelect";
import styles from "./SortAndFilterBar.module.css";
import { SortAndFilterBarProps } from "~/types";
import ChangeStatusFilter from "./ChangesStatusSelect";
import MyChangesFilter from "./MyChangesFilter";

export function SortAndFilterBar({
  sortConfig,
  showChangeStatusFilter = false,
  showQueryFilter = false,
  showLimit = true,
  showMyFilter = false,
  showProductSelect = false,
  showCalendar = false,
}: SortAndFilterBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasActiveFilters =
    searchParams.has("q") ||
    searchParams.has("sort") ||
    searchParams.has("dir") ||
    searchParams.has("page") ||
    searchParams.has("limit") ||
    searchParams.has("status") ||
    searchParams.has("my");

  function handleClear() {
    setSearchParams({});
  }

  return (
    <div className={styles.filterBar}>
      {sortConfig && <SortBox searchParams={searchParams} setSearchParams={setSearchParams} config={sortConfig} />}
      {showQueryFilter && <FilterBox searchParams={searchParams} setSearchParams={setSearchParams} />}
      {showChangeStatusFilter && <ChangeStatusFilter searchParams={searchParams} setSearchParams={setSearchParams} />}
      {showProductSelect && "productselect"}{" "}
      {showCalendar && "calendar"}
      {showMyFilter && <MyChangesFilter searchParams={searchParams} setSearchParams={setSearchParams} />}
      {showLimit && <LimitSelect searchParams={searchParams} setSearchParams={setSearchParams} />}
      {hasActiveFilters && (
        <button onClick={handleClear} className={styles.clearBtn}>
          Очистити
        </button>
      )}
    </div>
  );
}
