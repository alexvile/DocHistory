import type { User, Product, Change, Prisma } from "@prisma/client";

export type SideMenuProps = {
  role: User["role"];
};
export type UserBarProps = Pick<User, "id" | "firstName" | "lastName" | "email" | "role">;

export type FilteredUser = Pick<User, "id" | "email" | "firstName" | "lastName" | "role">;

export type UsersListProps = {
  users: FilteredUser[];
};

export type FilteredProduct = Pick<Product, "id" | "productTitle" | "updatedAt">;

export type ProductsListProps = {
  products: FilteredProduct[];
};

// export type FilteredChanges = Pick<Change, "id"  | "createdAt">;

type FilteredChangeWithRelations = Prisma.ChangeGetPayload<{
  select: {
    id: true;
    createdAt: true;
    creator: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
    product: {
      select: {
        productTitle: true;
      };
    };
  };
}>;
export type ChangesListProps = {
  changes: FilteredChangeWithRelations[];
};

export type ProductWithNorms = Pick<Product, "id" | "productTitle" | "norms" | "updatedAt">;
export type ProductNormsTableProps = {
  normsRows: any;
  // norms: ProductWithNorms['norms'],
  isEditable: boolean;
};

// delete | addGroup | addElement
export type TableAction<T> = [name: string, handler: (arg: T) => void];

// type TableAction<T> = [name: string, handler: (arg: T) => void];

// const updateCell: TableAction<number> = ["Update", (id) => console.log(`Updating cell ${id}`)];

// processAction(updateCell, 42);
export type Detail = {
  id: string;
  type: "detail";
  order: number;
  title?: string;
  assortment?: string;
  standard?: string;
  unit?: string;
  consuption_rate?: number;
  consuption_rate_per_item?: number;
  price?: number;
  sum?: number;
  notes?: string;
};

export type Group = {
  id: string;
  type: "group";
  title: string;
  details: Detail[];
  code?: string;
  unit?: string;
  quantity?: number;
  [key: string]: any;
};
// todo - check if needed
export type Norm = Group;

// Change types
export type GroupAdded = { type: "group-added"; group: Group };
export type GroupRemoved = { type: "group-removed"; group: Group };
export type GroupUpdated = {
  type: "group-updated";
  groupId: string;
  oldGroupTitle: string;
  changes: { field: string; old: any; new: any }[];
};
export type DetailAdded = {
  type: "detail-added";
  groupId: string;
  groupTitle: string;
  detail: Detail;
};
export type DetailRemoved = {
  type: "detail-removed";
  groupId: string;
  groupTitle: string;
  detail: Detail;
};
export type DetailUpdated = {
  type: "detail-updated";
  groupId: string;
  groupTitle: string;
  detailId: string;
  detailTitle: string;
  changes: { field: string; old: any; new: any }[];
};

export type NormChange = GroupAdded | GroupRemoved | GroupUpdated | DetailAdded | DetailRemoved | DetailUpdated;
