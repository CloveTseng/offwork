<script setup>
const isOpen = ref(false);
const currentMin = ref(3);
const timeList = [1, 3, 5, 10, 15];
const changeMin = (min) => {
  currentMin.value = min;
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
      @click.stop="isOpen = true"
    >
      <div class="mb-3 flex items-center justify-between gap-1">
        <p class="text-h5 font-bold text-alert-success">
          {{ currentMin }}<span class="ms-0.5 text-sm"> 分</span>
        </p>
        <img
          src="/icons/my/arrow-left-s-line.svg"
          alt="睡眠"
          class="rotate-180"
        />
      </div>
      <p class="text-start text-sm text-neutral-300">呼吸進行時長</p>
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
      <ul class="text-md text-white">
        <li v-for="value in timeList">
          <button
            :class="`w-full rounded-xl px-6 py-4 text-center ${value == currentMin ? 'bg-neutral-900 text-primary' : ''}`"
            @click="() => changeMin(value)"
          >
            {{ value }} 分鐘
          </button>
        </li>
      </ul>
    </LayoutBottomSheet>
  </div>
</template>
