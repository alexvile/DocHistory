type FieldValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: 'string' | 'number';
  optional?: boolean; // if null/undefined is allowed
};

type ValidationSchema = Record<string, { value: unknown } & FieldValidationRules>;

export function validateFields(schema: ValidationSchema): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = rules.value;

    if (value == null || value === '') {
      if (rules.required && !rules.optional) {
        errors[field] = 'Це поле є обовʼязковим';
        continue;
      }
    }

    if (rules.type === 'string' && typeof value !== 'string') {
      if (!rules.optional || value !== undefined) {
        errors[field] = 'Має бути рядком';
        continue;
      }
    }

    if (rules.type === 'number' && typeof value !== 'number') {
      if (!rules.optional || value !== undefined) {
        errors[field] = 'Має бути числом';
        continue;
      }
    }

    if (typeof value === 'string') {
      if (rules.minLength && value.trim().length < rules.minLength) {
        errors[field] = `Мінімум ${rules.minLength} символів`;
      }
      if (rules.maxLength && value.trim().length > rules.maxLength) {
        errors[field] = `Максимум ${rules.maxLength} символів`;
      }
    }
  }

  return errors;
}

export function buildDynamicTitleValidators(obj: Record<string, unknown>): Record<string, FieldValidationRules & { value: unknown }> {
  const dynamic: Record<string, FieldValidationRules & { value: unknown }> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('title__')) {
      dynamic[key] = {
        value,
        type: 'string',
        required: true,
      };
    }
  }

  return dynamic;
}

