<script setup>
// 只在瀏覽器端執行（避免 SSR/hydration 觸發）
const isClient = import.meta.client;

const currentTime = ref("");
let timer = null;

function renderNow() {
  const n = new Date();
  currentTime.value = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function scheduleNextMinute() {
  const n = new Date();
  const ms = 60000 - (n.getSeconds() * 1000 + n.getMilliseconds());
  timer = setTimeout(() => {
    renderNow();
    scheduleNextMinute(); // 重新排到下一個整分，避免漂移
  }, ms);
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function resync() {
  clearTimer();
  renderNow();
  scheduleNextMinute();
}

// 具名 handler，之後才能正確 remove
const onVisibility = () => {
  if (!document.hidden) resync();
};
const onFocus = () => resync();

onMounted(() => {
  if (!isClient) return;
  // 初始化並開始排程
  resync();
  // 綁定一次就好，且都用具名函式
  document.addEventListener("visibilitychange", onVisibility, {
    passive: true,
  });
  window.addEventListener("focus", onFocus, { passive: true });
});

onUnmounted(() => {
  // 正常導航離開時清理
  clearTimer();
  if (isClient) {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("focus", onFocus);
  }
});

// HMR 熱更新時也要確實清掉（開發模式很重要）
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearTimer();
    if (isClient) {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    }
  });
}
</script>

<template>
  <!-- 最外層的容器 -->
  <div class="h-dvh items-center justify-center sm:flex sm:py-8">
    <!-- 模擬手機容器 -->
    <div class="app-wrapper | relative h-full sm:h-[812px] sm:w-[375px]">
      <!-- APP 內容 -->
      <section
        class="app-content | relative size-full sm:rounded-[50px] sm:bg-white"
        :class="
          $route.path === '/' || ''
            ? 'sm:overflow-hidden'
            : 'sm:overflow-x-hidden sm:overflow-y-scroll'
        "
      >
        <!-- 時間、動態島、狀態（純裝飾） -->
        <div
          class="sticky top-0 z-10 hidden grid-cols-3 items-center py-2.5 text-center text-white sm:grid"
          :class="$route.path === '/' || '' ? 'bg-secondary' : 'bg-neutral-950'"
        >
          <span>{{ currentTime }}</span>
          <img src="/dynamic-island.svg" alt="island" />
          <img src="/status.svg" alt="status" />
        </div>
        <!-- 主要內容插槽 -->
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

  /* APP 內容 */
  .app-content {
    scrollbar-width: none;
  }
}
</style>
