<script setup>
const props = defineProps({
  activeView: {
    type: String,
    default: 'day'
  }
})
const generateChartGridData = (xLabels, yLength, dataPoints = []) => {
  const gridData = []
  const dataMap = new Map()

  dataPoints.forEach(([x, y, value]) => {
    const key = `${x},${y}`
    dataMap.set(key, value)
  })

  for (let x = 0; x < xLabels.length; x++) {
    for (let y = 1; y <= yLength; y++) {
      const key = `${x},${y}`
      const value = dataMap.get(key) || 0
      gridData.push([x, y, value])
    }
  }
  return gridData
}
const rawData = {
  day: [
    [0, 5, 2], [0, 6, 10]
  ],
  week: [
    [0, 5, 2], [1, 4, 10], [1, 5, 2], [2, 6, 4], [3, 3, 2], [4, 5, 2], [4, 6, 7]
  ],
  month: [
    [0, 4, 2], [0, 5, 5], [0, 6, 2], [1, 4, 2], [1, 5, 10], [1, 15, 3], [2, 3, 2], [2, 4, 10], [2, 5, 10], [2, 6, 10], [2, 7, 5]
  ],
  year: [
    [2, 5, 1],
    [3, 4, 5], [3, 5, 5], 
    [4, 5, 4], [4, 6, 4], 
    [5, 4, 2], [5, 5, 10], [5, 6, 2], 
    [6, 3, 12],[6, 4, 10],[6, 5, 10],[6, 6, 10],[6, 7, 5], 
  ]
}
const viewConfigs = {
  day: {
    labels: ['Today'],
    yLabels:  Array.from({ length: 25 }, (_, i) => `${24 - i}:00`),
    data: generateChartGridData(['Today'], 24, rawData.day)
  },
  week: {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    yLabels:  Array.from({ length: 25 }, (_, i) => `${24 - i}:00`),
    data: generateChartGridData(['S', 'M', 'T', 'W', 'T', 'F', 'S'], 24, rawData.week)
  },
  month: {
    labels: ['1', '8', '15', '22', '29'],
    yLabels:  Array.from({ length: 25 }, (_, i) => `${24 - i}:00`),
    data: generateChartGridData(['1', '8', '15', '22', '29'], 24, rawData.month)
  },
  year: {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    yLabels:  Array.from({ length: 25 }, (_, i) => `${24 - i}:00`),
    data: generateChartGridData(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 24, rawData.year)
  }
}
const chartLabel = {
  day: {
    title: '',
    items: [
    { label: '1-2', color: '#A4CD444D' },
    { label: '3-4', color: '#A4CD44B2' },
    { label: '>5', color: '#A4CD44' }]
  },
  week: {
    title: '週均次數',
    items: [
    { label: '1-14', color: '#A4CD444D' },
    { label: '15-24', color: '#A4CD44B2' },
    { label: '>25', color: '#A4CD44' }]
  },
  month: {
    title: '月均次數',
    items: [
    { label: '1-14', color: '#A4CD444D' },
    { label: '15-24', color: '#A4CD44B2' },
    { label: '>25', color: '#A4CD44' }]
  },
  year: {
    title: '年均次數',
    items: [
      { label: '1-59', color: '#A4CD444D' },
      { label: '60-119', color: '#A4CD44B2' },
      { label: '>120', color: '#A4CD44' }
    ]
  },
};
const chartData = computed(() => {
  return viewConfigs[props.activeView]
})

</script>
<template>
  <div class="border-gradient gradient-card-border rounded-[32px] bg-neutral-900 py-5 px-6">
    <p class="text-xl text-white font-bold">大吼時段</p>  
    <div v-if="!chartData" class="text-xs text-neutral-300 py-2">資料載入中…</div>
    <ChartsTimelineChart v-else :chart-data="chartData" />
      <p class="text-end text-[11px] pt-0 mb-4" v-if="chartData === 'today'">today</p>
    <ul class="flex justify-end items-center gap-4 mt-4">
      <p class="text-end text-[11px] text-neutral-300">{{ chartLabel[props.activeView].title }}</p>
      <li v-for="{ label, color } in chartLabel[props.activeView].items" :key="index" class="flex items-center gap-1">
          <span class="w-[12px] h-[12px] rounded-sm block" :style="{backgroundColor: color}"></span><span class="text-[11px] font-xxs text-neutral-300">{{ label }}次</span>
      </li>
    </ul>
  </div>
</template>
<style scoped>
</style>