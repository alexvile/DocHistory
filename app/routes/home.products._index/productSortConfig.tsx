import { SortConfig } from "~/types";

const productSortConfig: SortConfig = {
  default: "title:asc",
  options: [
    {
      label: "Назва A → Z",
      value: "title:asc",
    },
    {
      label: "Назва Z → A",
      value: "title:desc",
    },
    {
      label: "Оновлено спочатку нові",
      value: "updated:desc",
    },
    {
      label: "Оновлено спочатку старі",
      value: "updated:asc",
    },
  ],
};

export default productSortConfig;
