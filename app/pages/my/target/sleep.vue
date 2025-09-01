<script setup>
const isOpen = ref(false);
const currentMin = ref(0);
const currentHour = ref(8);
const tempMin = ref(0);
const tempHour = ref(0);

// 定位時間bar
const anchor = async () => {
  isOpen.value = true; // 先打開 BottomSheet
  await nextTick(); // 等待 DOM 更新
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
        <div
          class="flex items-baseline gap-1 text-h5 font-bold text-alert-success"
        >
          <p>
            {{ currentHour }}
          </p>
          <p class="text-sm font-normal">時</p>
          <p v-if="currentMin > 0" class="text-h5">
            {{ currentMin >= 10 ? currentMin : `0${currentMin}` }}
          </p>
          <p v-if="currentMin > 0" class="text-sm font-normal">分</p>
        </div>
        <img
          src="/icons/my/arrow-left-s-line.svg"
          alt="睡眠"
          class="rotate-180"
        />
      </div>
      <p class="text-start text-sm font-normal text-neutral-300">睡眠時長</p>
    </button>
  </section>
  <!-- 時間設定bar -->
  <div class="sticky inset-x-0 bottom-2 mt-auto">
    <LayoutBottomBar class="mt-[27px]" v-if="!isOpen" />
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
        <div class="gradient-background flex w-full justify-between text-md">
          <CommonInfiniteScroll
            :item-height="38"
            :item-counts="24"
            scroll-name="hourScroll"
            :default-value="currentHour"
            scrollStyle="text-[#B2B2B2]"
            item-style="min-h-[38px]"
            @change-value="
              (newValue) => {
                tempHour = newValue;
              }
            "
          />
          <p class="self-center text-h5 font-medium text-primary">時</p>
          <CommonInfiniteScroll
            :item-height="38"
            :item-counts="60"
            scroll-name="hourScroll"
            :default-value="currentMin"
            scrollStyle="text-[#B2B2B2]"
            item-style="min-h-[38px]"
            @change-value="
              (newValue) => {
                tempMin = newValue;
              }
            "
          />
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
</style>
