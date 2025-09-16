<script setup>
useSeoMeta({
  title: "大吼分析 | 健康生活 OFFWORK APP",
  ogTitle: "大吼分析 | 健康生活 OFFWORK APP",
});
definePageMeta({
  header: {
    backTo: {path: '/analyze'},
    title: "大吼",
    showRight: { openParam: { openDemoBottomSheet: "true" } },
  },
});
const route = useRoute();
const router = useRouter();
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
// 判斷 URL 是否帶了 openDemoBottomSheet 參數（存在即可）
const hasDemoParam = computed(
  () => route.query.openDemoBottomSheet !== undefined,
);

// URL → UI：網址有參數就打開；移除參數就關閉
watch(hasDemoParam, (has) => {
  if (has && !showDemoBottomSheet.value) showDemoBottomSheet.value = true;
  if (!has && showDemoBottomSheet.value) showDemoBottomSheet.value = false;
});

// UI → URL：開啟時補上參數；關閉時移除參數（用 replace 保持瀏覽紀錄乾淨）
watch(showDemoBottomSheet, (open) => {
  if (!import.meta.client) return;
  const q = { ...route.query };
  if (open) {
    if (!("openDemoBottomSheet" in q)) {
      router.replace({ query: { ...q, openDemoBottomSheet: "true" } });
    }
  } else {
    if ("openDemoBottomSheet" in q) {
      delete q.openDemoBottomSheet;
      router.replace({ query: q });
    }
  }
});

// 進頁面時若本來就有參數，直接打開
onMounted(() => {
  if (hasDemoParam.value) showDemoBottomSheet.value = true;
});
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
      v-model="showDemoBottomSheet"
      hasBottomBar
      :threshold="0.3"
      :backdrop-fade="0.6"
    >
      <p class="text-white">
        這是 Demo Bottom Sheet。<br />
        點標題列右側按鈕（layout 代為注入 query） → URL 出現
        <code>?openDemoBottomSheet=true</code> → 這裡自動打開。 關閉時會自動從
        URL 移除該參數。
      </p>
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </LayoutBottomSheet>
  </main>
</template>
<style scoped>
</style>