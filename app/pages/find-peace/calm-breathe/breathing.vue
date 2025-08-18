<script setup>
/* ──────────────────────────────────────────────
 * 基本：路由、SEO
 * ────────────────────────────────────────────── */
useSeoMeta({
  title: "平穩呼吸法呼吸中 | 健康生活 OFFWORK APP",
  ogTitle: "平穩呼吸法呼吸中 | 健康生活 OFFWORK APP",
});
const route = useRoute();
const router = useRouter();

/* ──────────────────────────────────────────────
 * ② UI 互動（行為層）：模擬 group-hover（行動裝置）
 *  - 點擊畫面觸發 2 秒的 UI 呈現（標題與控制列淡入/位移）
 * ────────────────────────────────────────────── */
const isGroupHover = ref(false);
let hoverTimer = null;
function triggerHover() {
  isGroupHover.value = true;
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => {
    isGroupHover.value = false;
    hoverTimer = null;
  }, 2000);
}

/* ──────────────────────────────────────────────
 * 呼吸分鐘數（query）
 * ────────────────────────────────────────────── */
const breathingMinutes = Number(route.query.minutes);

/* ──────────────────────────────────────────────
 * 呼吸狀態：吸/吐切換（跟著 CSS 動畫節拍）
 *  - 以 .breathing-bar 的 animationiteration 作為節拍來源
 * ────────────────────────────────────────────── */
const isBreathingIn = ref(false);
const breathingBarRef = ref(null);
const volcanoRef = ref(null);
const circleRef = ref(null);

let animSec = 0; // 白色條動畫的實際秒數

function setPhaseFromElapsed(elapsedSec) {
  if (!animSec) return;
  const iter = Math.floor(elapsedSec / animSec); // 已完成的迭代數
  const forward = iter % 2 === 0;
  isBreathingIn.value = !forward;
}

const onAnimStart = (e) => {
  // 開始或重新開始時，重讀一次動畫秒數
  const bar = breathingBarRef.value;
  if (bar) {
    const cs = getComputedStyle(bar);
    const durStr = (cs.animationDuration || "0s").split(",")[0].trim();
    animSec = durStr.endsWith("ms")
      ? parseFloat(durStr) / 1000
      : parseFloat(durStr) || 0;
  }
  setPhaseFromElapsed(e.elapsedTime);
};

const onAnimIter = (e) => {
  setPhaseFromElapsed(e.elapsedTime);
};

/* ──────────────────────────────────────────────
 * 倒數邏輯：MM:SS 顯示 + 歸零後導向 /?openFeelingCalm
 * ────────────────────────────────────────────── */
const displayTime = ref("00:00");
const remainingSec = ref(0);
let countdownTimer = null;

// 格式化 MM:SS（分鐘至少 2 位）
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

// 啟動倒數（避免重複啟動）
function startCountdown() {
  if (countdownTimer) return;
  countdownTimer = setInterval(() => {
    if (remainingSec.value > 0) {
      remainingSec.value -= 1;
      displayTime.value = fmt(remainingSec.value);
    }
    if (remainingSec.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      router.replace("/?openFeelingCalm");
    }
  }, 1000);
}

// 停止倒數
function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

/* ──────────────────────────────────────────────
 * 暫停/繼續：動畫歸零 + 從頭播放、倒數停/啟
 * ────────────────────────────────────────────── */
const isPaused = ref(false);

// 把三個動畫元素「歸零並停住」
function snapAnimationsToStart() {
  const v = volcanoRef.value;
  const c = circleRef.value;
  const b = breathingBarRef.value;
  [v, c, b].forEach((el) => {
    if (!el) return;
    el.style.animation = "none";
  });
  if (v) v.style.bottom = "102px";
  if (c) c.style.transform = "translateX(-50%) scale(1)";
  if (b) b.style.width = "24px";
}

// 清除暫停時的 inline style，讓動畫從頭重新播放
function restartAnimationsFromBeginning() {
  const v = volcanoRef.value;
  const c = circleRef.value;
  const b = breathingBarRef.value;
  [v, c, b].forEach((el) => {
    if (!el) return;
    const h = el;
    h.style.removeProperty("animation");
    h.style.removeProperty("bottom");
    h.style.removeProperty("transform");
    h.style.removeProperty("width");
    void h.offsetWidth; // 強制 reflow
  });
}

function togglePause() {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    // 暫停：倒數停住、動畫歸零並停住、狀態回吸氣
    stopCountdown();
    isBreathingIn.value = false;
    snapAnimationsToStart();
  } else {
    // 繼續：動畫從頭開始、倒數繼續
    restartAnimationsFromBeginning();
    startCountdown();
  }
}

// 前置倒數（3 → 2 → 1 → 揭露 → 開始）
const showReveal = ref(true); // 是否顯示遮罩＋文案
const preSec = ref(3); // 倒數數字
const expandMask = ref(false); // 最後 1 秒啟動擴張動畫
let preTimer = null;

function startPreRoll() {
  // 讓主畫面動畫先停在第一幀
  snapAnimationsToStart();

  preTimer = setInterval(() => {
    preSec.value -= 1;

    // 剩 1 秒：放大圓洞＋文案往下消失（動畫時間 1s）
    if (preSec.value === 1) {
      expandMask.value = true;
    }

    // 結束：關閉遮罩，主畫面動畫與呼吸倒數正式開始
    if (preSec.value <= 0) {
      clearInterval(preTimer);
      preTimer = null;
      showReveal.value = false;

      // 從頭啟動主動畫、開始分鐘數倒數
      restartAnimationsFromBeginning();
      startCountdown();
    }
  }, 1000);
}

/* ──────────────────────────────────────────────
 * 生命週期：掛載/卸載
 * ────────────────────────────────────────────── */
onMounted(() => {
  if (!import.meta.client) return;
  // 設定已放鬆
  sessionStorage.setItem("isRelieved", "true");

  // 綁定動畫事件：跟著節拍切換吸/吐
  const bar = breathingBarRef.value;
  if (bar) {
    bar.addEventListener("animationiteration", onAnimIter);
    bar.addEventListener("animationstart", onAnimStart);
  }

  // 初始化倒數（無效 minutes fallback 3 分）
  const mins =
    Number.isFinite(breathingMinutes) && breathingMinutes > 0
      ? Math.floor(breathingMinutes)
      : 3;
  remainingSec.value = mins * 60;
  displayTime.value = fmt(remainingSec.value);
  startPreRoll();
});

onUnmounted(() => {
  // 倒數＆hover 計時器
  stopCountdown();
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  // 動畫事件
  const bar = breathingBarRef.value;
  if (bar) {
    bar.removeEventListener("animationiteration", onAnimIter);
    bar.removeEventListener("animationstart", onAnimStart);
  }
  if (preTimer) {
    clearInterval(preTimer);
    preTimer = null;
  }
});
</script>

<template>
  <!-- 一開始的倒數、mask 動畫 -->
  <div
    v-if="showReveal"
    class="reveal-mask | pointer-events-none absolute inset-0 z-30 bg-neutral-950"
    :class="{ 'reveal-expand': expandMask }"
  ></div>
  <!-- 標題（準備開始囉） -->
  <h3
    v-if="showReveal"
    class="pointer-events-none absolute left-1/2 top-[592px] z-40 -translate-x-1/2 text-center text-h4 font-bold text-white transition-transform duration-1000 ease-[cubic-bezier(0.6,0,0.4,1)] sm:top-[542px]"
    :class="{ 'reveal-slide': expandMask }"
  >
    準備開始囉
  </h3>
  <!-- 倒數數字（3/2/1） -->
  <p
    v-if="showReveal"
    class="pointer-events-none absolute left-1/2 top-[671px] z-40 -translate-x-1/2 text-center text-h1 font-bold text-alert-success transition-transform duration-1000 ease-[cubic-bezier(0.6,0,0.4,1)] sm:top-[621px]"
    :class="{ 'reveal-slide': expandMask }"
  >
    {{ preSec }}
  </p>
  <!-- 呼吸中內容 -->
  <section
    class="h-full origin-[50%_380px] transform-gpu bg-secondary transition-transform duration-500 ease-[cubic-bezier(0.6,0,0.4,1)] sm:-mt-14 sm:pt-14"
    :class="[expandMask ? 'scale-100' : 'scale-75']"
    @click="triggerHover"
  >
    <h1
      class="relative z-20 mb-6 py-2.5 text-center text-xl font-bold text-white opacity-0 transition"
      :class="{ 'opacity-100': isGroupHover }"
    >
      平穩呼吸法
    </h1>
    <!-- 倒數分鐘數 -->
    <p class="relative z-20 text-center text-h2 font-bold text-white">
      {{ displayTime }}
    </p>
    <main>
      <!-- 呼吸火山君 -->
      <img
        ref="volcanoRef"
        src="/images/find-peace/calm-breathe/breathing-green-volcano.webp"
        alt="呼吸綠色火山君"
        class="volcano-animation | pointer-events-none absolute bottom-[102px] left-1/2 z-10 w-full max-w-[391px] -translate-x-1/2"
      />
      <!-- 背景呼吸圓圈 -->
      <div
        ref="circleRef"
        class="breathing-circle | pointer-events-none absolute bottom-[290px] left-1/2 z-0 size-[231px] rounded-full bg-secondary-300"
      ></div>
      <!-- 漸層色塊容器 -->
      <div
        class="absolute bottom-0 z-10 h-[320px] w-full bg-gradient-to-t from-secondary from-50% to-[#5AB3D200] sm:rounded-b-[50px]"
      >
        <!-- 吸氣吐氣容器 -->
        <div
          class="absolute left-1/2 top-[131px] w-full max-w-[200px] -translate-x-1/2 text-center transition-all duration-300"
          :class="{ 'top-[46px]': isGroupHover }"
        >
          <!-- 吸氣吐氣 -->
          <div class="mb-6 h-6 rounded-full bg-white/20">
            <div
              ref="breathingBarRef"
              class="breathing-bar | mx-auto h-6 rounded-full bg-white"
            ></div>
          </div>
          <h2 class="text-h4 font-bold text-white">
            <Transition name="breath-label" mode="out-in">
              <span :key="isBreathingIn ? 'out' : 'in'">
                {{ isBreathingIn ? "吐氣" : "吸氣" }}
              </span>
            </Transition>
          </h2>
        </div>
        <!-- 暫停、停止容器 -->
        <div
          class="pointer-events-none absolute top-40 flex w-full items-center justify-center gap-8 opacity-0 transition duration-300"
          :class="{ 'pointer-events-auto opacity-100': isGroupHover }"
        >
          <img src="/icons/find-peace/calm-breathe/music.svg" alt="音樂開關" />
          <!-- 暫停按鈕 -->
          <div class="rounded-full border-[11px] border-[#C0C7DC33]">
            <button
              type="button"
              class="rounded-full bg-white p-6"
              @click="togglePause"
            >
              <img
                :src="
                  isPaused
                    ? '/icons/play-fill.svg'
                    : '/icons/find-peace/calm-breathe/pause.svg'
                "
                :alt="isPaused ? '繼續 icon' : '暫停 icon'"
                class="size-8"
              />
            </button>
          </div>
          <!-- 停止（直接結束並回到首頁） -->
          <NuxtLink to="/?openFeelingCalm">
            <img
              src="/icons/find-peace/calm-breathe/stop.svg"
              alt="停止 icon"
            />
          </NuxtLink>
        </div>
        <LayoutBottomBar
          class="absolute bottom-0 left-1/2 mb-2 mt-[27px] -translate-x-1/2"
        />
      </div>
    </main>
  </section>
</template>

<style scoped>
/* 讓自訂屬性可動畫（Chromium / Safari 皆支援；Firefox 不支援時會跳變但仍正確） */
@property --hole {
  syntax: "<length>";
  inherits: false;
  initial-value: 120px;
}

/* 遮罩：洞口定位在 50% 430px，半徑由 --hole 控制 */
.reveal-mask {
  --hole: 120px; /* 初始洞半徑 */
  -webkit-mask-image: radial-gradient(
    circle at 50% 430px,
    transparent var(--hole),
    #000 calc(var(--hole) + 1px)
  );
  mask-image: radial-gradient(
    circle at 50% 430px,
    transparent var(--hole),
    #000 calc(var(--hole) + 1px)
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  /* 洞半徑平滑放大 */
  transition: --hole 1s cubic-bezier(0.6, 0, 0.4, 1);
}

@media (min-width: 640px) {
  /* 遮罩：洞口定位在 50% 380px，半徑由 --hole 控制 */
  .reveal-mask {
    -webkit-mask-image: radial-gradient(
      circle at 50% 380px,
      transparent var(--hole),
      #000 calc(var(--hole) + 1px)
    );
    mask-image: radial-gradient(
      circle at 50% 380px,
      transparent var(--hole),
      #000 calc(var(--hole) + 1px)
    );
  }
}

/* 倒數到 1 秒時放大：把洞半徑變超大，會從自己的中心點向外擴張 */
.reveal-expand {
  --hole: 650px;
}

/* 標題與數字往下消失 */
.reveal-slide {
  transform: translate(-50%, 500px); /* Y 位移量可調 */
}

/* 火山君 */
.volcano-animation {
  animation: volcano-animation 2s infinite alternate
    cubic-bezier(0.6, 0, 0.4, 1);
}

/* 背景呼吸圓圈 */
.breathing-circle {
  animation: breathing-circle 2s infinite alternate cubic-bezier(0.6, 0, 0.4, 1);
}

/* 吸氣吐氣白色條 */
.breathing-bar {
  animation: breathing-bar 2s infinite alternate cubic-bezier(0.6, 0, 0.4, 1);
}

/* 火山君動畫 */
@keyframes volcano-animation {
  from {
    bottom: 102px;
  }
  to {
    bottom: 85px;
  }
}

/* 背景呼吸圓圈動畫 */
@keyframes breathing-circle {
  from {
    transform: translateX(-50%) scale(1);
  }
  to {
    transform: translateX(-50%) scale(5);
  }
}

/* 吸氣吐氣白色條動畫 */
@keyframes breathing-bar {
  from {
    width: 24px;
  }
  to {
    width: 100%;
  }
}

/* 吸/吐文字過渡 */
.breath-label-enter-active,
.breath-label-leave-active {
  transition: opacity 0.2s ease;
}
.breath-label-enter-from,
.breath-label-leave-to {
  opacity: 0.3;
}
.breath-label-enter-to,
.breath-label-leave-from {
  opacity: 1;
}
</style>
