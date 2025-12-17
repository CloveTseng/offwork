<script setup lang="ts">
type DataCardItem = {
  id: number | string;
  title: string;
  data: string | number;
  unit: string;
};

const props = defineProps<{
  dataCard: DataCardItem[];
}>();
</script>

<template>
  <section class="grid grid-cols-2 gap-2">
    <div
      v-for="data in dataCard"
      :key="data.id"
      class="border-gradient gradient-card-border rounded-[32px] bg-neutral-900 px-6 py-5"
    >
      <p class="text-xs text-neutral-300">{{ data.title }}</p>
      <div class="flex items-end">
        <h5 class="text-h5 font-bold">{{ data.data }}</h5>
        <p class="ps-1 text-xs">{{ data.unit }}</p>
      </div>
    </div>
  </section>
</template>
