import { JsonValue } from "@prisma/client/runtime/library";

type RawForm = Record<string, FormDataEntryValue>;

export type ProductFormErrors = {
  excel?: string;
  title?: string;
};

export type ProductFormData = {
  norms: JsonValue;
  title: string;
  code?: string;
};

export function validateProductForm(raw: RawForm) {
  const errors: ProductFormErrors = {};

  let norms: JsonValue | undefined;

  if (typeof raw.norms === "string" && raw.norms.trim()) {
    try {
      norms = JSON.parse(raw.norms);
    } catch {
      errors.excel = "Некоректний формат даних Excel";
    }
  } else {
    errors.excel = "Потрібно завантажити Excel-файл";
  }

  const title =
    typeof raw.title === "string"
      ? raw.title.trim()
      : "";

  const code =
    typeof raw.code === "string"
      ? raw.code.trim()
      : undefined;

  if (!title) {
    errors.title = "Назва є обовʼязковою";
  }

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
    data: {
      norms,
      title,
      code,
    } as ProductFormData,
  };
}
