import type { Role } from "@prisma/client";

export const DICTIONARY_UA = {
  ROLES: {
    ADMIN: "Адміністратор",
    COMMITTER: "Нормувальник",
    VIEWER: "Бухгалтер",
  } satisfies Record<Role, string>,
  CHANGE_STATUS: {
    DRAFT: "Чорновий",
    ON_REVIEW: "На розгляді",
    APPROVED: "Схвалено(активний/або б.а)",
    REJECTED: "Відхилено",
  },
};
// todo - add details properties
