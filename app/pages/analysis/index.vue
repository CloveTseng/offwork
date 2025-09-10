<script setup>
useSeoMeta({
  title: "大吼分析 | 健康生活 OFFWORK APP",
  ogTitle: "大吼分析 | 健康生活 OFFWORK APP",
});
definePageMeta({
  header: {
    backTo: {path: '/analyze'},
    title: "大吼",
    right: { openParam: { openDemoBottomSheet: "true" } },
  },
});
const views = [
  { key: 'day', label: '日', },
  { key: 'week', label: '週', },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' },
];
const dataCard = [
  {
    id: 1,
    title: '最大分貝',
    data: '80',
    unit: 'dB'
  },
  {
    id: 2,
    title: '累積次數',
    data: '> 5',
    unit: '次'
  },
]
const openModal = ref(false);
const chartTitle = ref('大吼指數')
const activeViewKey = ref('day')
const handleCalendarSelect = () => {
  openModal.value = false
}
const handleViewChange = (newKey) => {
  activeViewKey.value = newKey
}
const currentDate = computed(() => {
  switch (activeViewKey.value) {
    case 'day':
      return '07/17';
    case 'week':
      return '07/13 - 07/19';
    case 'month':
      return '2024/07';
    case 'year':
      return '2024/07 - 2025/06';
  }
})
</script>
<template>
  <main class="p-4 grid gap-4 text-white">
    <!-- 視圖切換 -->
    <div class="sticky inset-x-0 top-[110px] z-10">
      <CommonViewSwitcher :views="views" @update:view="handleViewChange"/>
    </div>
    <!-- 日期及日曆 -->
    <LayoutDateNavigation :dateText="currentDate" @open-modal="openModal = true"/>
    <CommonModal v-model:show="openModal">
      <CommonCalendar @select-day="handleCalendarSelect"/>
    </CommonModal>
    <!-- 大吼指數 -->
    <ChartsHalfCircleBar :chartTitle="chartTitle"/>
    <!-- 綠色火山君 -->
    <CardVolcanokun v-if="activeViewKey !== 'day'"/>
    <!-- 數據 -->
    <CardDataCard :dataCard="dataCard"/>
    <!-- 大吼關鍵字 -->
    <CardAnalyzeCard
      title="大吼關鍵字"
      charts="bubble"
      />
    <!-- nav -->
    <div class="sticky inset-x-0 bottom-2">
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
</template>
<style scoped>
</style>