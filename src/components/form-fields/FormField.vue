<script setup lang="ts">
import { FIELD_TYPES } from '../../constants/fieldTypes';
import type { FieldValue, FormFieldSchema } from '../../types/form';
import { isCheckboxField, isSelectField, isTextField } from '../../utils/formSchema';
import CheckboxField from './CheckboxField.vue';
import SelectField from './SelectField.vue';
import TextInputField from './TextInputField.vue';

const props = withDefaults(
  defineProps<{
    error?: string;
    field: FormFieldSchema;
    modelValue?: FieldValue;
    showError?: boolean;
  }>(),
  {
    error: '',
    modelValue: '',
    showError: false,
  },
);

const emit = defineEmits<{
  blur: [];
  'field-change': [value: FieldValue];
}>();
</script>

<template>
  <div>
    <label
      v-if="field.type !== FIELD_TYPES.CHECKBOX"
      :for="field.model"
      class="mb-1.5 block text-sm font-medium text-slate-700"
    >
      {{ field.label }}
      <span v-if="field.required" class="text-rose-600">*</span>
    </label>

    <TextInputField
      v-if="isTextField(field)"
      :field="field"
      :has-error="showError"
      :model-value="modelValue"
      @blur="emit('blur')"
      @field-change="emit('field-change', $event)"
    />

    <SelectField
      v-else-if="isSelectField(field)"
      :field="field"
      :has-error="showError"
      :model-value="modelValue"
      @blur="emit('blur')"
      @field-change="emit('field-change', $event)"
    />

    <CheckboxField
      v-else-if="isCheckboxField(field)"
      :field="field"
      :has-error="showError"
      :model-value="modelValue"
      @blur="emit('blur')"
      @field-change="emit('field-change', $event)"
    />

    <p v-if="showError" class="mt-1.5 text-sm text-rose-600">
      {{ error }}
    </p>
  </div>
</template>
