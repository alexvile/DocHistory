import { SortConfig } from "~/types";

const changesSortConfig: SortConfig = {
  default: "created:desc",
  options: [
    {
      label: "Спочатку нові",
      value: "created:desc",
    },
    {
      label: "Спочатку старі",
      value: "created:asc",
    },
  ],
};

export default changesSortConfig;
