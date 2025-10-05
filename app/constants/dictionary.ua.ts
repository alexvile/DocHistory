import type { Role } from "@prisma/client";

export const DICTIONARY_UA = {
  ROLES: {
    ADMIN: "Адміністратор",
    COMMITTER: "Нормувальник",
    VIEWER: "Бухгалтер",
  } satisfies Record<Role, string>, 
};
// todo - add details properties