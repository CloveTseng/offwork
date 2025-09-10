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
  { key: 'day', label: '日', to: '/analysis/day' },
  { key: 'week', label: '週', to: '/analysis/week' },
  { key: 'month', label: '月', to: '/analysis/month' },
  { key: 'year', label: '年', to: '/analysis/year' },
];
const showDemoBottomSheet = ref(false);
const currentDate = ref('07/17');
const openModal = ref(false);

provide('currentDate', currentDate)
</script>
<template>
  <CommonViewSwitcher :views="views"/>
</template>
<style scoped>
</style>