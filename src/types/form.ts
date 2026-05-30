import type { FIELD_TYPES } from '../constants/fieldTypes';

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

export type FieldValue = boolean | number | string;

export type FormData = Record<string, FieldValue>;

export interface BaseField {
  label: string;
  model: string;
  required?: boolean;
  type: FieldType;
}

export interface TextField extends BaseField {
  minLength?: number;
  pattern?: string;
  placeholder?: string;
  type: typeof FIELD_TYPES.TEXT | typeof FIELD_TYPES.EMAIL | typeof FIELD_TYPES.PASSWORD;
}

export interface SelectField extends BaseField {
  options: string[];
  type: typeof FIELD_TYPES.SELECT;
}

export interface CheckboxField extends BaseField {
  type: typeof FIELD_TYPES.CHECKBOX;
}

export type FormFieldSchema = CheckboxField | SelectField | TextField;

export interface FormSchema {
  fields: FormFieldSchema[];
}

export type FormErrors = Partial<Record<string, string>>;
