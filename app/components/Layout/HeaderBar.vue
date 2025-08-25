<script setup>
const props = defineProps({
  backTo: { type: [String, Object], default: null },
  title: { type: String, required: true },
});

const emit = defineEmits(["right"]);

// 有綁 @right 才顯示按鈕
const i = getCurrentInstance();
const showRight = computed(() => {
  const vp = i?.vnode?.props || {};
  return !!(vp.onRight || vp.onright); // 有綁 @right 才顯示
});
</script>

<template>
  <h1 class="relative py-2.5 text-center text-xl font-bold">
    <NuxtLink
      v-if="backTo"
      :to="backTo"
      class="absolute left-0 top-1/2 -translate-y-1/2 py-2 pl-4 pr-2"
      aria-label="返回上一頁"
    >
      <img src="/icons/white-left-arrow.svg" alt="返回 icon" />
    </NuxtLink>

    {{ title }}

    <button
      v-if="showRight"
      type="button"
      class="absolute right-0 top-1/2 -translate-y-1/2 py-2 pl-2 pr-4"
      @click="emit('right')"
      aria-label="右側按鈕動作"
    >
      <img src="/icons/open-bottom-sheet.svg" alt="開啟 Bottom Sheet" />
    </button>
  </h1>
</template>
