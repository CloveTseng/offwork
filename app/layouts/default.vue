<script setup>
/* ──────────────────────────────────────────────
 * ① 路由 / 滾動復位
 *  - 桌面預覽真正捲動的是 .app-content
 *  - 小螢幕有可能是 window 在捲動
 * ────────────────────────────────────────────── */
const route = useRoute();
const router = useRouter();
const appContentRef = ref(null);
const isClient = import.meta.client;

/** 將 .app-content 與 window 都捲回頂端（雙保險） */
function resetScroll() {
  if (!isClient) return;
  const el = appContentRef?.value;
  if (el) el.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "auto" });
}

/** 路徑(path)改變才復位（query 變更不處理） */
watch(
  () => route.path,
  async () => {
    await nextTick(); // 等 overflow 類 class 切換完成
    resetScroll();
  },
);

/* ──────────────────────────────────────────────
 * ② 狀態列時間（每分鐘整點校時）
 * ────────────────────────────────────────────── */
const currentTime = ref("");
let minuteTimerId = null;

function renderNowHHMM() {
  const n = new Date();
  currentTime.value =
    `${String(n.getHours()).padStart(2, "0")}:` +
    `${String(n.getMinutes()).padStart(2, "0")}`;
}

/** 排到下一個整分觸發，長時間仍準 */
function scheduleNextMinuteTick() {
  const n = new Date();
  const ms = 60000 - (n.getSeconds() * 1000 + n.getMilliseconds());
  minuteTimerId = setTimeout(() => {
    renderNowHHMM();
    scheduleNextMinuteTick(); // 迭代下一個整分
  }, ms);
}

function clearMinuteTimer() {
  if (minuteTimerId) {
    clearTimeout(minuteTimerId);
    minuteTimerId = null;
  }
}

/** 立即校時 + 重排下一個整分 */
function resyncClock() {
  clearMinuteTimer();
  renderNowHHMM();
  scheduleNextMinuteTick();
}

/* ──────────────────────────────────────────────
 * ③ 全域事件（可見性 / 視窗焦點）
 *  - 回到分頁或重新聚焦時重新校時，避免落後
 * ────────────────────────────────────────────── */
function onVisibility() {
  if (!document.hidden) resyncClock();
}
function onFocus() {
  resyncClock();
}

function addGlobalListeners() {
  if (!isClient) return;
  document.addEventListener("visibilitychange", onVisibility, {
    passive: true,
  });
  window.addEventListener("focus", onFocus, { passive: true });
}
function removeGlobalListeners() {
  if (!isClient) return;
  document.removeEventListener("visibilitychange", onVisibility);
  window.removeEventListener("focus", onFocus);
}

/* ──────────────────────────────────────────────
 * ④ Header Meta（每頁透過 definePageMeta 注入）
 *  - 右側按鈕：有宣告 header.right 才會在 template 綁 @right
 * ────────────────────────────────────────────── */
const headerMeta = computed(() => route.meta?.header || null);
const hasHeaderMeta = computed(() => !!headerMeta.value);

/** 右側按鈕點擊：支援 to 或 openParam（合併進 query） */
function handleHeaderRight() {
  const m = headerMeta.value;
  if (!m) return;
  if (m.right?.to) return router.push(m.right.to);
  if (m.right?.openParam) {
    const q = { ...route.query, ...m.right.openParam };
    return router.replace({ query: q });
  }
}

/* ──────────────────────────────────────────────
 * ⑤ 生命週期 / HMR 清理
 * ────────────────────────────────────────────── */
onMounted(() => {
  resetScroll(); // 初次載入也把內容區捲到頂
  if (!isClient) return;
  resyncClock(); // 啟動狀態列時間
  addGlobalListeners(); // 綁一次全域事件
});

onUnmounted(() => {
  clearMinuteTimer();
  removeGlobalListeners();
});

/** HMR（開發模式）熱替換時也清乾淨，避免累積 */
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearMinuteTimer();
    removeGlobalListeners();
  });
}

/* ──────────────────────────────────────────────
 * A) 路徑白名單（完全相符才生效）
 * ────────────────────────────────────────────── */
// 1) 內容區「不可捲動」的路徑
const NON_SCROLLABLE_PATHS = new Set([
  "/",
  "/yelling",
  "/find-peace/calm-breathe",
  "/find-peace/calm-breathe/breathing",
]);

// 2) 狀態列使用 bg-secondary 的路徑
const STATUSBAR_SECONDARY_PATHS = new Set(["/", "/find-peace/calm-breathe"]);

// 3) 狀態列「透明」的路徑
const STATUSBAR_TRANSPARENT_PATHS = new Set([
  "/find-peace/calm-breathe/breathing",
]);

const currentPath = computed(() => route.path);

/* ──────────────────────────────────────────────
 * B) 視覺 class（由白名單決定）
 * ────────────────────────────────────────────── */
const isNonScrollable = computed(() =>
  NON_SCROLLABLE_PATHS.has(currentPath.value),
);

const appContentScrollClass = computed(() =>
  isNonScrollable.value
    ? "overflow-hidden"
    : "sm:overflow-x-hidden sm:overflow-y-scroll",
);

// 先判斷透明，其次 secondary，最後預設半透+模糊
const statusBarBgClass = computed(() => {
  const p = currentPath.value;
  if (STATUSBAR_TRANSPARENT_PATHS.has(p)) return "bg-transparent";
  if (STATUSBAR_SECONDARY_PATHS.has(p)) return "bg-secondary";
  return "bg-[#29292DCC] backdrop-blur-lg";
});
</script>

<template>
  <!-- 外層容器：桌面置中，小螢幕滿版 -->
  <div class="h-dvh items-center justify-center sm:flex sm:py-8">
    <div class="app-wrapper | relative h-full sm:h-[812px] sm:w-[375px]">
      <section
        ref="appContentRef"
        class="app-content | relative size-full bg-neutral-950 sm:rounded-[50px]"
        :class="appContentScrollClass"
      >
        <!-- 狀態列（背景 class 由白名單切換） -->
        <header class="sticky top-0 z-40 text-white" :class="statusBarBgClass">
          <!-- 桌面裝飾狀態列 -->
          <div
            class="hidden grid-cols-3 items-center py-2.5 text-center sm:grid"
          >
            <span>{{ currentTime }}</span>
            <img src="/dynamic-island.svg" alt="island" />
            <img src="/status.svg" alt="status" />
          </div>

          <!-- 頁面標題列（有 header meta 才呈現；有 right 才綁 listener） -->
          <LayoutHeaderBar
            v-if="hasHeaderMeta"
            :title="headerMeta.title"
            :back-to="headerMeta.backTo"
            v-on="headerMeta.right ? { right: handleHeaderRight } : {}"
          />
        </header>

        <!-- 子頁面插入點 -->
        <slot />
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 設定 app 內容容器的字型為思源黑體 */
.app-content {
  font-family: "Noto Sans TC", sans-serif;
}

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
