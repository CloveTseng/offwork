<script setup>
useSeoMeta({
  title: "首頁 | 健康生活 OFFWORK APP",
  ogTitle: "首頁 | 健康生活 OFFWORK APP",
});

const route = useRoute();
const router = useRouter();

// 是否帶了 openCeremony 參數（空字串/true/1 都視為存在）
const hasOpenParam = computed(() => route.query.openCeremony !== undefined);

// 控制 Buttom Sheets (下班儀式) 顯示狀態
const showCeremonyNav = ref(false);

// 監看 URL → 反映到 UI（例如使用者手動改網址 / 瀏覽器前進後退）
watch(hasOpenParam, (has) => {
  if (has && !showCeremonyNav.value) showCeremonyNav.value = true;
  if (!has && showCeremonyNav.value) showCeremonyNav.value = false;
});

// 監看 UI → 反映到 URL（關閉時移除參數；開啟時補上參數）
// 用 replace 避免塞滿歷史紀錄；若想用返回鍵關閉，這裡可改用 push
watch(showCeremonyNav, (open) => {
  if (!import.meta.client) return;
  const q = { ...route.query };
  if (open) {
    if (!("openCeremony" in q)) {
      router.replace({ query: { ...q, openCeremony: "true" } });
    }
  } else {
    if ("openCeremony" in q) {
      delete q.openCeremony;
      router.replace({ query: q });
    }
  }
});

// 首次進入頁面：若有參數就打開 bottom sheet
onMounted(() => {
  if (hasOpenParam.value) showCeremonyNav.value = true;
});
</script>

<template>
  <main class="h-full bg-secondary pt-5">
    <!-- CTA、標題、時間 -->
    <div
      class="relative z-10 mx-auto mb-11 flex flex-col items-center gap-2 text-center text-md text-neutral"
    >
      <h2 class="font-medium">火山悶燒中，你還不下班嗎？</h2>
      <h1 class="text-h2 font-bold text-neutral-900">啟動下班人生</h1>
      <span class="flex items-center gap-1 font-medium">
        <img src="/icons/clock.svg" alt="鬧鐘 icon" />下班儀式｜下午 06:30
      </span>
    </div>
    <!-- 爆發指數 -->
    <p
      class="relative z-10 flex items-center justify-center gap-1 text-sm font-bold text-white"
    >
      <img src="/icons/light.svg" alt="白色點點" />
      爆發指數 70％
    </p>
    <!-- 火山君（會隨著爆發指數來換） -->
    <img
      src="/images/home/red-valcano.webp"
      alt="紅色火山君"
      class="pointer-events-none absolute bottom-10 left-1/2 z-0 w-full max-w-[366px] -translate-x-1/2"
    />
    <!-- 漸層底色&導覽選單 -->
    <div
      class="absolute bottom-0 left-1/2 z-10 w-full -translate-x-1/2 rounded-b-[50px] bg-gradient-to-t from-[#49B3DD] from-40% to-[#49B3DD00] px-4 pt-2"
    >
      <!-- 下班儀式 -->
      <div
        class="mb-6 flex justify-center gap-6 text-center text-xs font-bold text-white"
      >
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="rounded-full bg-[#33333980] p-5 shadow-button backdrop-blur"
          >
            <img src="/icons/home/mood.svg" alt="紀錄心情" />
          </button>
          紀錄心情
        </div>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="rounded-full bg-[#33333980] p-5 shadow-button backdrop-blur"
            @click="showCeremonyNav = true"
          >
            <img src="/icons/home/ceremony.svg" alt="下班儀式" />
          </button>
          下班儀式
        </div>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="rounded-full bg-[#33333980] p-5 shadow-button backdrop-blur"
          >
            <img src="/icons/home/sleep.svg" alt="睡眠" />
          </button>
          睡眠
        </div>
      </div>
      <!-- 切換頁面 -->
      <LayoutNavBar />
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
  <LayoutBottomSheet
    v-model="showCeremonyNav"
    :threshold="0.3"
    :backdrop-fade="0.6"
  >
    <template #handle>
      <LayoutBottomBar isInBottomSheet />
    </template>
    <div class="mb-6 text-center">
      <h3 class="mb-2 text-xl font-bold text-white">
        下班了，也讓腦袋收工吧！
      </h3>
      <p class="text-md text-neutral-300">你現在的狀態如何呢？</p>
    </div>
    <ul class="space-y-4">
      <li>
        <NuxtLink to="/yelling" class="gradient-border-1px">
          <article
            class="flex items-center gap-5 rounded-[32px] bg-neutral p-5"
          >
            <img
              src="/images/home/eruption.webp"
              alt="感覺有點煩"
              class="w-[120px]"
            />
            <div>
              <h4 class="mb-1 text-md font-bold text-white">感覺有點煩</h4>
              <p class="flex items-center gap-0.5 text-md text-neutral-300">
                讓我吼一吼
                <img src="/icons/right-arrow.svg" alt="右箭頭" />
              </p>
            </div>
          </article>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/find-peace" class="gradient-border-1px">
          <article
            class="flex items-center gap-5 rounded-[32px] bg-neutral p-5"
          >
            <img
              src="/images/home/breath.webp"
              alt="想找回平靜"
              class="w-[120px]"
            />
            <div>
              <h4 class="mb-1 text-md font-bold text-white">想找回平靜</h4>
              <p class="flex items-center gap-0.5 text-md text-neutral-300">
                來吸幾口氣
                <img src="/icons/right-arrow.svg" alt="右箭頭" />
              </p>
            </div>
          </article>
        </NuxtLink>
      </li>
      <li>
        <button
          type="button"
          class="w-full rounded-full bg-neutral-900 px-6 py-3 text-center text-md font-bold text-neutral-100"
          @click="showCeremonyNav = false"
        >
          先躺平，晚點再說
        </button>
      </li>
    </ul>

    <LayoutBottomBar class="mb-2 mt-[27px]" />
  </LayoutBottomSheet>
</template>
