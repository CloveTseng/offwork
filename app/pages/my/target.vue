<script setup>
const route = useRoute();
// 獲取當前的子路由
const currentPage = computed(() => {
  const pathSegments = route.path.split("/");
  return pathSegments[pathSegments.length - 1] || "default";
});
const isOpen = ref(false);

useSeoMeta({
  title: "我的 | 健康生活 OFFWORK APP",
  ogTitle: "我的 | 健康生活 OFFWORK APP",
});
</script>
<template>
  <main class="flex h-full flex-col">
    <!-- 功能列 -->
    <section
      class="sticky flex items-center justify-between bg-neutral-950 px-4 py-3 sm:top-[56px]"
    >
      <NuxtLink to="/my">
        <img src="/icons/my/arrow-left-s-line.svg" alt="返回"
      /></NuxtLink>

      <h1 class="text-xl font-bold text-white">目標</h1>
      <button @click="isOpen = true">
        <img src="/icons/my/arrow-up-down-fill.svg" alt="設定" />
      </button>
    </section>
    <div class="mb-5 px-4 pt-4">
      <!-- 通知設定列 -->
      <section
        class="mb-5 flex items-center justify-between font-bold text-white"
      >
        <h2 class="text-lg">{{ currentPage == "breath" ? "呼吸" : "睡眠" }}</h2>
        <NuxtLink to="/my/notify" class="py-[9px] text-md font-bold"
          >通知設定</NuxtLink
        >
      </section>
      <!-- feedback box -->
      <section class="flex gap-2 pb-[2px]">
        <div class="size-20 shrink-0">
          <img src="/images/home/normal-circle.webp" alt="綠色火山君" />
        </div>
        <div class="relative rounded-3xl bg-alert-success px-5 py-4">
          <p class="text-sm text-neutral-950">
            {{
              currentPage == "breath"
                ? "呼吸訓練就像身心的小充電，能幫你放鬆、減壓、睡更好，連專注力也一起升級喔！"
                : "每天睡滿7-9小時，讓大腦充電、情緒穩定、精神更好，還能增強免疫力，醒來更有活力！"
            }}
          </p>
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute -left-4 top-[18px] h-[25px] w-5"
          >
            <path
              d="M1.93107 9.81568C0.382573 9.10046 0.382572 6.89954 1.93107 6.18432L13.9114 0.650855C15.2367 0.0387299 16.75 1.00671 16.75 2.46654L16.75 13.5335C16.75 14.9933 15.2367 15.9613 13.9114 15.3491L1.93107 9.81568Z"
              fill="#A4CD44"
            />
          </svg>
        </div>
      </section>
    </div>
    <!-- 按鈕 -->
    <NuxtPage />

    <LayoutBottomSheet
      handleMarginBottom="mb-5"
      v-model="isOpen"
      :threshold="0.3"
      :backdrop-fade="0.6"
    >
      <ul class="text-md text-white">
        <li>
          <NuxtLink
            :class="`block w-full rounded-xl px-6 py-4 text-center ${currentPage == 'breath' ? 'bg-neutral-900 text-primary' : ''}`"
            to="/my/target/breath"
            @click="isOpen = false"
          >
            呼吸
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :class="`block w-full rounded-xl px-6 py-4 text-center ${currentPage == 'sleep' ? 'bg-neutral-900 text-primary' : ''}`"
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
