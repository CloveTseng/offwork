<template>
  <NuxtLink
    :to="url"
    :class="`${data ? 'cursor-pointer' : 'cursor-not-allowed'}`"
    class="border-gradient gradient-card-border block min-w-[136px] rounded-[32px] bg-[#333339] py-5 px-6 active:bg-neutral-1000"
  >
    <div>
      <div class="flex justify-between">
        <div class="flex mb-3">
          <p class="text-xl leading-[1.4] text-white font-bold">
            {{ title }}
          </p>
          <div
            v-if="isUpStandard != undefined"
            class="ms-4 flex items-center"
          >
            <div
              :class="`me-1 ${isUpStandard ? 'bg-alert-success' : 'bg-accent'} size-[10px] rounded-full`"
            ></div>
            <p
              :class="`text-sm leading-[1.6] font-bold ${isUpStandard ? 'text-alert-success' : 'text-accent'} `"
            >
              {{ isUpStandard ? "尚可" : "過多" }}
            </p>
          </div>
        </div>
        <div class="px-2 py-[6px] self-center">
          <img src="/icons/white-right-arrow.svg" alt="右箭頭"/>
        </div>
      </div>
      <div class="flex justify-between">
        <div>
          <div class="flex" v-if="data !== undefined">
            <p class="text-h5 font-bold">
              {{ data }}
            </p>
            <p class="ms-1 mt-3 text-xs">
              {{unit }}
            </p>
          </div>
          <div>
            <p class="text-[#BAB9C0] text-xs">{{ comment }}</p>
          </div>
        </div>
        <div>
          <div v-if="charts === 'doughnut'">
            <ChartsDoughnutChart />
          </div>
          <div v-else-if="charts === 'progress'">
            <ChartsProgressBar />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  title: String,
  data: Number,
  unit: String,
  comment: String,
  color: String,
  url: String,
  charts: String,
  isUpStandard: {
    type: Boolean,
    default: undefined
  }
});
</script>
