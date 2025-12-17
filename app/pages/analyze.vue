<script setup lang="ts">
useSeoMeta({
  title: "分析 | 健康生活 OFFWORK APP",
  ogTitle: "分析 | 健康生活 OFFWORK APP",
});
definePageMeta({
  header: {
    title: "分析",
  },
});
const analyzeData = ref([
  {
    id: 1,
    title: "大吼",
    data: 80,
    unit: "dB",
    comment: "最大分貝",
    url: "/analysis",
    charts: "progress",
    isUpStandard:false
  },
  {
    id: 2,
    title: "心情關鍵字",
    charts: "bubble",
  },
  {
    id: 3,
    title: "睡眠",
    data: 6.5,
    unit: "小時 / 8小時",
    comment: "今日 / 目標",
    url: "#",
    charts: "doughnut",
    isUpStandard:true
  },
  {
    id:4,
    title: "呼吸",
    data: 30,
    unit: "分鐘 / 3分鐘",
    comment: "今日 / 目標",
    url: "#",
    charts: "doughnut",
    isUpStandard:true
  },
  {
    id:5,
    title: "冥想",
    comment: "尚無紀錄",
    url: "#",
  },
])
const currentDate = ref('7/17');
const openModal = ref(false);
const chartTitle = ref('爆發指數')
const handleCalendarSelect = () => {
  openModal.value = false
}
</script>
<template>
  <ClientOnly>
  <main class="bg-neutral-950 px-4 ">
    <div class=" text-white grid gap-4 py-4">
      <!-- 日期及日曆 -->
      <LayoutDateNavigation :dateText="currentDate" @open-modal="openModal = true"/>
      <CommonModal v-model:show="openModal">
        <CommonCalendar @select-day="handleCalendarSelect"/>
      </CommonModal>
      <!-- 爆發指數 -->
      <section>
        <ChartsHalfCircleBar :chartTitle="chartTitle"/>
      </section>
      <!-- 火山君關心你 -->
      <CardVolcanokun />
      <!-- 分析圖卡 -->
      <template v-for="item in analyzeData" :key="item.id">
        <CardAnalyzeCard
          :title="item.title"
          :data="item.data"
          :unit="item.unit"
          :comment="item.comment"
          :url="item.url"
          :charts="item.charts"
          :isUpStandard="item.isUpStandard"
        />
      </template>
    </div>
    <!-- nav -->
    <div class="sticky inset-x-0 bottom-2">
      <LayoutNavBar />
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
  </ClientOnly>
</template>