import { useEffect, useMemo, useState } from "react";
import AKComboBox from "~/components/ui/AKCombobox";

type ProductOption = {
  id: string;
  title: string;
};

type Props = {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  productOptions: ProductOption[];
};

type ComboOption = {
  value: string;
  label: string;
};

export function ProductCombobox({ searchParams, setSearchParams, productOptions }: Props) {
  const comboboxOptions: ComboOption[] = useMemo(
    () =>
      productOptions.map((p) => ({
        value: p.id,
        label: p.title,
      })),
    [productOptions],
  );

  const selectedId = searchParams.get("productId") ?? "";

  const selectedLabel = comboboxOptions.find((o) => o.value === selectedId)?.label ?? "";

  const [searchValue, setSearchValue] = useState(selectedLabel);

  useEffect(() => {
    setSearchValue(selectedLabel);
  }, [selectedLabel]);

  function handleSelect(value: string) {
    searchParams.set("productId", value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  function handleClear() {
    searchParams.delete("productId");
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <AKComboBox
      options={comboboxOptions}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      onSelect={handleSelect}
      onClear={handleClear}
      placeholder="Оберіть продукт"
      label="Оберіть продукт"
      ariaLabel="Оберіть продукт"
      noResultsText="Продуктів не знайдено"
    />
  );
}
