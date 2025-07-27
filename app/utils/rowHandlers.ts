import { Group } from "~/types";
import { shortId } from "./main";

// todo - add types
export const createRows = ({ type, groupId }) => {
  const newRow = createNewRow(type, groupId);
  // console.log(9944, newRow);
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

const createNewRow = (type: string, groupId?: string) => {
  const newId = shortId();
  return {
    id: newId,
    type,
    groupId: groupId || newId,
    title: type === "group" ? "Нова група" : "Нова деталь",
    ...(type !== "group" && { groupId: groupId }),
  };
};

// todo - move in separate function
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

function normalizeValue(key: string, value: string): string | number {
  const trimmed = value.trim();
  if (trimmed === "") return "";

  const numericFields = ["consuption_rate", "consuption_rate_per_item", "price", "sum", "quantity"];

  if (numericFields.includes(key)) {
    const num = parseFloat(trimmed);
    return isNaN(num) ? "" : num;
  }

  return trimmed;
}

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

  const sortedGroups = Object.values(groups).sort((a, b) => a.order - b.order);
  for (const group of sortedGroups) {
    group.details.sort((a, b) => a.order - b.order);
  }

  return sortedGroups;
}
