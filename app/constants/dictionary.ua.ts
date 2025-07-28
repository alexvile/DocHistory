import type { Role } from "@prisma/client";

export const DICTIONARY_UA = {
  ROLES: {
    ADMIN: "Адміністратор",
    COMMITTER: "Комітер",
    VIEWER: "Переглядач",
  } satisfies Record<Role, string>, 
};
// todo - add details properties