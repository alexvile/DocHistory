import { useSearchParams } from "@remix-run/react";
import { SortBox } from "./SortBox";
import { FilterBox } from "./FilterBox";
import { LimitSelect } from "./LimitSelect";
import { SortAndFilterBarProps } from "~/types";
import { DateRange } from "./DateRange";
import { ProductCombobox } from "./ProductCombobox";
import { Icon } from "~/components/ui/Icon";
import ChangeStatusFilter from "./ChangesStatusSelect";
import MyChangesFilter from "./MyChangesFilter";
import styles from "./SortAndFilterBar.module.css";

export function SortAndFilterBar({
  sortConfig,
  showChangeStatusFilter = false,
  showQueryFilter = false,
  showLimit = true,
  showMyFilter = false,
  productOptions,
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
        {productOptions?.length && (
        <ProductCombobox searchParams={searchParams} setSearchParams={setSearchParams} productOptions={productOptions} />
      )}
      {showCalendar && <DateRange searchParams={searchParams} setSearchParams={setSearchParams} />}
      {showMyFilter && <MyChangesFilter searchParams={searchParams} setSearchParams={setSearchParams} />}
      {showLimit && <LimitSelect searchParams={searchParams} setSearchParams={setSearchParams} />}
      {hasActiveFilters && (
        <button onClick={handleClear} className="button button--icon" aria-label="Очистити фільтра">
         <Icon name="close" />
        </button>
      )}
    </div>
  );
}
