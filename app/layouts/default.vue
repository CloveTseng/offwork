<script setup>
/* ──────────────────────────────────────────────
 * ① 路由 & 滾動狀態：換頁時把內容區捲回頂端
 *  - 桌面預覽時，真正捲動的是 .app-content（不是 window）
 *  - 手機/小螢幕時，可能是 window 在捲動
 * ────────────────────────────────────────────── */
const route = useRoute();
const appContentRef = ref(null);

/** 將 .app-content 與 window 都捲回頂端（雙保險） */
function resetScroll() {
  if (!import.meta.client) return;
  const el = appContentRef?.value;
  if (el) el.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "auto" });
}

/** 只有「路徑(path)」改變才重置（query 改變不會觸發） */
watch(
  () => route.path,
  async () => {
    // 等 DOM/class 切換完成（例如 overflow-hidden ↔︎ overflow-y-scroll）
    await nextTick();
    resetScroll();
  },
);

/* ──────────────────────────────────────────────
 * ② 客戶端判斷：避免 SSR / hydration 在伺服器端動到 DOM
 * ────────────────────────────────────────────── */
const isClient = import.meta.client;

/* ──────────────────────────────────────────────
 * ③ 顯示當下時間：每分鐘整點校時，避免「越跑越飄」
 * ────────────────────────────────────────────── */
const currentTime = ref("");
let timer = null;

/** 以 HH:MM 方式渲染現在時間（手動補零） */
function renderNow() {
  const n = new Date();
  currentTime.value = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

/** 排到「下一個整分」再觸發，維持長時間精準 */
function scheduleNextMinute() {
  const n = new Date();
  const ms = 60000 - (n.getSeconds() * 1000 + n.getMilliseconds());
  timer = setTimeout(() => {
    renderNow();
    scheduleNextMinute(); // 重新排下一個整分
  }, ms);
}

/** 清掉計時器（避免記憶體外洩或重複排程） */
function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

/** 重新校時：先清舊計時器，再立刻渲染、重排下一個整分 */
function resync() {
  clearTimer();
  renderNow();
  scheduleNextMinute();
}

/* ──────────────────────────────────────────────
 * ④ 頁面可見性/焦點：回到分頁時重新校時（時間不會落後）
 * ────────────────────────────────────────────── */
const onVisibility = () => {
  if (!document.hidden) resync();
};
const onFocus = () => resync();

/* ──────────────────────────────────────────────
 * ⑤ 生命週期：掛載/卸載
 * ────────────────────────────────────────────── */
onMounted(() => {
  // 首次載入就把內容區捲回頂端（避免從其他頁帶著捲動位置回來）
  resetScroll();

  if (!isClient) return;
  // 啟動時間顯示與精準排程
  resync();
  // 只綁一次全域事件，且使用具名 handler，卸載時才能正確移除
  document.addEventListener("visibilitychange", onVisibility, {
    passive: true,
  });
  window.addEventListener("focus", onFocus, { passive: true });
});

onUnmounted(() => {
  // 清理計時器與事件監聽，保持乾淨
  clearTimer();
  if (isClient) {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("focus", onFocus);
  }
});

/* ──────────────────────────────────────────────
 * ⑥ HMR（開發模式熱更新）：重新載入前也要確實清理
 * ────────────────────────────────────────────── */
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearTimer();
    if (isClient) {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    }
  });
}

/* ──────────────────────────────────────────────
 * A) 路徑白名單：完全相符才生效（不吃父層/包含）
 * ────────────────────────────────────────────── */
// 1) 內容區「不可捲動」的路徑
const NON_SCROLLABLE_PATHS = new Set([
  "/",
  "/yelling",
  "/find-peace/calm-breathe",
]);

// 2) 狀態列使用 bg-secondary 的路徑
const STATUSBAR_SECONDARY_PATHS = new Set(["/", "/find-peace/calm-breathe"]);

const currentPath = computed(() => route.path);

/* ──────────────────────────────────────────────
 * B) 視覺與互動邏輯：由 computed 輸出 class
 * ────────────────────────────────────────────── */
const isNonScrollable = computed(() =>
  NON_SCROLLABLE_PATHS.has(currentPath.value),
);

const appContentScrollClass = computed(() =>
  isNonScrollable.value
    ? "overflow-hidden"
    : "sm:overflow-x-hidden sm:overflow-y-scroll",
);

const statusBarBgClass = computed(() =>
  STATUSBAR_SECONDARY_PATHS.has(currentPath.value)
    ? "bg-secondary"
    : "bg-[#29292DCC] backdrop-blur-lg",
);
</script>

<template>
  <!--
    最外層：讓「手機殼」在桌面置中顯示；小螢幕直接滿版
    - h-dvh：滿高（支援動態瀏覽器工具列高度）
    - sm:flex：桌面才置中
  -->
  <div class="h-dvh items-center justify-center sm:flex sm:py-8">
    <!--
      模擬手機容器：負責放 iPhone 外框（用 ::before / ::after 畫）
      - relative：提供定位參考給外框與內部絕對定位元素
    -->
    <div class="app-wrapper | relative h-full sm:h-[812px] sm:w-[375px]">
      <!--
        APP 內容：實際顯示頁面的地方
        - ref=appContentRef：桌面預覽時「真正的滾動容器」
        - :class="appContentScrollClass"：「不可捲動」的白名單
      -->
      <section
        ref="appContentRef"
        class="app-content | relative size-full bg-neutral-950 sm:rounded-[50px]"
        :class="appContentScrollClass"
      >
        <!--
          頂部狀態列（僅桌面顯示，用來模擬動態島與系統狀態）
          - sticky top-0：捲動時固定在頂
          - z-10：壓在內容之上
          - 背景色根據 statusBarBgClass 白名單切換
        -->
        <div
          class="sticky top-0 z-10 hidden grid-cols-3 items-center py-2.5 text-center text-white sm:grid"
          :class="statusBarBgClass"
        >
          <span>{{ currentTime }}</span>
          <img src="/dynamic-island.svg" alt="island" />
          <img src="/status.svg" alt="status" />
        </div>
        <!-- 子頁面會透過 <slot/> 插進來 -->
        <slot />
      </section>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 640px) {
  /* iPhone 外框 */
  .app-wrapper:before {
    content: "";
    width: calc(100% + 28px);
    height: calc(50% + 10px);
    position: absolute;
    bottom: calc(0% - 10px);
    left: 50%;
    transform: translate(-50%);
    background-image: url(/iphone.svg);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: bottom center;
    pointer-events: none;
  }

  .app-wrapper:after {
    content: "";
    width: calc(100% + 28px);
    height: calc(50% + 10px);
    position: absolute;
    top: calc(0% - 10px);
    left: 50%;
    transform: translate(-50%);
    background-image: url(/iphone.svg);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: top center;
    pointer-events: none;
  }

  /* 內容區（桌面）隱藏滾動條外觀（仍可捲動） */
  .app-content {
    scrollbar-width: none;
  }
}
</style>
