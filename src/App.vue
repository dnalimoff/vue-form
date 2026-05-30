<script setup lang="ts">
import { ref } from 'vue';
import FormGenerator from './components/FormGenerator.vue';
import formSchema from './data/formSchema.json';
import type { FormData, FormSchema } from './types/form';

const schema = formSchema as FormSchema;
const formData = ref<FormData>({});

function handleSubmit(data: FormData) {
  console.log('Submitted form:', data);
}
</script>

<template>
  <main class="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
    <section class="mx-auto w-full max-w-3xl">
      <div>
        <h1 class="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
          Генератор формы из JSON-схемы
        </h1>
        <p class="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Компонент ниже получает JSON-схему, строит поля, валидирует их и
          записывает введённые значения в объект данных.
        </p>

        <FormGenerator
          v-model="formData"
          class="mt-8"
          :schema="schema"
          @submit="handleSubmit"
        />
      </div>
    </section>
  </main>
</template>
