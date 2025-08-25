<script setup>
const progress = ref(70);
const config = {
  cx: 50,
  cy: 52.5,
  r: 44.5,
  strokeWidth: 15,
}
const pathLength = computed(() => Math.PI * config.r);
const strokeDashoffset = computed(() => {
  const progressValue = progress.value / 100;
  return pathLength.value * (1 - progressValue);
})
const pathD = computed(() => {
  return `M ${config.cx - config.r} ${config.cy} A ${config.r} ${config.r} 0 0 1 ${config.cx + config.r} ${config.cy}`;
})
</script>
<template>
  <div class="relative flex flex-col items-center my-5">
    <svg viewBox="0 0 100 60" class="w-[252px] h-[126px]">
      <path 
      :d="pathD"
      fill="transparent"
      stroke="#44434A"
      :stroke-width="config.strokeWidth"
      stroke-linecap="round"
      />
      <path 
      :d="pathD"
      fill="transparent"
      stroke="#F15A3C"
      :stroke-width="config.strokeWidth"
      :stroke-dasharray="pathLength"
      :stroke-dashoffset="strokeDashoffset"
      stroke-linecap="round"
      class="transisiton-all duration-700"
      />
    </svg>
    <div class="absolute -bottom-2 mt-2 flex flex-col items-center">
      <span class="font-bold my-1">爆發指數</span>
      <span class="text-[28px] font-bold">{{ progress }}%</span>
    </div>
  </div>
</template>

