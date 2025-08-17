<script setup>
useSeoMeta({
  title: "平穩呼吸法呼吸中 | 健康生活 OFFWORK APP",
  ogTitle: "平穩呼吸法呼吸中 | 健康生活 OFFWORK APP",
});

const route = useRoute();
const router = useRouter();

// 設定的分鐘數（轉換成數字）
const breathingMinutes = Number(route.query.minutes);

// 跟著動畫切換，初始為 false（對應「吸氣」）
const isBreathingIn = ref(false);

// 取得動畫元素（白色呼吸條）
const breathingBarRef = ref(null);

// 倒數（顯示用）與秒數狀態
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

onMounted(() => {
  if (!import.meta.client) return;

  // --- 動畫節拍 → 切換吸/吐 ---
  const el = breathingBarRef.value;
  if (el) {
    const onIter = () => (isBreathingIn.value = !isBreathingIn.value);
    const onStart = () => (isBreathingIn.value = false);
    el.addEventListener("animationiteration", onIter);
    el.addEventListener("animationstart", onStart);

    onUnmounted(() => {
      el.removeEventListener("animationiteration", onIter);
      el.removeEventListener("animationstart", onStart);
    });
  }

  // --- 倒數計時 ---
  const mins =
    Number.isFinite(breathingMinutes) && breathingMinutes > 0
      ? Math.floor(breathingMinutes)
      : 3; // fallback 3 分鐘
  remainingSec.value = mins * 60;
  displayTime.value = fmt(remainingSec.value);

  countdownTimer = setInterval(() => {
    if (remainingSec.value > 0) {
      remainingSec.value -= 1;
      displayTime.value = fmt(remainingSec.value);
    }
    if (remainingSec.value <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      router.replace("/?openFeelingCalm"); // 倒數完導向
    }
  }, 1000);
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>

<template>
  <section class="group h-full bg-secondary sm:-mt-14 sm:pt-14">
    <h1
      class="relative z-10 mb-6 py-2.5 text-center text-xl font-bold text-white opacity-0 transition group-hover:opacity-100"
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
        src="/images/find-peace/calm-breathe/breathing-green-volcano.webp"
        alt="呼吸綠色火山君"
        class="volcano-animation | pointer-events-none absolute bottom-[102px] left-1/2 z-10 w-full max-w-[391px] -translate-x-1/2"
      />
      <!-- 背景呼吸圓圈 -->
      <div
        class="breathing-circle | pointer-events-none absolute bottom-[290px] left-1/2 z-0 size-[231px] rounded-full bg-secondary-300"
      ></div>
      <!-- 漸層色塊容器 -->
      <div
        class="absolute bottom-0 z-20 h-[320px] w-full bg-gradient-to-t from-secondary from-50% to-[#5AB3D200] sm:rounded-b-[50px]"
      >
        <!-- 吸氣吐氣容器 -->
        <div
          class="absolute left-1/2 top-[131px] z-20 w-full max-w-[200px] -translate-x-1/2 text-center transition-all duration-300 group-hover:top-[46px]"
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
          class="absolute top-40 flex w-full items-center justify-center gap-8 opacity-0 transition duration-300 group-hover:opacity-100"
        >
          <img src="/icons/find-peace/calm-breathe/music.svg" alt="音樂開關" />
          <!-- 暫停按鈕 -->
          <div class="rounded-full border-[11px] border-[#C0C7DC33]">
            <button
              type="button"
              class="rounded-full bg-white p-6"
              @click="pauseBreathing"
            >
              <img
                src="/icons/find-peace/calm-breathe/pause.svg"
                alt="暫停 icon"
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
