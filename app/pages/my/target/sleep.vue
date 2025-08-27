<script setup>
const isOpen = ref(false);
const currentMin = ref(0);
const currentHour = ref(8);
const tempMin = ref(0);
const tempHour = ref(0);
const hourScrollbar = useTemplateRef("hourRef");
const minScrollbar = useTemplateRef("minRef");

// 定位時間bar
const anchor = async () => {
  isOpen.value = true; // 先打開 BottomSheet

  await nextTick(); // 等待 DOM 更新
  const minInterval = (minScrollbar.value.scrollHeight - 152 - 59 * 4) / 60 + 4;
  const hourInterval =
    (hourScrollbar.value.scrollHeight - 152 - 23 * 4) / 24 + 4;
  // 安全訪問 ref
  if (hourScrollbar.value && minScrollbar.value) {
    tempHour.value = currentHour.value;
    tempMin.value = currentMin.value;
    hourScrollbar.value.scrollTop = hourInterval * currentHour.value;
    minScrollbar.value.scrollTop = minInterval * currentMin.value;
  }
};

const handleHourScroll = () => {
  const hourInterval =
    (hourScrollbar.value.scrollHeight - 152 - 23 * 4) / 24 + 4;
  tempHour.value = Math.floor(hourScrollbar.value.scrollTop / hourInterval);
};

const handleMinScroll = () => {
  const minInterval = (minScrollbar.value.scrollHeight - 152 - 59 * 4) / 60 + 4;
  tempMin.value = Math.floor(minScrollbar.value.scrollTop / minInterval);
};

const cancleHandler = () => {
  isOpen.value = false;
};
const submitHandler = () => {
  currentHour.value = tempHour.value;
  currentMin.value = tempMin.value;
  isOpen.value = false;
};

useSeoMeta({
  title: "我的 | 健康生活 OFFWORK APP",
  ogTitle: "我的 | 健康生活 OFFWORK APP",
});
</script>
<template>
  <section class="px-4">
    <button
      class="gradient-card-border w-full rounded-3xl bg-neutral-900 px-6 py-5"
      @click.stop="anchor"
    >
      <div class="mb-3 flex items-center justify-between gap-1">
        <div class="flex items-center text-h5 font-bold text-alert-success">
          <p>{{ currentHour }}<span class="ms-2 text-sm">時</span></p>

          <p v-if="currentMin > 0" class="ms-2 text-h5">
            {{ currentMin >= 10 ? currentMin : `0${currentMin}`
            }}<span class="ms-2 text-sm">分</span>
          </p>
        </div>
        <img
          src="/icons/my/arrow-left-s-line.svg"
          alt="睡眠"
          class="rotate-180"
        />
      </div>
      <p class="text-start text-sm text-neutral-300">睡眠時長</p>
    </button>
  </section>
  <!-- 時間設定bar -->
  <div class="sticky inset-x-0 bottom-3 mt-auto">
    <LayoutBottomBar class="mb-2 mt-[27px]" v-if="!isOpen" />
    <LayoutBottomSheet
      handleMarginBottom="mb-5"
      v-model="isOpen"
      :threshold="0.3"
      :backdrop-fade="0.6"
    >
      <div
        class="relative mx-auto flex max-h-[200px] max-w-[185px] justify-between pb-[14px] pl-4 pr-4"
      >
        <!-- 中間選中區塊 -->
        <div
          class="pointer-events-none absolute left-0 right-0 top-[calc(50%-7px)] z-20 h-[35px] -translate-y-1/2 rounded-3xl bg-[#78788014]"
        ></div>
        <!-- 時間區塊 -->
        <div class="flex w-full justify-between text-md">
          <ul
            ref="hourRef"
            @scroll="handleHourScroll"
            class="scrollbar-hide gradient-background flex snap-y flex-col gap-1 overflow-scroll py-[76px] text-[#B2B2B2]"
          >
            <li
              v-for="value in 24"
              :class="`block min-h-[34px] snap-center text-h5 font-medium ${tempHour == value - 1 ? 'text-primary' : ''}`"
            >
              {{ value - 1 >= 10 ? value - 1 : `0${value - 1}` }}
            </li>
          </ul>
          <p class="self-center text-h5 font-medium text-primary">時</p>
          <ul
            ref="minRef"
            class="scrollbar-hide gradient-background relative flex snap-y flex-col gap-1 overflow-scroll py-[76px] text-[#B2B2B2]"
            @scroll="handleMinScroll"
          >
            <li
              v-for="value in 60"
              :class="`block min-h-[34px] snap-center text-h5 font-medium ${tempMin == value - 1 ? 'text-primary' : ''}`"
            >
              {{ value - 1 >= 10 ? value - 1 : `0${value - 1}` }}
            </li>
          </ul>
          <p class="self-center text-h5 font-medium text-primary">分</p>
        </div>
      </div>
      <div class="mt-5 flex w-full gap-[10px]">
        <button
          class="w-full rounded-[100px] bg-[#F1F1F1] px-6 py-3 font-bold"
          @click="cancleHandler"
        >
          取消
        </button>
        <button
          class="w-full rounded-[100px] bg-primary px-6 py-3 font-bold"
          @click="submitHandler"
        >
          確定
        </button>
      </div>
    </LayoutBottomSheet>
  </div>
</template>

<style scoped>
.gradient-background {
  mask: linear-gradient(
    180deg,
    #b2b2b24d 0%,
    #b2b2b2 25%,
    #b2b2b2 75%,
    #b2b2b24d 100%
  );
}

.test {
  .gradient-text {
    mask: red;
  }
}
</style>
