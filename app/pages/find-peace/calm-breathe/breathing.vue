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
 * ② UI 互動（行為層）：模擬 group-hover，點下畫面顯示標題、操作按鈕
 * ────────────────────────────────────────────── */
const isGroupHover = ref(false);

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
      // 導頁前先把呼吸時長寫入
      stopBreathingElapsed();
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
    // 呼吸時長：暫停
    pauseBreathingElapsed();
  } else {
    // 繼續：動畫從頭開始、倒數繼續
    restartAnimationsFromBeginning();
    startCountdown();
    // 呼吸時長：恢復
    startBreathingElapsed();
  }
}

// 遮罩中心的偏移（相對於畫面中央 50%/50%）
const revealOffsetX = ref("0px"); // 例：'16px' 或 '2vw'
const revealOffsetY = ref("0px"); // 例：'24px' 或 '10vh'

// 前置倒數（3 → 2 → 1 → 揭露 → 開始）
const showReveal = ref(true); // 是否顯示遮罩＋文案
const preSec = ref(3); // 倒數數字
const expandMask = ref(false); // 最後 1 秒啟動擴張動畫
let preTimer = null;

function startPreRoll() {
  // 若已經在跑，避免重複啟動
  if (preTimer) return;

  // 明確重置前置狀態
  preSec.value = 3;
  expandMask.value = false;
  showReveal.value = true;

  // 主畫面動畫停在第一幀
  snapAnimationsToStart();

  preTimer = setInterval(() => {
    preSec.value -= 1;

    // 剩 1 秒：標題淡出+放大圓洞＋文案往下消失（動畫時間 1s）
    if (preSec.value === 1) {
      expandMask.value = true;
    }

    // 結束：關閉遮罩，主畫面動畫與呼吸倒數正式開始
    if (preSec.value <= 0) {
      clearInterval(preTimer);
      preTimer = null;

      preSec.value = 0; // 夾住，避免負數閃爍
      showReveal.value = false;

      // 開始呼吸計時：先清零、立刻開始
      breathingAccumSec.value = 0;
      if (import.meta.client)
        sessionStorage.setItem("breathingTimeElapsed", "0");
      startBreathingElapsed();

      // 從頭啟動主動畫、開始分鐘數倒數
      restartAnimationsFromBeginning();
      startCountdown();
    }
  }, 1000);
}

// ──────────────────────────────────────────────
// 呼吸時長記錄：breathingTimeElapsed（秒）
//  - 倒數結束才開始計時
//  - 暫停時停表、恢復時續算
//  - 每秒寫入 sessionStorage，unmount 前、導頁前再補寫一次
// ──────────────────────────────────────────────
const breathingAccumSec = ref(0); // 已累積的秒數（含多次暫停/恢復）
const breathingStartMs = ref(null); // 目前這一段開始的時間戳（ms）
let breathingTimer = null; // setInterval id

function writeBreathingElapsed() {
  if (!import.meta.client) return;
  const extra = breathingStartMs.value
    ? Math.max(0, Math.floor((Date.now() - breathingStartMs.value) / 1000))
    : 0;
  const total = Math.max(0, breathingAccumSec.value + extra);
  sessionStorage.setItem("breathingTimeElapsed", String(total));
}

function startBreathingElapsed() {
  if (!import.meta.client) return;
  if (breathingStartMs.value !== null) return; // 已在跑
  breathingStartMs.value = Date.now();
  if (!breathingTimer) {
    breathingTimer = setInterval(writeBreathingElapsed, 1000);
  }
}

function pauseBreathingElapsed() {
  // 暫停用：把目前區間累加進去、停表但不清 interval（由 stop 控）
  if (breathingStartMs.value !== null) {
    breathingAccumSec.value += Math.max(
      0,
      Math.floor((Date.now() - breathingStartMs.value) / 1000),
    );
    breathingStartMs.value = null;
  }
  writeBreathingElapsed();
}

function stopBreathingElapsed() {
  // 結束用：累加 + 最後寫入 + 清 interval
  pauseBreathingElapsed();
  if (breathingTimer) {
    clearInterval(breathingTimer);
    breathingTimer = null;
  }
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
  // 停止倒數
  stopCountdown();
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
  // 最後收斂一次呼吸時長
  stopBreathingElapsed();
});
</script>

<template>
  <!-- 倒數時顯示的呼吸法標題，會隨著 expandMask 淡出 -->
  <NuxtLink
    to="/find-peace/calm-breathe"
    class="absolute top-0 z-20 block w-full py-2.5 text-center text-xl font-bold text-white transition duration-1000 sm:top-14"
    :class="{ 'pointer-events-none opacity-0': expandMask }"
  >
    <button
      type="button"
      class="absolute left-0 top-1/2 block -translate-y-1/2 py-2 pl-4 pr-2"
    >
      <img src="/icons/white-left-arrow.svg" alt="返回箭頭" />
    </button>
    平穩呼吸法
  </NuxtLink>
  <!-- 一開始的倒數、mask 動畫 -->
  <div
    v-if="showReveal"
    class="reveal-mask | pointer-events-none absolute inset-0 z-10 bg-neutral-950"
    :class="{ 'reveal-expand': expandMask }"
    :style="{ '--dx': revealOffsetX, '--dy': revealOffsetY }"
  ></div>
  <!-- 標題（永遠在洞口下方 20px） -->
  <h3
    v-if="showReveal"
    class="reveal-title pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 text-center text-h4 font-bold text-white transition-transform duration-1000 ease-[cubic-bezier(0.6,0,0.4,1)]"
    :class="{ 'reveal-slide': expandMask }"
    :style="{ '--dx': revealOffsetX, '--dy': revealOffsetY }"
  >
    準備開始囉
  </h3>
  <!-- 倒數數字（永遠在 h3 下方 20px） -->
  <p
    v-if="showReveal"
    class="reveal-count pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 text-center text-h1 font-bold text-alert-success transition-transform duration-1000 ease-[cubic-bezier(0.6,0,0.4,1)]"
    :class="{ 'reveal-slide': expandMask }"
    :style="{ '--dx': revealOffsetX, '--dy': revealOffsetY }"
  >
    {{ preSec }}
  </p>
  <!-- 呼吸中內容 -->
  <section
    class="content-origin h-full transform-gpu bg-secondary transition-transform duration-500 ease-[cubic-bezier(0.6,0,0.4,1)] sm:-mt-14 sm:pt-14"
    :class="[expandMask ? 'scale-100' : 'scale-[0.7]']"
    :style="{ '--dx': revealOffsetX, '--dy': revealOffsetY }"
    @click.self="isGroupHover = !isGroupHover"
  >
    <h1
      class="pointer-events-none relative z-10 mb-6 py-2.5 text-center text-xl font-bold text-white opacity-0 transition"
      :class="{ 'opacity-100': isGroupHover }"
    >
      平穩呼吸法
    </h1>
    <!-- 倒數分鐘數 -->
    <p
      class="pointer-events-none relative z-10 text-center text-h2 font-bold text-white"
    >
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
        class="breathing-circle | pointer-events-none absolute bottom-[290px] left-1/2 z-0 rounded-full bg-secondary-300 transition-all duration-500 ease-[cubic-bezier(0.6,0,0.4,1)]"
        :class="expandMask ? 'size-[231px]' : 'size-0'"
      ></div>
      <!-- 漸層色塊容器 -->
      <div
        class="pointer-events-none absolute bottom-0 z-10 h-[320px] w-full bg-gradient-to-t from-secondary from-50% to-[#5AB3D200] sm:rounded-b-[50px]"
      >
        <!-- 吸氣吐氣容器 -->
        <div
          class="pointer-events-none absolute left-1/2 top-[131px] w-full max-w-[200px] -translate-x-1/2 text-center transition-all duration-300"
          :class="{ 'top-[46px]': isGroupHover && expandMask }"
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
          :class="{
            'pointer-events-auto opacity-100': isGroupHover && expandMask,
          }"
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
          <NuxtLink to="/?openFeelingCalm" @click="stopBreathingElapsed()">
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

/* ===== 位置統一：以畫面中心為基準，允許偏移 =====
   --dx / --dy：洞口中心相對「畫面正中央(50%/50%)」的偏移量
   預設 0px；可在 template 的 :style 綁定自由調整。 */
.reveal-mask {
  --hole: 120px;
  --dx: 0px;
  --dy: 0px;

  -webkit-mask-image: radial-gradient(
    circle at calc(50% + var(--dx)) calc(50% + var(--dy)),
    transparent var(--hole),
    #000 calc(var(--hole) + 1px)
  );
  mask-image: radial-gradient(
    circle at calc(50% + var(--dx)) calc(50% + var(--dy)),
    transparent var(--hole),
    #000 calc(var(--hole) + 1px)
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  transition: --hole 1s cubic-bezier(0.6, 0, 0.4, 1);
}

/* 洞口擴張（你原本的數值可依需求微調） */
.reveal-expand {
  --hole: 650px;
}

/* ===== 內容縮放的原點：跟洞口中心一致 ===== */
.content-origin {
  --dx: 0px;
  --dy: 0px;
  transform-origin: calc(50% + var(--dx)) calc(50% + var(--dy));
}

/* ===== 兩段文字：永遠相對於洞口定位 ===== */
.reveal-title {
  left: calc(50% + var(--dx));
  top: calc(50% + var(--dy) + 160px);
}

.reveal-count {
  left: calc(50% + var(--dx));
  top: calc(50% + var(--dy) + 220px);
}

/* 文字的滑出動畫（保留你原來的 transform 視覺效果） */
.reveal-slide {
  transform: translate(-50%, 550px); /* 僅作離場位移，不影響定位邏輯 */
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
