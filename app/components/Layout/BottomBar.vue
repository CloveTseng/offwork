<script setup>
const props = defineProps({
  /**
   * 是否是放在開啟中的 Bottom Sheet 裡面的版本（比較短，顏色也不一樣）
   * @type {Boolean}
   */
  isInBottomSheet: {
    type: Boolean,
    default: false,
  },
});
const { isInBottomSheet } = toRefs(props);
</script>

<template>
  <!-- 底部橫杠 -->
  <div
    class="mx-auto h-[5px] rounded-full"
    :class="isInBottomSheet ? 'w-20 bg-neutral-850' : 'w-[134px] bg-neutral'"
  ></div>
</template>
