<script setup lang="ts">
import { ChartsBubbleChart, ChartsDoughnutChart, ChartsProgressBar } from '#components';
import { shallowRef, watch, type Component } from 'vue';

type ChartTypeKey = 'doughnut' | 'progress' | 'bubble';

const props = withDefaults(
  defineProps<{
    title: string;
    data?: number;
    unit?: string;
    comment?: string;
    color?: string;
    url?: string;
    charts?: ChartTypeKey;
    isUpStandard?: boolean;
  }>(),
  {
    data: undefined,
    unit: '',
    comment: '',
    color: '',
    url: '',
    charts: undefined,
    isUpStandard: undefined
  }
);

const chartTypes: Record<ChartTypeKey, Component> = {
  doughnut: ChartsDoughnutChart,
  progress: ChartsProgressBar,
  bubble: ChartsBubbleChart
};

const currentChartType = shallowRef<Component | null>(null);

watch(
  () => props.charts,
  (newChartType) => {
    currentChartType.value = newChartType ? chartTypes[newChartType] ?? null : null;
  },
  { immediate: true }
);
</script>

<template>
  <NuxtLink
    :to="data ? url : ''"
    :class="{ 'pointer-events-none': !data }"
    class="border-gradient gradient-card-border block min-w-[136px] rounded-[32px] bg-neutral-900 py-5 px-6 active:bg-neutral-1000"
    @click.prevent="!data"
  >
    <div>
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center">
          <p class="text-xl font-bold text-white">
            {{ title }}
          </p>
          <div v-if="isUpStandard != null" class="ms-4 flex items-center">
            <div :class="`me-1 ${isUpStandard ? 'bg-alert-success' : 'bg-accent'} size-[10px] rounded-full`"></div>
            <p :class="`text-sm font-bold leading-[1.6] ${isUpStandard ? 'text-alert-success' : 'text-accent'}`">
              {{ isUpStandard ? '尚可' : '過多' }}
            </p>
          </div>
        </div>
        <div v-if="url" class="self-center px-2 py-[6px]">
          <img src="/icons/white-right-arrow.svg" alt="右箭頭" />
        </div>
      </div>
      <div :class="['flex', comment ? 'justify-between' : 'justify-center']">
        <div>
          <div v-if="data !== undefined" class="flex">
            <p class="text-h5 font-bold">
              {{ data }}
            </p>
            <p class="ms-1 mt-3 text-xs">
              {{ unit }}
            </p>
          </div>
          <div>
            <p class="text-xs text-neutral-300">{{ comment }}</p>
          </div>
        </div>
        <div>
          <component :is="currentChartType" v-if="currentChartType" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
