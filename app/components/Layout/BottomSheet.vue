<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  hasBottomBar: { type: Boolean, default: false },
  handleMarginBottom: { type: String, default: "mb-6" },
  threshold: { type: Number, default: 0.3 }, // 拖過高度 30% 就關
  backdropFade: { type: Number, default: 0.6 }, // 拖曳時背板淡出比例
});
const emit = defineEmits(["update:modelValue", "open", "close"]);

const sheetRef = ref(null);
const handleRef = ref(null);
const backdropRef = ref(null);

const dragging = ref(false);
const startY = ref(0);
const translateY = ref(0);
const sheetHeight = ref(0);
const backdropOpacity = ref(1);

function getClientY(e) {
  // 兼容 touch / pointer
  return "touches" in e ? (e.touches?.[0]?.clientY ?? 0) : e.clientY;
}

function onDragStart(e) {
  // 滑鼠僅左鍵
  if (e.pointerType === "mouse" && e.button !== 0) return;
  const el = sheetRef.value;
  if (!el) return;

  dragging.value = true;
  startY.value = getClientY(e);
  sheetHeight.value = el.getBoundingClientRect().height;
  translateY.value = 0;

  el.style.transition = "none";
  handleRef.value?.setPointerCapture?.(e.pointerId);

  window.addEventListener("pointermove", onDragMove, { passive: false });
  window.addEventListener("pointerup", onDragEnd, { once: true });
  window.addEventListener("pointercancel", onDragEnd, { once: true });
}

function onDragMove(e) {
  if (!dragging.value) return;
  const el = sheetRef.value;
  if (!el) return;

  const y = getClientY(e);
  const dy = Math.max(0, y - startY.value); // 只允許往下
  translateY.value = dy;

  el.style.transform = `translateY(${dy}px)`;
  const progress = Math.min(1, dy / sheetHeight.value);
  backdropOpacity.value = 1 - progress * props.backdropFade;

  e.preventDefault();
}

function onDragEnd() {
  const el = sheetRef.value;
  if (!el) return;

  dragging.value = false;
  window.removeEventListener("pointermove", onDragMove);

  const thresholdPx = sheetHeight.value * props.threshold;
  if (translateY.value > thresholdPx) {
    // 超過門檻：收合 + 關閉
    if (backdropRef.value) {
      backdropRef.value.style.transition = "opacity 200ms ease-in";
      backdropOpacity.value = 0;
    }
    el.style.transition = "transform 200ms ease-in";
    el.style.transform = `translateY(${sheetHeight.value}px)`;
    const done = () => {
      el.removeEventListener("transitionend", done);
      emit("update:modelValue", false);
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
      el.style.transition = "";
      backdropOpacity.value = 1;
    };
    el.addEventListener("transitionend", back);
  }
}

function close() {
  emit("update:modelValue", false);
}
function open() {
  emit("update:modelValue", true);
}

function onKeydown(e) {
  if (e.key === "Escape") close();
}

/* ──────────────────────────────────────────────
 * 🔒 Scroll lock：開啟時鎖捲動，關閉時還原
 *  - 桌面：鎖 .app-content（你的 layout 滾動容器）
 *  - 手機：鎖 body/window（加 position:fixed 防 iOS 反彈）
 * ────────────────────────────────────────────── */
const LOCK = {
  count: 0,
  mode: null, // 'body' | 'app'
  appEl: null,
  prevAppOverflow: "",
  prevBodyOverflow: "",
  prevBodyPosition: "",
  prevBodyTop: "",
  scrollY: 0,
};

function lockScroll() {
  if (!import.meta.client) return;
  LOCK.count++;
  if (LOCK.count > 1) return; // 已被其他 BottomSheet 鎖住

  const appEl = document.querySelector(".app-content");
  const useBody = !appEl || window.matchMedia("(max-width: 639px)").matches;

  if (useBody) {
    const body = document.body;
    LOCK.mode = "body";
    LOCK.scrollY = window.scrollY;
    LOCK.prevBodyOverflow = body.style.overflow;
    LOCK.prevBodyPosition = body.style.position;
    LOCK.prevBodyTop = body.style.top;

    body.style.overflow = "hidden";
    // 防 iOS：固定視窗並記錄位移
    body.style.position = "fixed";
    body.style.top = `-${LOCK.scrollY}px`;
  } else {
    LOCK.mode = "app";
    LOCK.appEl = appEl;
    LOCK.prevAppOverflow = appEl.style.overflow;
    appEl.style.overflow = "hidden";
  }
}

function unlockScroll() {
  if (!import.meta.client) return;
  if (LOCK.count === 0) return;
  LOCK.count--;
  if (LOCK.count > 0) return; // 仍有其他 BottomSheet 在開

  if (LOCK.mode === "body") {
    const body = document.body;
    body.style.overflow = LOCK.prevBodyOverflow || "";
    body.style.position = LOCK.prevBodyPosition || "";
    body.style.top = LOCK.prevBodyTop || "";
    // 回復原本的捲動位置
    window.scrollTo({ top: LOCK.scrollY, behavior: "auto" });
  } else if (LOCK.mode === "app" && LOCK.appEl) {
    LOCK.appEl.style.overflow = LOCK.prevAppOverflow || "";
  }

  // reset
  LOCK.mode = null;
  LOCK.appEl = null;
  LOCK.prevAppOverflow = "";
  LOCK.prevBodyOverflow = "";
  LOCK.prevBodyPosition = "";
  LOCK.prevBodyTop = "";
  LOCK.scrollY = 0;
}

/* 監看開關：派發 open/close、加/移除 ESC、並鎖/解鎖捲動 */
watch(
  () => props.modelValue,
  (openNow) => {
    if (!import.meta.client) return;
    if (openNow) {
      emit("open");
      window.addEventListener("keydown", onKeydown);
      lockScroll(); // 🔒 鎖捲動
    } else {
      emit("close");
      window.removeEventListener("keydown", onKeydown);
      unlockScroll(); // 🔓 解鎖
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("keydown", onKeydown);
    // 若元件在開啟狀態下被銷毀，也要解鎖
    if (props.modelValue) unlockScroll();
  }
});

defineExpose({ open, close, sheetRef, backdropRef, handleRef });
</script>

<template>
  <!-- root 容器不定位，讓內部 absolute 仍相對父層（如 .app-content）定位 -->
  <div
    class="bottom-sheet-root"
    :class="modelValue ? 'pointer-events-auto' : 'pointer-events-none'"
  >
    <!-- Backdrop -->
    <transition name="backdrop" appear>
      <div
        v-if="modelValue"
        ref="backdropRef"
        class="backdrop-layer absolute inset-0 z-40 bg-[#16161699]"
        :style="{ '--drag': String(backdropOpacity) }"
        @click="close"
      ></div>
    </transition>

    <!-- Sheet -->
    <transition name="bottomsheets" appear>
      <nav
        v-if="modelValue"
        ref="sheetRef"
        class="absolute inset-x-0 bottom-0 z-50 block overflow-y-auto rounded-t-[32px] bg-neutral-950"
        :class="hasBottomBar ? 'px-6 pt-5' : 'px-6 pb-10 pt-5'"
        role="dialog"
        aria-modal="true"
      >
        <!-- 手把區（可拖曳） -->
        <LayoutBottomBar
          isInBottomSheet
          ref="handleRef"
          class="cursor-grab touch-none select-none active:cursor-grabbing"
          :class="handleMarginBottom"
          @pointerdown="onDragStart"
        />

        <!-- 內容插槽 -->
        <slot />
      </nav>
    </transition>
  </div>
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

/* Sheet：自下而上滑入 */
.bottomsheets-enter-active,
.bottomsheets-leave-active {
  transition: transform 0.3s ease-in;
}
.bottomsheets-enter-from,
.bottomsheets-leave-to {
  transform: translateY(100%);
}
</style>
