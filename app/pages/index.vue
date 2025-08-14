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

// === Bottom sheet 拖曳關閉 ===
const sheetRef = ref(null); // 指向 <nav> bottom sheet
const handleRef = ref(null); // 指向手把（包住 LayoutBottomBar）
const backdropRef = ref(null); // 抓 backdrop
const dragging = ref(false);
const startY = ref(0);
const translateY = ref(0);
const sheetHeight = ref(0);
const backdropOpacity = ref(1);

function getClientY(e) {
  // 支援 pointer 與 touch
  // @ts-ignore
  return "touches" in e ? e.touches[0]?.clientY : e.clientY;
}

function onDragStart(e) {
  // 滑鼠只接受左鍵
  if (e.pointerType === "mouse" && e.button !== 0) return;
  if (!sheetRef.value) return;

  dragging.value = true;
  startY.value = getClientY(e);
  sheetHeight.value = sheetRef.value.getBoundingClientRect().height;
  translateY.value = 0;

  // 立即關閉過渡，避免拖曳時有慣性
  sheetRef.value.style.transition = "none";
  // 捕捉指標，拖出手把區域也能持續追蹤
  handleRef.value?.setPointerCapture?.(e.pointerId);

  // 監聽移動與放開
  window.addEventListener("pointermove", onDragMove, { passive: false });
  window.addEventListener("pointerup", onDragEnd, { once: true });
  window.addEventListener("pointercancel", onDragEnd, { once: true });
}

function onDragMove(e) {
  if (!dragging.value || !sheetRef.value) return;
  const y = getClientY(e);
  const dy = Math.max(0, y - startY.value); // 只允許往下
  translateY.value = dy;

  // 位移 + 背景淡出
  sheetRef.value.style.transform = `translateY(${dy}px)`;
  const progress = Math.min(1, dy / sheetHeight.value);
  backdropOpacity.value = 1 - progress * 0.6; // 1 → 0.4

  // 避免捲動頁面
  e.preventDefault();
}

function onDragEnd() {
  if (!sheetRef.value) return;
  dragging.value = false;
  window.removeEventListener("pointermove", onDragMove);

  const el = sheetRef.value;
  const threshold = sheetHeight.value * 0.3;

  if (translateY.value > threshold) {
    // 先讓遮罩跟著 200ms 淡出
    if (backdropRef.value) {
      backdropRef.value.style.transition = "opacity 200ms ease-in";
      backdropOpacity.value = 0;
    }

    // 超過 30%：補一個往下收合動畫
    el.style.transition = "transform 200ms ease-in";
    el.style.transform = `translateY(${sheetHeight.value}px)`;

    const done = () => {
      el.removeEventListener("transitionend", done);
      // 這裡只切 v-if，不要清 transform/transition，避免和 <transition> leave 打架
      showCeremonyNav.value = false;

      // 重置「狀態值」（不是 DOM style）
      translateY.value = 0;
      backdropOpacity.value = 1;
    };
    el.addEventListener("transitionend", done);
  } else {
    // 沒超過：彈回頂部
    el.style.transition = "transform 200ms ease-out";
    el.style.transform = "translateY(0)";
    const back = () => {
      el.removeEventListener("transitionend", back);
      // 這條可以留著，因為還會繼續顯示在畫面上
      el.style.transition = "";
      backdropOpacity.value = 1;
    };
    el.addEventListener("transitionend", back);
  }
}

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
      router.replace({ query: { ...q, openCeremony: "" } });
    }
  } else {
    if ("openCeremony" in q) {
      delete q.openCeremony;
      router.replace({ query: q });
    }
  }
});

// 首次進入頁面：若有參數就打開 bottom sheet
onMounted(async () => {
  await nextTick();
  if (hasOpenParam.value) showCeremonyNav.value = true;
});
</script>

<template>
  <main class="h-full overflow-y-hidden bg-secondary pt-5">
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
  <ClientOnly>
    <!-- Backdrop：淡入淡出 -->
    <transition name="backdrop">
      <div
        v-if="showCeremonyNav"
        ref="backdropRef"
        class="backdrop-layer absolute inset-0 z-40 bg-[#16161699] sm:rounded-[50px]"
        :style="{ '--drag': backdropOpacity }"
        @click="showCeremonyNav = false"
      ></div>
    </transition>
    <!-- Buttom Sheets：由下往上滑入 -->
    <transition name="bottomsheets">
      <nav
        v-if="showCeremonyNav"
        ref="sheetRef"
        class="absolute inset-x-0 bottom-0 z-50 block overflow-y-auto rounded-t-[32px] bg-neutral-950 px-6 pt-5"
        role="dialog"
        aria-modal="true"
      >
        <!-- 手把：包住 LayoutBottomBar 當可拖曳區 -->
        <div
          ref="handleRef"
          class="mb-6 cursor-grab touch-none select-none active:cursor-grabbing"
          @pointerdown="onDragStart"
        >
          <LayoutBottomBar isInBottomSheet />
        </div>
        <!-- 標題區 -->
        <div class="mb-6 text-center">
          <h3 class="mb-2 text-xl font-bold text-white">
            下班了，也讓腦袋收工吧！
          </h3>
          <p class="text-md text-neutral-300">你現在的狀態如何呢？</p>
        </div>
        <ul class="space-y-4">
          <!-- 感覺有點煩 -->
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
          <!-- 想找回平靜 -->
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
          <!-- 先躺平，晚點再說 -->
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
      </nav>
    </transition>
  </ClientOnly>
</template>

<style scoped>
/* 讓 backdrop 的最終不透明度 = var(--drag)（拖曳時會變）*/
.backdrop-layer {
  opacity: var(--drag, 1);
}

/* Backdrop：淡入淡出 */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Buttom Sheets：自下而上滑入 */
.bottomsheets-enter-active,
.bottomsheets-leave-active {
  transition: transform 0.3s ease-in;
}
.bottomsheets-enter-from,
.bottomsheets-leave-to {
  transform: translateY(100%);
}
</style>
