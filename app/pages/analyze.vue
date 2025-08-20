<script setup>
useSeoMeta({
  title: "分析 | 健康生活 OFFWORK APP",
  ogTitle: "分析 | 健康生活 OFFWORK APP",
});
</script>
<template>
  <main class="bg-neutral-950 px-4 grid gap-4">
      <div class=" text-white">
        <h3 class="text-xl font-bold leading-[1.4] text-center py-[10px]">分析</h3>
        <div class="flex justify-between items-center">
          <div class="bg-[#333339] rounded-full p-2 text-center">
            <img src="/icons/white-left-arrow.svg" alt="左箭頭" />
          </div>
          <div class="bg-[#333339] rounded-full py-2 px-4 text-center">
            <p class="text-[14px] leading-relaxed font-bold">7/17</p>
          </div>
          <div class="bg-[#333339] rounded-full p-2 text-center">
            <img src="/icons/right-arrow.svg" alt="左箭頭" />
          </div>
        </div>
      </div>
      <!-- nav -->
      <div class="sticky inset-x-0 bottom-2">
        <LayoutNavBar />
        <LayoutBottomBar class="mb-2 mt-[27px]" />
      </div>
  </main>
</template>