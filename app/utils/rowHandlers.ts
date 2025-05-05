import { shortId } from "./ttt";

export const createRows = ({ type, groupColor, groupId }) => {
  const newRow = createNewRow(type, groupId, groupColor);
  console.log(9944, newRow);
  const rowsToAdd =
    type === "group"
      ? [
          newRow,
          {
            id: "s__" + newRow.id,
            type: "spacing",
            title: "",
            groupId: newRow.id,
          },
        ]
      : [newRow];

  console.log(9944, rowsToAdd);
  return rowsToAdd;
};
// ! todo - refactor

const createNewRow = (type: string, groupId?: string, groupColor?: string) => {
  const newId = shortId();
  return {
    id: newId,
    type,
    groupId: groupId || newId,
    title: type === "group" ? "Нова група" : "Нова деталь",
    groupColor:
      type === "group"
        ? `#${Math.floor(Math.random() * 16777215).toString(16)}`
        : groupColor,
    ...(type !== "group" && { groupId: groupId }),
  };
};










type Detail = {
  id: string;
  type: "detail";
  order: number;
  title?: string;
  assortment?: string;
  standard?: string;
  unit?: string;
  consuption_rate?: number | string;
  consuption_rate_per_item?: number | string;
  price?: number | string;
  sum?: number | string;
  notes?: string;
};

type Group = {
  id: string;
  type: "group";
  order: number;
  title: string;
  code?: string;
  unit?: string;
  quantity?: number | string;
  details: Detail[];
};

// мапа коротких полів з форми → стандартні ключі
const fieldNameMap: Record<string, string> = {
  cr: "consuption_rate",
  cr_pi: "consuption_rate_per_item",
  ass: "assortment",
  std: "standard",
  title: "title",
  unit: "unit",
  price: "price",
  sum: "sum",
  notes: "notes",
  quantity: "quantity",
  code: "code",
};

// нормалізує значення
function normalizeValue(key: string, value: string): string | number {
  const trimmed = value.trim();
  if (trimmed === "") return "";

  const numericFields = [
    "consuption_rate",
    "consuption_rate_per_item",
    "price",
    "sum",
    "quantity",
  ];

  if (numericFields.includes(key)) {
    const num = parseFloat(trimmed);
    return isNaN(num) ? "" : num;
  }

  return trimmed;
}

// основна функція
export function parseFormData(formData: Record<string, string>): Group[] {
  const groups: Record<string, Group> = {};
  const detailOrderMap: Record<string, number> = {};
  let groupIndex = 0;

  for (const [key, value] of Object.entries(formData)) {
    const parts = key.split("__");

    if (parts.length === 2) {
      const [rawField, groupId] = parts;
      const field = fieldNameMap[rawField] || rawField;

      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          type: "group",
          order: groupIndex++,
          title: "",
          details: [],
        };
        detailOrderMap[groupId] = 0;
      }

      if (field === "title") {
        groups[groupId].title = value;
      } else {
        (groups[groupId] as any)[field] = normalizeValue(field, value);
      }
    }

    if (parts.length === 3) {
      const [rawField, groupId, detailId] = parts;
      const field = fieldNameMap[rawField] || rawField;

      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          type: "group",
          order: groupIndex++,
          title: "",
          details: [],
        };
        detailOrderMap[groupId] = 0;
      }

      let detail = groups[groupId].details.find((d) => d.id === detailId);
      if (!detail) {
        detail = {
          id: detailId,
          type: "detail",
          order: detailOrderMap[groupId]++,
        };
        groups[groupId].details.push(detail);
      }

      (detail as any)[field] = normalizeValue(field, value);
    }
  }

  // сортуємо групи та їхні деталі
  const sortedGroups = Object.values(groups).sort((a, b) => a.order - b.order);
  for (const group of sortedGroups) {
    group.details.sort((a, b) => a.order - b.order);
  }

  return sortedGroups;
}
