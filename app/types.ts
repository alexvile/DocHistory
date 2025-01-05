import type { User, Norm } from "@prisma/client";

export type SideMenuProps = {
  role: User["role"];
};
export type UserBarProps = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "role"
>;

export type UsersListProps = {
  users: Pick<User, "id" | "email" | "firstName" | "lastName" | "role">[];
};

export type NormsListProps = {
  norms: Norm[];
};
