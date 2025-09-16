<script setup>
const props = defineProps({
  dateText: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['openModal'])
const handleDateClick = () => {
  emits('openModal')
}
</script>
<template>
<section class="flex justify-between items-center ">
  <NuxtLink to="#" class="bg-neutral-900 rounded-full p-2 text-center transition">
    <img src="/icons/white-left-arrow.svg" alt="左箭頭" loading="lazy" />
  </NuxtLink>
  <button class="bg-neutral-900 rounded-full py-2 px-4 text-center" @click="handleDateClick">
    <p class="text-[14px] leading-relaxed font-bold">{{ dateText }}</p>
  </button>
  <NuxtLink to="#" class="bg-neutral-900 rounded-full p-2 text-center">
    <img src="/icons/right-arrow.svg" alt="右箭頭" loading="lazy" />
  </NuxtLink>
</section>
</template>
<style scoped>
</style>