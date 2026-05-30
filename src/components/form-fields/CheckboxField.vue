<script setup lang="ts">
import { computed } from 'vue';
import type { FieldValue, FormFieldSchema } from '../../types/form';
import { getFieldName } from '../../utils/formSchema';

const props = defineProps<{
  field: FormFieldSchema;
  hasError?: boolean;
  modelValue?: FieldValue;
}>();

const checked = computed(() => Boolean(props.modelValue));

const emit = defineEmits<{
  blur: [];
  'field-change': [value: boolean];
}>();

function handleChange(event: Event) {
  emit('field-change', (event.target as HTMLInputElement).checked);
}
</script>

<template>
  <label
    class="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition"
    :class="hasError ? 'border-rose-500 bg-rose-50' : 'border-slate-300 bg-white'"
  >
    <input
      class="mt-1 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
      :checked="checked"
      :name="getFieldName(field)"
      type="checkbox"
      @blur="emit('blur')"
      @change="handleChange"
    />
    <span class="text-sm font-medium text-slate-700">
      {{ field.label }}
      <span v-if="field.required" class="text-rose-600">*</span>
    </span>
  </label>
</template>
