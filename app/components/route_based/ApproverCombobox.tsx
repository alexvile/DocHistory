import { useMemo, useState } from "react";
import { UserVM } from "~/types";
import AKComboBox from "../ui/AKCombobox";

type Approver = Pick<UserVM, "id" | "firstName" | "lastName">;

type Props = {
  approverOptions: Approver[];
  value?: string;
  setValue: (value: string) => void;
};

type ComboOption = {
  value: string;
  label: string;
};

export function ApproverCombobox({ approverOptions, value, setValue }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const comboboxOptions: ComboOption[] = useMemo(
    () =>
      approverOptions.map((p) => ({
        value: p.id,
        label: p.firstName + " " + p.lastName,
      })),
    [approverOptions],
  );

  function handleSelect(selectedValue: string) {
    setValue(selectedValue);
  }

  function handleClear() {
    setValue("");
  }

  return (
    <AKComboBox
      options={comboboxOptions}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      onSelect={handleSelect}
      onClear={handleClear}
      placeholder="Оберіть особу"
      label="Оберіть особу"
      ariaLabel="Оберіть особу"
      noResultsText="Не знайдено"
    />
  );
}
