<script setup>
useSeoMeta({
  title: "首頁 | 健康生活 OFFWORK APP",
  ogTitle: "首頁 | 健康生活 OFFWORK APP",
});

const route = useRoute();
const router = useRouter();

// 是否帶了 openCeremony 或 openFeelingBetter 或 openFeelingCalm 參數（空字串/true/1 都視為存在）
const hasOpenParam = computed(() => route.query.openCeremony !== undefined);
const hasFeelingParam = computed(
  () => route.query.openFeelingBetter !== undefined,
);
const hasCalmParam = computed(() => route.query.openFeelingCalm !== undefined);

// 控制 Buttom Sheets (下班儀式、舒服點了嗎？、平靜點了嗎？) 顯示狀態
const showCeremonyNav = ref(false);
const showFeelingBetter = ref(false);
const showFeelingCalm = ref(false);

// 記錄 isRelieved 值，供後續判斷使用
const isRelieved = ref(false);

// 監看 URL → UI（下班儀式）
watch(hasOpenParam, (has) => {
  if (has && !showCeremonyNav.value) showCeremonyNav.value = true;
  if (!has && showCeremonyNav.value) showCeremonyNav.value = false;
});

// 監看 URL → UI（舒服點了嗎？）
watch(hasFeelingParam, (has) => {
  if (has && !showFeelingBetter.value) showFeelingBetter.value = true;
  if (!has && showFeelingBetter.value) showFeelingBetter.value = false;
});

// 監看 URL → UI（平靜點了嗎？）
watch(hasCalmParam, (has) => {
  if (has && !showFeelingCalm.value) showFeelingCalm.value = true;
  if (!has && showFeelingCalm.value) showFeelingCalm.value = false;
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

// UI → URL（舒服點了嗎？）
watch(showFeelingBetter, (open) => {
  if (!import.meta.client) return;
  const q = { ...route.query };
  if (open) {
    if (!("openFeelingBetter" in q)) {
      router.replace({ query: { ...q, openFeelingBetter: "true" } });
    }
  } else {
    if ("openFeelingBetter" in q) {
      delete q.openFeelingBetter;
      router.replace({ query: q });
    }
  }
});

// UI → URL（平靜點了嗎？）
watch(showFeelingCalm, (open) => {
  if (!import.meta.client) return;
  const q = { ...route.query };
  if (open) {
    if (!("openFeelingCalm" in q)) {
      router.replace({ query: { ...q, openFeelingCalm: "true" } });
    }
  } else {
    if ("openFeelingCalm" in q) {
      delete q.openFeelingCalm;
      router.replace({ query: q });
    }
  }
});

// 首次進入頁面：若有參數就打開對應的 bottom sheet
onMounted(() => {
  if (hasOpenParam.value) showCeremonyNav.value = true;
  if (hasFeelingParam.value) showFeelingBetter.value = true;
  if (hasCalmParam.value) showFeelingCalm.value = true;
  // 讀取 sessionStorage 的 isRelieved
  if (import.meta.client) {
    const raw = sessionStorage.getItem("isRelieved");
    if (raw !== null) isRelieved.value = raw === "true";
  }
});
</script>

<template>
  <main class="h-full bg-secondary pt-5">
    <!-- CTA、標題、時間 -->
    <div
      class="relative z-10 mx-auto mb-11 flex flex-col items-center gap-2 text-center text-md text-neutral"
    >
      <h2 class="font-medium">
        {{
          isRelieved ? "讓火山降溫，從下班開始" : "火山悶燒中，你還不下班嗎？"
        }}
      </h2>
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
      {{ isRelieved ? "爆發指數 30％" : "爆發指數 70％" }}
    </p>
    <!-- 火山君（會隨著爆發指數來換） -->
    <img
      :src="
        isRelieved
          ? '/images/home/green-volcano.webp'
          : '/images/home/red-volcano.webp'
      "
      :alt="isRelieved ? '綠色火山君' : '紅色火山君'"
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
  <!-- 下班了，也讓腦袋收工吧！ -->
  <LayoutBottomSheet
    v-model="showCeremonyNav"
    hasBottomBar
    :threshold="0.3"
    :backdrop-fade="0.6"
  >
    <div class="mb-6 text-center">
      <h3 class="mb-2 text-xl font-bold text-white">
        下班了，也讓腦袋收工吧！
      </h3>
      <p class="text-md text-neutral-300">你現在的狀態如何呢？</p>
    </div>
    <ul class="space-y-4">
      <li>
        <NuxtLink to="/yelling" class="gradient-border-1px rounded-[32px]">
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
        <NuxtLink to="/find-peace" class="gradient-border-1px rounded-[32px]">
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
  <!-- 舒服點了嗎？ -->
  <LayoutBottomSheet
    v-model="showFeelingBetter"
    hasBottomBar
    :threshold="0.3"
    :backdrop-fade="0.6"
  >
    <img
      src="/images/home/feeling-relieved.webp"
      alt="舒服點了嗎？"
      class="mx-auto mb-6 block size-32"
    />
    <!-- 標題 -->
    <div class="mb-6 text-center">
      <h3 class="mb-2 text-xl font-bold text-white">舒服點了嗎？</h3>
      <p class="text-md text-neutral-300">今天的你，也值得好好喘口氣</p>
    </div>
    <!-- 時間&分貝數 -->
    <ul class="mb-6 space-y-4">
      <!-- 你釋放了 -->
      <li>
        <article class="flex items-center gap-4 rounded-3xl bg-neutral p-5">
          <img
            src="/icons/timer.svg"
            alt="你釋放了 icon"
            class="rounded-full bg-neutral-900 p-3"
          />
          <div>
            <h4 class="mb-0.5 text-sm text-neutral-300">你釋放了</h4>
            <p class="flex gap-1 text-h5 font-bold text-alert-success">
              <span class="flex items-end gap-0.5"
                >3<span class="text-xs font-normal">分</span>
              </span>
              <span class="flex items-end gap-0.5"
                >24<span class="text-xs font-normal">秒</span>
              </span>
            </p>
          </div>
        </article>
      </li>
      <!-- 最高分貝 -->
      <li>
        <article class="flex items-center gap-4 rounded-3xl bg-neutral p-5">
          <img
            src="/icons/voice.svg"
            alt="最高分貝 icon"
            class="rounded-full bg-neutral-900 p-3"
          />
          <div>
            <h4 class="mb-0.5 text-sm text-neutral-300">最高分貝</h4>
            <p
              class="flex items-end gap-0.5 text-h5 font-bold text-alert-success"
            >
              80<span class="text-xs font-normal">dB</span>
            </p>
          </div>
        </article>
      </li>
    </ul>
    <!-- 按鈕 -->
    <div
      class="flex items-center gap-4 text-center text-md font-bold text-neutral-950"
    >
      <NuxtLink to="/yelling" class="block flex-1 rounded-full bg-white py-3">
        繼續大吼
      </NuxtLink>
      <NuxtLink to="#" class="block flex-1 rounded-full bg-alert-success py-3">
        前往分析
      </NuxtLink>
    </div>
    <LayoutBottomBar class="mb-2 mt-[27px]" />
  </LayoutBottomSheet>
  <!-- 平靜點了嗎？ -->
  <LayoutBottomSheet
    v-model="showFeelingCalm"
    hasBottomBar
    :threshold="0.3"
    :backdrop-fade="0.6"
  >
    <img
      src="/images/home/feeling-calm.webp"
      alt="平靜點了嗎？"
      class="mx-auto mb-6 block size-32"
    />
    <!-- 標題 -->
    <div class="mb-6 text-center">
      <h3 class="mb-2 text-xl font-bold text-white">平靜點了嗎？</h3>
      <p class="text-md text-neutral-300">每天幾分鐘，慢慢變得更平靜</p>
    </div>
    <!-- 你呼吸了 -->
    <article class="mb-6 flex items-center gap-4 rounded-3xl bg-neutral p-5">
      <img
        src="/icons/timer.svg"
        alt="你呼吸了 icon"
        class="rounded-full bg-neutral-900 p-3"
      />
      <div>
        <h4 class="mb-0.5 text-sm text-neutral-300">你呼吸了</h4>
        <p class="flex gap-1 text-h5 font-bold text-alert-success">
          <span class="flex items-end gap-0.5"
            >3<span class="text-xs font-normal">分鐘</span>
          </span>
          <span class="flex items-end gap-0.5"
            >24<span class="text-xs font-normal">秒</span>
          </span>
        </p>
      </div>
    </article>
    <!-- 按鈕 -->
    <div
      class="flex items-center gap-4 text-center text-md font-bold text-neutral-950"
    >
      <NuxtLink
        to="/find-peace"
        class="block flex-1 rounded-full bg-white py-3"
      >
        繼續呼吸
      </NuxtLink>
      <NuxtLink to="#" class="block flex-1 rounded-full bg-alert-success py-3">
        前往分析
      </NuxtLink>
    </div>
    <LayoutBottomBar class="mb-2 mt-[27px]" />
  </LayoutBottomSheet>
</template>
