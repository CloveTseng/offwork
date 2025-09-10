<script setup>
const props = defineProps({
  dataCard: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <section class="grid grid-cols-2 gap-2">
    <div class="border-gradient gradient-card-border rounded-[32px] bg-neutral-900 py-5 px-6" v-for="data in dataCard" :key="data.id">
      <p class="text-xs text-neutral-300">{{ data.title }}</p>
      <div class="flex items-end">
        <h5 class="text-h5 font-bold">{{ data.data }}</h5>
        <p class="text-xs ps-1">{{ data.unit }}</p>
      </div>
    </div>
  </section>
</template>
<style scoped>
</style>