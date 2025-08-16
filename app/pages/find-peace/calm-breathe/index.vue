<script setup>
useSeoMeta({
  title: "平穩呼吸法 | 健康生活 OFFWORK APP",
  ogTitle: "平穩呼吸法 | 健康生活 OFFWORK APP",
});

// 控制 Buttom Sheets (時間設定) 顯示狀態
const showTimeSetting = ref(false);

// 你想呼吸多久？（預設 3 分鐘）
const breathingMinutes = ref("3");
</script>

<template>
  <section class="h-full bg-secondary">
    <!-- 返回按鈕 -->
    <NuxtLink to="/find-peace" class="block py-1">
      <img
        src="/icons/white-left-arrow.svg"
        alt="返回箭頭"
        class="py-2 pl-4 pr-2"
      />
    </NuxtLink>
    <!-- 呼吸火山君 -->
    <img
      src="/images/find-peace/calm-breathe/breathing-green-volcano.webp"
      alt="呼吸綠色火山君"
      class="pointer-events-none absolute bottom-[260px] left-1/2 z-0 w-full max-w-[344px] -translate-x-1/2 sm:bottom-[284px]"
    />
    <!-- 漸層裝飾色塊 -->
    <div
      class="absolute bottom-[255px] left-0 z-10 h-[200px] w-full bg-gradient-to-t from-[#5AB3D2] to-[#5AB3D200] sm:bottom-[279px]"
    ></div>
    <!-- 平穩呼吸法介紹&時間設定 -->
    <div
      class="absolute bottom-0 left-1/2 z-20 w-full -translate-x-1/2 rounded-t-[32px] bg-neutral-950 px-8 pt-8 sm:rounded-b-[50px]"
    >
      <div class="mb-5">
        <h1 class="mb-2 text-h5 font-bold text-white">平穩呼吸法</h1>
        <p class="text-sm text-neutral-300">
          這個呼吸法可以幫助你降低心跳與緊張感，讓身體慢慢鬆下來，穩定情緒、幫助你從混亂中重新找回節奏。
        </p>
      </div>
      <!-- 你想呼吸多久？（開啟時間設定） -->
      <button
        type="button"
        class="mb-5 flex w-full flex-wrap items-center justify-between rounded-3xl bg-neutral px-6 py-5 text-md font-bold text-white"
        @click="showTimeSetting = true"
      >
        你想呼吸多久？
        <span class="flex gap-1 text-alert-success">
          {{ breathingMinutes }} 分鐘
          <img src="/icons/green-down-arrow.svg" alt="綠色下箭頭 icon" />
        </span>
      </button>
      <!-- 開始按鈕 -->
      <NuxtLink
        :to="{
          path: '/find-peace/calm-breathe/breathing',
          query: { minutes: breathingMinutes },
        }"
        class="flex w-full items-center justify-center gap-1 rounded-full bg-alert-success py-3 text-center text-md font-bold text-neutral-950"
      >
        <img src="/icons/play-fill.svg" alt="實心播放 icon" />
        開始
      </NuxtLink>
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </section>
  <!-- 時間設定 Bottom Sheet -->
  <LayoutBottomSheet
    v-model="showTimeSetting"
    handleMarginBottom="mb-5"
    :threshold="0.3"
    :backdrop-fade="0.6"
  >
    <ul class="text-center text-white">
      <li
        class="cursor-pointer rounded-xl py-4 text-md font-bold transition hover:text-alert-success"
        :class="{
          'bg-neutral-900 text-alert-success': breathingMinutes === '1',
        }"
        @click="breathingMinutes = '1'"
      >
        1 分鐘
      </li>
      <li
        class="cursor-pointer rounded-xl py-4 text-md font-bold transition hover:text-alert-success"
        :class="{
          'bg-neutral-900 text-alert-success': breathingMinutes === '3',
        }"
        @click="breathingMinutes = '3'"
      >
        3 分鐘
      </li>
      <li
        class="cursor-pointer rounded-xl py-4 text-md font-bold transition hover:text-alert-success"
        :class="{
          'bg-neutral-900 text-alert-success': breathingMinutes === '5',
        }"
        @click="breathingMinutes = '5'"
      >
        5 分鐘
      </li>
      <li
        class="cursor-pointer rounded-xl py-4 text-md font-bold transition hover:text-alert-success"
        :class="{
          'bg-neutral-900 text-alert-success': breathingMinutes === '10',
        }"
        @click="breathingMinutes = '10'"
      >
        10 分鐘
      </li>
      <li
        class="cursor-pointer rounded-xl py-4 text-md font-bold transition hover:text-alert-success"
        :class="{
          'bg-neutral-900 text-alert-success': breathingMinutes === '15',
        }"
        @click="breathingMinutes = '15'"
      >
        15 分鐘
      </li>
    </ul>
  </LayoutBottomSheet>
</template>
