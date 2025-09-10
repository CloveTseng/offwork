<script setup>
const currentDate = inject('currentDate')
const chartTitle = ref('大吼指數')
</script>
<template>
<main class="p-4 text-white">
  <!-- 日期及日曆 -->
  <LayoutDateNavigation :dateText="currentDate" @open-modal="openModal = true"/>
  <CommonModal v-model:show="openModal">
    <CommonCalendar />
  </CommonModal>
  <!-- 大吼指數 -->
  <section>
    <ChartsHalfCircleBar :chartTitle="chartTitle" />
  </section>
  
</main> 
</template>
<style scoped>
</style>