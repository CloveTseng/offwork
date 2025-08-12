<script setup>
// 儲存目前時間（字串）
const currentTime = ref("");
// 用來保存 setTimeout 的 ID，以便清除
let timer;

// 主計時函式：顯示當下時間，並排程到下一個整分鐘再更新
function tick() {
  const n = new Date();
  // 格式化成 HH:mm
  currentTime.value = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;

  // 計算距離下一個整分鐘還有多少毫秒
  // 60秒減去目前秒數，再扣掉毫秒數
  const ms = 60000 - (n.getSeconds() * 1000 + n.getMilliseconds());

  // 安排下一次 tick，在「下一個整分鐘」的時間點執行
  timer = setTimeout(tick, ms);
}

// 重新同步時間（例如從背景回到前景時呼叫）
function resync() {
  clearTimeout(timer); // 清除原本的計時器，避免重複
  tick(); // 立刻執行一次，並重新安排下一個整分
}

onMounted(() => {
  tick(); // 初始化時間並開始計時
  // 當頁面從背景回到前景時，立即校準時間
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) resync();
  });
});

onUnmounted(() => {
  // 元件卸載時清除計時器，避免記憶體洩漏
  clearTimeout(timer);
});
</script>

<template>
  <!-- 最外層的容器 -->
  <div class="h-dvh items-center justify-center sm:flex sm:py-8">
    <!-- 模擬手機容器 -->
    <div class="app-wrapper | relative h-full sm:h-[812px] sm:w-[375px]">
      <!-- APP 內容 -->
      <section
        class="app-content | size-full sm:rounded-[50px] sm:bg-white"
        :class="
          $route.path === '/' || ''
            ? 'sm:overflow-hidden'
            : 'sm:overflow-x-hidden sm:overflow-y-scroll'
        "
      >
        <!-- 時間、動態島、狀態（純裝飾） -->
        <div
          class="sticky top-0 z-50 hidden grid-cols-3 items-center py-2.5 text-center text-white sm:grid"
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
