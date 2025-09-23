<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  }
});
const chartRef = ref(null);
let myChart = null;

const initChart = () => {
  if (chartRef.value) {
    if (myChart) {
      myChart.dispose();
    }
    myChart = echarts.init(chartRef.value);
    window.addEventListener('resize', () => {
      myChart?.resize();
    });
  }
};

const updateChart = (data) => {
  if (!myChart || !data) {
    return
  }
  const { labels, yLabels, data: chartDataArray } = data;

  const option = {
    visualMap: {
      show: false,
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['#3C3C3E', '#A4CD44']
      },
      textStyle: {
        color: '#FFFFFF'
      }
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: '#FFFFFF', align: 'center', fontSize: '11px' },
      // axisLabel: { show: false },
      splitLine: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      axisLabel: { show: true, interval: 5, color: '#fff', fontSize: '11px' },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: '大吼次數',
        type: 'heatmap',
        data: chartDataArray, 
        label: {
          show: false
        },
        itemStyle: {
          borderRadius: 4,
          borderWidth: 2,
          borderColor: '#333338'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    grid: {
      top: '10%',
      left: '5%',
      right: '0%',
      bottom: '0%',
      containLabel: false
    }
  };

  myChart.setOption(option, true);
};
onMounted(() => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);

    window.addEventListener('resize', () => {
      myChart?.resize();
    })
    updateChart(props.chartData)
  }
});

watch(() => props.chartData, (newData) => {
  updateChart(newData);
});

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
});
</script>
<template>
  <div ref="chartRef" class="w-full h-60"></div>
</template>
<style scoped>
</style>