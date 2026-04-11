import { SortConfig } from "~/types";

const changesSortConfig: SortConfig = {
  default: "createdAt:desc",
  groups: [
    {
      label: "Дата створення",
      options: [
        { value: "createdAt:desc", label: "Нові спочатку" },
        { value: "createdAt:asc", label: "Старі спочатку" },
      ],
    },
    {
      label: "Дата рішення",
      options: [
        { value: "decidedAt:desc", label: "Нові спочатку" },
        { value: "decidedAt:asc", label: "Старі спочатку" },
      ],
    },
  ],
};

export default changesSortConfig;
