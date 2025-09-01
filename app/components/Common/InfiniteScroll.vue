<script setup>
const props = defineProps({
  itemHeight: { type: Number, required: true },
  scrollName: { type: String, required: true },
  itemCounts: { type: Number, required: true },
  defaultValue: { type: Number, default: 0 },
  scrollStyle: String,
  itemStyle: String,
});
const emit = defineEmits(["changeValue"]);
const tempValue = ref(0);
const scrollbar = useTemplateRef("scroll");
// 定位
function anchor() {
  // 滾動區所有的元素數量
  const itemCount = scrollbar.value.childElementCount;
  // 可視範圍的高度
  const viewHeight = scrollbar.value.clientHeight;
  const interval = props.itemHeight;
  // (可視範圍的高度/元素區間高度)顯示區會有n個數
  const viewItemCount = viewHeight / interval;
  if (props.defaultValue <= Math.round(viewItemCount / 2)) {
    scrollbar.value.scrollTop =
      (itemCount / 3 + props.defaultValue - 2) * interval;
  } else {
    scrollbar.value.scrollTop = (props.defaultValue - 2) * interval;
  }
}
function handleHourScroll() {
  // 當前滾動區頂端位置
  const top = scrollbar.value.scrollTop;
  // 元素區間高度 = 整個滾動區的高度 / 滾動區的元素數量
  const interval = props.itemHeight;

  // 滾動區所有的元素數量
  const itemCount = scrollbar.value.childElementCount;
  // 整個滾動區的高度
  const scrollHeight = interval * itemCount;
  // 可視範圍的高度
  const viewHeight = scrollbar.value.clientHeight;
  const viewItemCount = Math.floor(viewHeight / interval);
  if (top <= 0) {
    console.log("跳轉到第二組");
    scrollbar.value.scrollTop = scrollHeight / 3 + top;
  }
  if (scrollHeight - top - viewHeight <= 0) {
    console.log("跳轉到第二組");
    scrollbar.value.scrollTop = top - (itemCount / 3) * 2 * interval;
  }
  tempValue.value = Math.floor(
    (top / interval + viewItemCount / 2) % (itemCount / 3),
  );
  emit("changeValue", tempValue.value);
}
onMounted(() => {
  anchor();
});
</script>
<template>
  <ul
    :ref="'scroll'"
    @scroll="handleHourScroll"
    :class="`scrollbar-hide flex snap-y flex-col overflow-scroll ${scrollStyle}`"
  >
    <li
      v-for="value in itemCounts"
      :key="`1-${value}`"
      :class="`flex ${itemStyle} snap-center items-center justify-center text-h5 font-medium ${tempValue == value - 1 ? 'text-primary' : ''}`"
    >
      {{ value - 1 >= 10 ? value - 1 : `0${value - 1}` }}
    </li>
    <li
      v-for="value in itemCounts"
      :key="`2-${value}`"
      :class="`flex snap-center ${itemStyle} items-center justify-center text-h5 font-medium ${tempValue == value - 1 ? 'text-primary' : ''}`"
    >
      {{ value - 1 >= 10 ? value - 1 : `0${value - 1}` }}
    </li>
    <li
      v-for="value in itemCounts"
      :key="`3-${value}`"
      :class="`flex snap-center ${itemStyle} items-center justify-center text-h5 font-medium ${tempValue == value - 1 ? 'text-primary' : ''}`"
    >
      {{ value - 1 >= 10 ? value - 1 : `0${value - 1}` }}
    </li>
  </ul>
</template>
