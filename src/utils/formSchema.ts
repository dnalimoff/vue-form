import { FIELD_TYPES } from '../constants/fieldTypes';
import type {
  CheckboxField,
  FieldValue,
  FormData,
  FormFieldSchema,
  FormSchema,
  SelectField,
  TextField,
} from '../types/form';

export function getSchemaFields(schema: FormSchema): FormFieldSchema[] {
  return Array.isArray(schema?.fields) ? schema.fields : [];
}

export function getDefaultFieldValue(field: FormFieldSchema): FieldValue {
  return field.type === FIELD_TYPES.CHECKBOX ? false : '';
}

export function normalizeFieldValue(field: FormFieldSchema, value: FieldValue | undefined): FieldValue {
  if (isCheckboxField(field)) {
    return Boolean(value);
  }

  if (isSelectField(field)) {
    return typeof value === 'string' && field.options.includes(value) ? value : '';
  }

  return typeof value === 'string' ? value : '';
}

export function buildInitialFormData(
  fields: FormFieldSchema[],
  currentValue: FormData = {},
): FormData {
  return fields.reduce(
    (result, field) => {
      result[field.model] = normalizeFieldValue(field, result[field.model]);

      return result;
    },
    { ...currentValue },
  );
}

export function getFieldInputType(field: FormFieldSchema): string {
  if (field.type === FIELD_TYPES.EMAIL || field.type === FIELD_TYPES.PASSWORD) {
    return field.type;
  }

  return FIELD_TYPES.TEXT;
}

export function getFieldAutocomplete(field: FormFieldSchema): string {
  if (field.type === FIELD_TYPES.PASSWORD) {
    return 'new-password';
  }

  return 'off';
}

export function getFieldName(field: FormFieldSchema): string {
  return `generated-${field.model}`;
}

export function isTextField(field: FormFieldSchema): field is TextField {
  return (
    field.type === FIELD_TYPES.TEXT ||
    field.type === FIELD_TYPES.EMAIL ||
    field.type === FIELD_TYPES.PASSWORD
  );
}

export function isSelectField(field: FormFieldSchema): field is SelectField {
  return field.type === FIELD_TYPES.SELECT;
}

export function isCheckboxField(field: FormFieldSchema): field is CheckboxField {
  return field.type === FIELD_TYPES.CHECKBOX;
}
