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
export type ProductNormsTableProps = {
  normsRows: any;
  // norms: ProductWithNorms['norms'],
  isEditable: boolean
}

// delete | addGroup | addElement
export type TableAction<T> = [name: string, handler: (arg: T) => void];


// type TableAction<T> = [name: string, handler: (arg: T) => void];

// const updateCell: TableAction<number> = ["Update", (id) => console.log(`Updating cell ${id}`)];

// processAction(updateCell, 42);