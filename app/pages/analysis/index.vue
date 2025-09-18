<script setup>
useSeoMeta({
  title: "大吼分析 | 健康生活 OFFWORK APP",
  ogTitle: "大吼分析 | 健康生活 OFFWORK APP",
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
const currentPage = ref('大吼')
const activeViewKey = ref('day')
const showDemoBottomSheet = ref(false);
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
const isOpen = ref(false);
</script>
<template>
  <!-- 功能列 -->
  <section
    class="sticky flex items-center justify-between bg-[#29292DCC] px-4 py-3 backdrop-blur sm:top-[56px] z-50"
  >
    <NuxtLink to="/analyze">
      <img src="/icons/my/arrow-left-s-line.svg" alt="返回"
    /></NuxtLink>

    <h1 class="text-xl font-bold text-white">大吼</h1>
    <button @click="isOpen = true">
      <img src="/icons/my/arrow-up-down-fill.svg" alt="設定" />
    </button>
  </section>
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
    <!-- 大吼時段 -->
    <section>
      <CardTimeline :activeView="activeViewKey"/>
    </section>
    <!-- 大吼關鍵字 -->
    <CardAnalyzeCard
      title="大吼關鍵字"
      charts="bubble"
      />
    <!-- nav -->
    <div class="sticky inset-x-0 bottom-2">
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
    <!-- bottomSheet -->
    <LayoutBottomSheet
    handleMarginBottom="mb-5"
    v-model="isOpen"
    :threshold="0.3"
    :backdrop-fade="0.6"
  >
    <ul class="text-md text-white">
      <li>
        <NuxtLink
          :class="`block w-full rounded-xl px-6 py-4 text-center font-bold ${currentPage == '大吼' ? 'bg-neutral-900 text-primary' : ''}`"
          to="/"
          @click="isOpen = true"
        >
          大吼
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :class="`block w-full rounded-xl px-6 py-4 text-center font-bold ${currentPage == 'sleep' ? 'bg-neutral-900 text-primary' : ''}`"
          to="/my/target/sleep"
          @click="isOpen = false"
        >
          呼吸
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :class="`block w-full rounded-xl px-6 py-4 text-center font-bold ${currentPage == 'sleep' ? 'bg-neutral-900 text-primary' : ''}`"
          to="/my/target/sleep"
          @click="isOpen = false"
        >
          冥想
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :class="`block w-full rounded-xl px-6 py-4 text-center font-bold ${currentPage == 'sleep' ? 'bg-neutral-900 text-primary' : ''}`"
          to="/my/target/sleep"
          @click="isOpen = false"
        >
          睡眠
        </NuxtLink>
      </li>
    </ul>
    </LayoutBottomSheet>
  </main>
</template>
<style scoped>

</style>