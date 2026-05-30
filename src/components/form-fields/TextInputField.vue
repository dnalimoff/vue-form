<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  getFieldAutocomplete,
  getFieldInputType,
  getFieldName,
} from '../../utils/formSchema';
import type { FieldValue, TextField } from '../../types/form';

const props = defineProps<{
  field: TextField;
  hasError?: boolean;
  modelValue?: FieldValue;
}>();

const isReadonly = ref(true);

const inputValue = computed(() => {
  if (typeof props.modelValue === 'boolean') {
    return '';
  }

  return String(props.modelValue ?? '');
});

const emit = defineEmits<{
  blur: [];
  'field-change': [value: string];
}>();

function handleInput(event: Event) {
  emit('field-change', (event.target as HTMLInputElement).value);
}

function enableInput() {
  isReadonly.value = false;
}
</script>

<template>
  <input
    :id="field.model"
    :autocomplete="getFieldAutocomplete(field)"
    class="h-11 w-full rounded-md border bg-white px-3 text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
    :class="hasError ? 'border-rose-500' : 'border-slate-300'"
    :name="getFieldName(field)"
    :readonly="isReadonly"
    :type="getFieldInputType(field)"
    :value="inputValue"
    :placeholder="field.placeholder"
    @blur="emit('blur')"
    @focus="enableInput"
    @input="handleInput"
    @pointerdown="enableInput"
  />
</template>
