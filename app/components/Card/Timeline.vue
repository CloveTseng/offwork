<script setup>
const props = defineProps({
  activeView: {
    type: String
  }
})
const allChartData = {
  day: {
    labels: ['Today'],
    yLabels:  Array.from({ length: 25 }, (_, i) => `${24 - i}:00`),
    data: [
      [0, 1, 0],
      [0, 2, 0],
      [0, 3, 0],
      [0, 4, 0],
      [0, 5, 4],
      [0, 6, 10],
      [0, 7, 0],
      [0, 8, 0],
      [0, 9, 0],
      [0, 10, 0],
      [0, 11, 0],
      [0, 12, 0],
      [0, 13, 0],
      [0, 14, 0],
      [0, 15, 0],
      [0, 16, 0],
      [0, 17, 0],
      [0, 18, 0],
      [0, 19, 0],
      [0, 20, 0],
      [0, 21, 0],
      [0, 22, 0],
      [0, 23, 0],
      [0, 24, 0],
    ]
  }
}
const chartData = ref(null)
watch(() => props.activeView, (newView) => {
  chartData.value = allChartData[newView]
  console.log('Timeline.vue: chartData is now:', chartData.value) 
}, { immediate: true })
</script>
<template>
  <div class="border-gradient gradient-card-border rounded-[32px] bg-neutral-900 py-5 px-6">
    <p class="text-xl text-white font-bold">大吼時段</p>
    <div v-if="!chartData" class="text-xs text-neutral-300 py-2">資料載入中…</div>
    <ChartsTimelineChart v-else :chart-data="chartData" />
    <p>Today</p>
  </div>
</template>
<style scoped>
</style>