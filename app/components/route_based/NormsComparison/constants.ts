export type ColumnKey =
  | "index"
  | "name"
  | "assortment"
  | "dstu"
  | "unit"
  | "consumption"
  | "consumptionPerUnit"
  | "notes";

export const columns: { key: ColumnKey; label: string }[] = [
  { key: "index", label: "№" },
  { key: "name", label: "Назва" },
  { key: "assortment", label: "Сортамент" },
  { key: "dstu", label: "ДСТУ" },
  { key: "unit", label: "Од." },
  { key: "consumption", label: "Норма" },
  { key: "consumptionPerUnit", label: "Норма на од." },
  { key: "notes", label: "Примітки" },
];