export const FIELD_TYPES = {
  CHECKBOX: 'checkbox',
  EMAIL: 'email',
  PASSWORD: 'password',
  SELECT: 'select',
  TEXT: 'text',
} as const;

export const TEXT_FIELD_TYPES = [
  FIELD_TYPES.TEXT,
  FIELD_TYPES.EMAIL,
  FIELD_TYPES.PASSWORD,
] as const;
