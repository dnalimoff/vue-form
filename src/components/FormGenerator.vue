<script setup lang="ts">
import { useFormGenerator } from '../composables/useFormGenerator';
import type { FormData, FormSchema } from '../types/form';
import FormField from './form-fields/FormField.vue';

const props = defineProps<{
  modelValue: FormData;
  schema: FormSchema;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: FormData];
  submit: [value: FormData];
}>();

const {
  errors,
  fields,
  isValid,
  markTouched,
  shouldShowError,
  submit,
  updateField,
} = useFormGenerator(props, emit);

</script>

<template>
  <form
    autocomplete="off"
    class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    novalidate
    @submit.prevent="submit"
  >
    <div class="space-y-5">
      <FormField
        v-for="field in fields"
        :key="field.model"
        :error="errors[field.model]"
        :field="field"
        :model-value="modelValue[field.model]"
        :show-error="shouldShowError(field)"
        @blur="markTouched(field)"
        @field-change="updateField(field, $event)"
      />
    </div>

    <div class="mt-6 flex items-center gap-3">
      <button
        class="h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        type="submit"
      >
        Отправить
      </button>

      <p class="text-sm text-slate-500">
        {{ isValid ? 'Форма заполнена корректно' : 'Заполните обязательные поля' }}
      </p>
    </div>
  </form>
</template>
