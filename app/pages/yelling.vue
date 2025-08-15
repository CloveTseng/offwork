<script setup>
useSeoMeta({
  title: "大吼 | 健康生活 OFFWORK APP",
  ogTitle: "大吼 | 健康生活 OFFWORK APP",
});

const isYelling = ref(false);

const startYelling = () => {
  isYelling.value = true;
  if (!import.meta.client) return;
  sessionStorage.setItem("isRelieved", "true");
};
</script>

<template>
  <h1 class="relative z-10 py-2.5 text-center text-xl font-bold text-white">
    <NuxtLink
      v-if="!isYelling"
      :to="{ path: '/', query: { openCeremony: 'true' } }"
      class="absolute left-0 top-1/2 block -translate-y-1/2 py-2 pl-4 pr-2"
    >
      <img src="/icons/white-left-arrow.svg" alt="返回箭頭" />
    </NuxtLink>
    放聲大吼吧
  </h1>
  <!-- 大吼中 -->
  <main v-if="isYelling">
    <img
      src="/images/yelling/yelling-red-volcano.gif"
      alt="大吼中紅色火山君"
      class="pointer-events-none absolute bottom-[104px] left-1/2 z-0 w-full max-w-[375px] -translate-x-1/2"
    />
    <!-- 音量 Lottie、停止按鈕 -->
    <div
      class="absolute bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center bg-gradient-to-t from-neutral-950 from-40% to-[#29292D00] pt-8"
    >
      <div class="mb-8 max-w-[259px]">
        <Lottie name="yelling/volume" />
      </div>
      <!-- 停止按鈕 -->
      <div class="mb-10 rounded-full border-[11px] border-[#C0C7DC33]">
        <NuxtLink
          :to="{ path: '/', query: { openFeelingBetter: 'true' } }"
          class="block rounded-full bg-neutral-950 p-6"
        >
          <img src="/icons/yelling/stop-fill.svg" alt="停止 icon" />
        </NuxtLink>
      </div>
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
  <!-- 準備大吼 -->
  <main v-else>
    <img
      src="/images/yelling/before-yelling-red-volcano.webp"
      alt="準備大吼紅色火山君"
      class="pointer-events-none absolute bottom-[104px] left-1/2 z-0 w-full max-w-[375px] -translate-x-1/2"
    />
    <!-- 靜態音量圖片、開始按鈕 -->
    <div
      class="absolute bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center bg-gradient-to-t from-neutral-950 from-50% to-[#29292D00] pt-8"
    >
      <img src="/images/yelling/volume.webp" alt="音量圖片" class="mb-8" />
      <!-- 開始按鈕 -->
      <div class="mb-10 rounded-full border-[11px] border-[#C0C7DC33]">
        <button
          type="button"
          class="rounded-full bg-white p-6"
          @click="startYelling"
        >
          <img src="/icons/yelling/mic.svg" alt="麥克風 icon" />
        </button>
      </div>
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
</template>
