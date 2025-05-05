import { TableAction } from "~/types";

export const addGroup: TableAction = [
  "group",
  () => console.log("addGroup clicked!"),
];
export const addDetail: TableAction = [
  "detail",
  () => console.log("addDetail clicked!"),
];
