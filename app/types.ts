import type { User, Product } from "@prisma/client";

export type SideMenuProps = {
  role: User["role"];
};
export type UserBarProps = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "role"
>;

export type FilteredUser = Pick<
  User,
  "id" | "email" | "firstName" | "lastName" | "role"
>;

export type UsersListProps = {
  users: FilteredUser[];
};

export type FilteredProduct = Pick<
  Product,
  "id" | "productTitle" | "updatedAt"
>;

export type ProductsListProps = {
  products: FilteredProduct[];
};

export type ProductWithNorms = Pick<
  Product,
  "id" | "productTitle" | "norms" | "updatedAt"
>;

