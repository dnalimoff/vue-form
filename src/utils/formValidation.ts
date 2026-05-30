import { FIELD_TYPES } from '../constants/fieldTypes';
import type { FieldValue, FormData, FormErrors, FormFieldSchema } from '../types/form';
import { isTextField } from './formSchema';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(field: FormFieldSchema, value: FieldValue | undefined): string {
  const hasTextValue = typeof value === 'string' && value.trim() !== '';

  if (field.required) {
    const isEmptyString = typeof value === 'string' && value.trim() === '';
    const isMissingCheckbox = field.type === FIELD_TYPES.CHECKBOX && value !== true;

    if (value === undefined || value === null || isEmptyString || isMissingCheckbox) {
      return 'Обязательное поле';
    }
  }

  if (isTextField(field) && field.minLength && hasTextValue && value.length < field.minLength) {
    return `Минимум ${field.minLength} символов`;
  }

  if (isTextField(field) && field.pattern && hasTextValue && !matchesPattern(field.pattern, value)) {
    return 'Неверный формат';
  }

  if (field.type === FIELD_TYPES.EMAIL && hasTextValue && !EMAIL_PATTERN.test(value)) {
    return 'Введите корректный email';
  }

  return '';
}

export function validateForm(fields: FormFieldSchema[], formData: FormData): FormErrors {
  return fields.reduce<FormErrors>((result, field) => {
    const message = validateField(field, formData[field.model]);

    if (message) {
      result[field.model] = message;
    }

    return result;
  }, {});
}

function matchesPattern(pattern: string, value: string): boolean {
  try {
    return new RegExp(pattern).test(value);
  } catch {
    return false;
  }
}
