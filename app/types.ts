import type { User, Product, ChangeSet, Prisma } from "@prisma/client";

// todo - USE DTO - for DB and backend
// todo - use VM (view model) for frontend

export type UserRoleVM = User["role"];
export type UserVM = Pick<User, "id" | "email" | "firstName" | "lastName" | "role">;

export type UsersListProps = {
  users: UserVM[];
};

export type FilteredProduct = Pick<Product, "id" | "title" | "updatedAt">;

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

export type ProductWithNorms = Pick<Product, "id" | "productTitle" | "updatedAt">;
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

// Канонічний рядок під твої колонки
export type CanonicalRow = {
  businessKey: string; // NAME+DSTU+UNIT (нормалізовані)
  name?: string; // Назва
  assortment?: string; // Сортамент
  dstu?: string; // ДСТУ
  unit?: string; // Од. виміру
  consumption?: number; // Норма розходу
  consumptionPerUnit?: number; // Норма розходу на одиницю
  notes?: string; // Нотатки / Примітки
};

export type NormsTableProps = {
  normsJson: CanonicalRow[];
};

export type NormDiff = {
  added: CanonicalRow[];
  removed: CanonicalRow[];
  changed: {
    key: string;
    before: CanonicalRow;
    after: CanonicalRow;
    fields: string[];
  }[];
};

export type ChangeVM = Pick<ChangeSet, "id" | "status"> & {
  createdAt: string;
  createdBy: Pick<User, "firstName" | "lastName">;
};

export type ChangeSetVM = Pick<ChangeSet, "id" | "status"> & {
  createdAt: string;
  diff: NormDiff;
  createdBy: Pick<User, "firstName" | "lastName">;
};

// sort and filterbar
export type SortOption = {
  label: string;
  value: string;
};

export type SortConfig = {
  default: string;
  options: SortOption[];
};

export type SortBoxProps = {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  config: SortConfig;
};

export type SortAndFilterBarProps = {
  sortConfig?: SortConfig;
  showChangeStatusFilter: boolean;
  filterConfigs?: FilterConfig[];
  showQueryFilter?: boolean;
  showLimit?: boolean;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  /** query param key, наприклад "status" */
  key: string;

  /** label для UI */
  label: string;

  /** значення селекта */
  options: FilterOption[];

  /** дефолтне значення */
  default: string;
};
