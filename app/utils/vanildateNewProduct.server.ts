type RawForm = Record<string, FormDataEntryValue>;

export type ProductFormErrors = {
  excel?: string;
  title?: string;
};

export type ProductFormData = {
  jsonString: string;
  title: string;
  code?: string;
};

export function validateProductForm(raw: RawForm) {
  const errors: ProductFormErrors = {};

  const jsonString =
    typeof raw.jsonString === "string"
      ? raw.jsonString
      : "";

  const title =
    typeof raw.title === "string"
      ? raw.title.trim()
      : "";

  const code =
    typeof raw.code === "string"
      ? raw.code.trim()
      : undefined;

  if (!jsonString) {
    errors.excel = "Потрібно завантажити Excel-файл";
  }

  if (!title) {
    errors.title = "Назва є обовʼязковою";
  }

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
    data: {
      jsonString,
      title,
      code,
    } as ProductFormData,
  };
}
