import type { User, Product, ChangeSet } from "@prisma/client";

export type UserRoleVM = User["role"];
export type UserVM = Pick<User, "id" | "email" | "firstName" | "lastName" | "role">;
export type ProductVM = Pick<Product, "id" | "title" | "code" | "updatedAt">;

// Canonical row mapped from the Excel columns
export type CanonicalRow = {
  businessKey: string; // GROUP+NAME+ASSORTMENT+DSTU+UNIT+NOTES (normalized)
  groupName?: string; // Norm group from an Excel row where only the name is filled
  name?: string; // Name
  assortment?: string; // Assortment
  dstu?: string; // DSTU
  unit?: string; // Unit of measure
  consumption?: number; // Consumption rate
  consumptionPerUnit?: number; // Consumption rate per unit
  notes?: string; // Notes
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

// For the changes table
export type ChangeVM = Pick<ChangeSet, "id" | "status" | "createdAt"> & {
  createdBy: Pick<User, "firstName" | "lastName">;
  product: Pick<Product, "id" | "title">;
  approver: Pick<User, "firstName" | "lastName">;
};

// For change set details and individual view
export type ChangeSetVM = Pick<ChangeSet, "id" | "status" | "approverId" | "decidedAt"> & {
  createdAt: string;
  diff: NormDiff;
  createdBy: Pick<User, "firstName" | "lastName">;
  approver: Pick<User, "firstName" | "lastName"> | null;
};

// Sort and filter bar
export type SortOption = {
  value: string;
  label: string;
};

export type SortGroup = {
  label: string;
  options: SortOption[];
};

export type SortConfig =
  | {
      default: string;
      options: SortOption[];
      groups?: never;
    }
  | {
      default: string;
      groups: SortGroup[];
      options?: never;
    };

export type SortBoxProps = {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  config: SortConfig;
};

type ProductOption = {
  id: string;
  title: string;
};

export type SortAndFilterBarProps = {
  sortConfig?: SortConfig;
  showChangeStatusFilter?: boolean;
  filterConfigs?: FilterConfig[];
  showQueryFilter?: boolean;
  showMyFilter?: boolean;
  showLimit?: boolean;
  productOptions?: ProductOption[];
  showCalendar?: boolean;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  /** Query param key, for example "status" */
  key: string;
  /** UI label */
  label: string;
  /** Select options */
  options: FilterOption[];
  /** Default value */
  default: string;
};


// todo - Use DTOs for DB and backend boundaries
// todo - Use VMs (view models) for frontend data