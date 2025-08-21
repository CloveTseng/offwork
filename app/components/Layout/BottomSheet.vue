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
  // 1 → 1 - fade；例如 fade=0.6 時，最低 0.4
  backdropOpacity.value = 1 - progress * props.backdropFade;

  e.preventDefault(); // 避免頁面捲動
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

// 監看開關：派發 open/close，加/移除 ESC 監聽
watch(
  () => props.modelValue,
  (openNow) => {
    if (!import.meta.client) return;
    if (openNow) {
      emit("open");
      window.addEventListener("keydown", onKeydown);
    } else {
      emit("close");
      window.removeEventListener("keydown", onKeydown);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("keydown", onKeydown);
  }
});

defineExpose({ open, close, sheetRef, backdropRef, handleRef });
</script>

<template>
  <ClientOnly>
    <Teleport to="#app-overlay-root">
      <!-- 外層鋪滿 app-wrapper；關閉時預設就不吃事件 -->
      <div
        class="Noto-Fonts | pointer-events-none absolute inset-0"
        :class="{ 'pointer-events-auto': modelValue }"
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
            class="absolute inset-x-0 bottom-0 z-50 overflow-y-auto rounded-t-[32px] bg-neutral-950"
            style="will-change: transform"
            :class="hasBottomBar ? 'px-6 pt-5' : 'px-6 pb-10 pt-5'"
            role="dialog"
            aria-modal="true"
          >
            <LayoutBottomBar
              isInBottomSheet
              ref="handleRef"
              class="cursor-grab touch-none select-none active:cursor-grabbing"
              :class="handleMarginBottom"
              @pointerdown="onDragStart"
            />
            <slot />
          </nav>
        </transition>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.Noto-Fonts {
  font-family: "Noto Sans TC", sans-serif;
}

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
