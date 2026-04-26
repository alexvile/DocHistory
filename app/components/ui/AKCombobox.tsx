import * as Ariakit from "@ariakit/react";
import { matchSorter } from "match-sorter";
import { startTransition, useMemo } from "react";
import styles from "./AKCombobox.module.css";

type ComboOption = {
  value: string;
  label: string;
};

type AKComboBoxProps = {
  options: ComboOption[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  onSelect: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  label?: string;
  ariaLabel?: string;
  noResultsText?: string;
};

export default function AKComboBox({
  options,
  placeholder = "e.g., Apple",
  label = "Your favorite food",
  ariaLabel,
  noResultsText = "No results found",
  searchValue,
  setSearchValue,
  onSelect,
  onClear,
}: AKComboBoxProps) {
  const matches = useMemo(() => matchSorter(options, searchValue, { keys: ["label"] }), [searchValue, options]);
  const hasSearchValue = searchValue.trim().length > 0;

  return (
    <Ariakit.ComboboxProvider
      value={searchValue}
      setValue={(value) => {
        startTransition(() => setSearchValue(value));
      }}
    >
      <Ariakit.ComboboxLabel className="visually-hidden">{label}</Ariakit.ComboboxLabel>
      <div className={styles.comboboxWrapper}>
        <Ariakit.Combobox placeholder={placeholder} aria-label={ariaLabel} className="p-input" />
        {hasSearchValue && <Ariakit.ComboboxCancel className={styles.comboboxCancel} onClick={onClear} />}
      </div>

      <Ariakit.ComboboxPopover gutter={8} sameWidth className={styles.popover}>
        {matches.length ? (
          matches.map((option) => (
            <Ariakit.ComboboxItem key={option.value} value={option.label} className={styles.comboboxItem} onClick={() => onSelect(option.value)} />
          ))
        ) : (
          <div className={styles.empty}>{noResultsText}</div>
        )}
      </Ariakit.ComboboxPopover>
    </Ariakit.ComboboxProvider>
  );
}
