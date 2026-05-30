<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FieldValue, FormFieldSchema } from '../../types/form';
import { getFieldName } from '../../utils/formSchema';

const props = defineProps<{
  field: FormFieldSchema;
  hasError?: boolean;
  modelValue?: FieldValue;
}>();

const options = computed(() => ('options' in props.field ? props.field.options : []));
const selectedValue = computed(() => {
  const value = props.modelValue;

  return typeof value === 'string' && options.value.includes(value) ? value : '';
});
const isOpen = ref(false);
const activeIndex = ref(-1);

const emit = defineEmits<{
  blur: [];
  'field-change': [value: string];
}>();

function toggleOpen() {
  if (isOpen.value) {
    closeSelect();
    return;
  }

  openSelect();
}

function openSelect() {
  isOpen.value = true;
  activeIndex.value = getInitialActiveIndex();
}

function closeSelect() {
  isOpen.value = false;
  activeIndex.value = -1;
  emit('blur');
}

function selectOption(option: string) {
  emit('field-change', option);
  isOpen.value = false;
  activeIndex.value = options.value.indexOf(option);
}

function handleKeydown(event: KeyboardEvent) {
  const handlers: Partial<Record<string, () => void>> = {
    ArrowDown: () => moveActiveOption(1),
    ArrowUp: () => moveActiveOption(-1),
    Enter: selectActiveOption,
    Escape: closeSelect,
    ' ': selectActiveOption,
  };

  const handler = handlers[event.key];

  if (!handler) {
    return;
  }

  event.preventDefault();
  handler();
}

function moveActiveOption(direction: 1 | -1) {
  if (!isOpen.value) {
    openSelect();
    return;
  }

  const lastIndex = options.value.length - 1;

  if (lastIndex < 0) {
    return;
  }

  if (activeIndex.value === -1) {
    activeIndex.value = direction === 1 ? 0 : lastIndex;
    return;
  }

  activeIndex.value =
    direction === 1
      ? Math.min(activeIndex.value + 1, lastIndex)
      : Math.max(activeIndex.value - 1, 0);
}

function selectActiveOption() {
  if (!isOpen.value) {
    openSelect();
    return;
  }

  const option = options.value[activeIndex.value];

  if (option) {
    selectOption(option);
  }
}

function getInitialActiveIndex() {
  const selectedIndex = options.value.indexOf(selectedValue.value);

  return selectedIndex >= 0 ? selectedIndex : 0;
}
</script>

<template>
  <div
    class="relative"
    tabindex="-1"
    @focusout="closeSelect"
  >
    <input :name="getFieldName(field)" :value="selectedValue" type="hidden" />

    <button
      :id="field.model"
      :aria-expanded="isOpen"
      :aria-controls="`${field.model}-options`"
      :aria-activedescendant="
        isOpen && activeIndex >= 0 ? `${field.model}-option-${activeIndex}` : undefined
      "
      class="flex h-11 w-full items-center justify-between rounded-md border bg-white px-3 text-left text-slate-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      :class="hasError ? 'border-rose-500' : 'border-slate-300'"
      role="combobox"
      type="button"
      @click="toggleOpen"
      @keydown="handleKeydown"
    >
      <span :class="selectedValue ? 'text-slate-950' : 'text-slate-400'">
        {{ selectedValue || 'Выберите значение' }}
      </span>

      <span
        class="ml-3 text-slate-500 transition"
        :class="isOpen ? 'rotate-180' : ''"
        aria-hidden="true"
      >
        ▾
      </span>
    </button>

    <div
      v-if="isOpen"
      :id="`${field.model}-options`"
      class="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
      role="listbox"
    >
      <button
        v-for="(option, index) in options"
        :key="option"
        :id="`${field.model}-option-${index}`"
        :aria-selected="option === selectedValue"
        class="flex min-h-10 w-full items-center justify-between px-3 text-left text-sm transition hover:bg-teal-50"
        :class="
          option === selectedValue || index === activeIndex
            ? 'bg-teal-50 text-teal-800'
            : 'text-slate-700'
        "
        role="option"
        type="button"
        @mousedown.prevent="selectOption(option)"
        @mouseenter="activeIndex = index"
      >
        <span>{{ option }}</span>
        <span v-if="option === selectedValue" class="text-teal-700" aria-hidden="true">
          ✓
        </span>
      </button>
    </div>
  </div>
</template>
