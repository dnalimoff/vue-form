import { computed, reactive, ref, watch } from 'vue';
import { buildInitialFormData, getSchemaFields, normalizeFieldValue } from '../utils/formSchema';
import { validateForm } from '../utils/formValidation';
import type { FormData, FormFieldSchema, FormSchema, FieldValue } from '../types/form';

interface FormGeneratorProps {
  schema: FormSchema;
  modelValue: FormData;
}

type FormGeneratorEmit = {
  (event: 'update:modelValue', value: FormData): void;
  (event: 'submit', value: FormData): void;
};

export function useFormGenerator(props: FormGeneratorProps, emit: FormGeneratorEmit) {
  const touched = reactive<Record<string, boolean>>({});
  const submitted = ref(false);

  const fields = computed(() => getSchemaFields(props.schema));

  const errors = computed(() => validateForm(fields.value, props.modelValue));
  const isValid = computed(() => Object.keys(errors.value).length === 0);

  watch(
    fields,
    (newFields) => {
      const nextValue = buildInitialFormData(newFields, props.modelValue);

      if (hasChanged(nextValue, props.modelValue)) {
        emit('update:modelValue', nextValue);
      }
    },
    { immediate: true },
  );

  function updateField(field: FormFieldSchema, value: FieldValue) {
    emit('update:modelValue', {
      ...props.modelValue,
      [field.model]: normalizeFieldValue(field, value),
    });
  }

  function markTouched(field: FormFieldSchema) {
    touched[field.model] = true;
  }

  function shouldShowError(field: FormFieldSchema): boolean {
    return Boolean(errors.value[field.model] && (touched[field.model] || submitted.value));
  }

  function submit() {
    submitted.value = true;
    fields.value.forEach(markTouched);

    if (!isValid.value) {
      return;
    }

    emit('submit', { ...props.modelValue });
  }

  return {
    errors,
    fields,
    isValid,
    markTouched,
    shouldShowError,
    submit,
    updateField,
  };
}

function hasChanged(nextValue: FormData, currentValue: FormData): boolean {
  const nextKeys = Object.keys(nextValue);
  const currentKeys = Object.keys(currentValue);

  return (
    nextKeys.length !== currentKeys.length ||
    nextKeys.some((key) => nextValue[key] !== currentValue[key])
  );
}
