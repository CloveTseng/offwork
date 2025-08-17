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
  startCountdown();
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
});
</script>

<template>
  <section
    :class="['h-full bg-secondary sm:-mt-14 sm:pt-14']"
    @click="triggerHover"
  >
    <h1
      class="relative z-10 mb-6 py-2.5 text-center text-xl font-bold text-white opacity-0 transition"
      :class="{ 'opacity-100': isGroupHover }"
    >
      平穩呼吸法
    </h1>
    <!-- 倒數分鐘數 -->
    <p class="relative z-10 text-center text-h2 font-bold text-white">
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
        class="absolute bottom-0 z-20 h-[320px] w-full bg-gradient-to-t from-secondary from-50% to-[#5AB3D200] sm:rounded-b-[50px]"
      >
        <!-- 吸氣吐氣容器 -->
        <div
          class="absolute left-1/2 top-[131px] z-20 w-full max-w-[200px] -translate-x-1/2 text-center transition-all duration-300"
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
          class="absolute top-40 flex w-full items-center justify-center gap-8 opacity-0 transition duration-300"
          :class="{ 'opacity-100': isGroupHover }"
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
/* 火山君 */
.volcano-animation {
  animation: volcano-animation 2s infinite alternate ease-in-out;
}

/* 背景呼吸圓圈 */
.breathing-circle {
  animation: breathing-circle 2s infinite alternate ease-in-out;
}

/* 吸氣吐氣白色條 */
.breathing-bar {
  animation: breathing-bar 2s infinite alternate ease-in-out;
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
