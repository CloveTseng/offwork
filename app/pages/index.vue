<script setup>
useSeoMeta({
  title: "首頁 | 健康生活 OFFWORK APP",
  ogTitle: "首頁 | 健康生活 OFFWORK APP",
});
</script>

<template>
  <main class="h-full overflow-y-hidden bg-secondary pt-5">
    <!-- CTA、標題、時間 -->
    <div
      class="mx-auto mb-11 flex flex-col items-center gap-2 text-center text-md text-neutral"
    >
      <h2 class="font-medium">讓火山降溫，從下班開始</h2>
      <h1 class="text-h2 font-bold text-neutral-900">啟動下班人生</h1>
      <span class="flex items-center gap-1 font-medium">
        <img src="/icons/clock.svg" alt="鬧鐘 icon" />下班儀式｜下午 06:30
      </span>
    </div>
    <!-- 爆發指數 -->
    <p
      class="flex items-center justify-center gap-1 text-sm font-bold text-white"
    >
      <img src="/icons/light.svg" alt="白色點點" />
      爆發指數 70％
    </p>
    <!-- 火山君（會隨著爆發指數來換） -->
    <img
      src="/images/home/red-valcano.webp"
      alt="紅色火山君"
      class="absolute bottom-10 left-1/2 z-0 w-full max-w-[366px] -translate-x-1/2"
    />
    <!-- 漸層底色&導覽選單 -->
    <div
      class="absolute bottom-0 left-1/2 z-10 w-full -translate-x-1/2 rounded-b-[50px] bg-gradient-to-t from-[#49B3DD] from-40% to-[#49B3DD00] px-4 pb-10 pt-2"
    >
      <!-- 下班儀式 -->
      <div
        class="mb-6 flex justify-center gap-6 text-center text-xs font-bold text-white"
      >
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="rounded-full bg-[#33333980] p-5 backdrop-blur"
          >
            <img src="/icons/home/mood.svg" alt="紀錄心情" />
          </button>
          紀錄心情
        </div>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="rounded-full bg-[#33333980] p-5 backdrop-blur"
          >
            <img src="/icons/home/ceremony.svg" alt="下班儀式" />
          </button>
          下班儀式
        </div>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="rounded-full bg-[#33333980] p-5 backdrop-blur"
          >
            <img src="/icons/home/sleep.svg" alt="睡眠" />
          </button>
          睡眠
        </div>
      </div>
      <!-- 切換頁面 -->
      <LayoutNavBar />
    </div>
  </main>
</template>
