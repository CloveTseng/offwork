<script setup>
useSeoMeta({
  title: "分析 | 健康生活 OFFWORK APP",
  ogTitle: "分析 | 健康生活 OFFWORK APP",
});
definePageMeta({
  header: {
    // backTo: { path: "/", query: { openCeremony: "true" } },
    title: "分析",
  },
});
</script>
<template>
  <main class="bg-neutral-950 px-4 grid gap-4">
    <div class=" text-white">
      <!-- 日期及日曆 -->
      <section class="flex justify-between items-center">
        <NuxtLink to="/" class="bg-[#333339] rounded-full p-2 text-center transition">
          <img src="/icons/white-left-arrow.svg" alt="左箭頭" />
        </NuxtLink>
        <div class="bg-[#333339] rounded-full py-2 px-4 text-center">
          <p class="text-[14px] leading-relaxed font-bold">7/17</p>
        </div>
        <NuxtLink to="#" class="bg-[#333339] rounded-full p-2 text-center">
          <img src="/icons/right-arrow.svg" alt="左箭頭" />
        </NuxtLink>
      </section>
      <!-- 爆發指數 -->
      <section></section>
      <div></div>
    </div>
    <!-- nav -->
    <div class="sticky inset-x-0 bottom-2">
      <LayoutNavBar />
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
</template>