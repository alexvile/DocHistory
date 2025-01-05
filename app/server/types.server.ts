import type { User } from "@prisma/client";
export type RegisterForm = Pick<
  User,
  "email" | "password" | "firstName" | "lastName" | "role"
>;
export type LoginForm = Pick<User, "email" | "password">;
