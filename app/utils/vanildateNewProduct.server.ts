type RawForm = Record<string, FormDataEntryValue>;

export type ProductFormErrors = {
  excel?: string;
  title?: string;
};

export type ProductFormData = {
  norms: string;
  title: string;
  code?: string;
};

export function validateProductForm(raw: RawForm) {
  const errors: ProductFormErrors = {};

  const norms =
    typeof raw.norms === "string"
      ? raw.norms
      : "";

  const title =
    typeof raw.title === "string"
      ? raw.title.trim()
      : "";

  const code =
    typeof raw.code === "string"
      ? raw.code.trim()
      : undefined;

  if (!norms) {
    errors.excel = "Потрібно завантажити Excel-файл";
  }

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
