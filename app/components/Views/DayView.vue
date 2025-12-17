<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  }
});
const chartRef = ref(null);
let myChart = null;

const initChart = () => {
  if (!myChart && chartRef.value) {
    myChart = echarts.init(chartRef.value);
  }
};

const setChartOption = (data) => {
  if (myChart) {
    // 這裡放置你的 ECharts 熱力圖配置
    const option = {
      // 顏色設定
      visualMap: {
        min: 0,
        max: 10, // 根據你的最大值調整
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
          color: ['#FFFFFF', '#45A548'] // 顏色由淺到深
        }
      },
      // X 軸（小時）
      xAxis: {
        type: 'category',
        data: Array.from({ length: 24 }, (_, i) => `${i}`),
      },
      // Y 軸（星期幾，這裡先用簡單的範例）
      yAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      // 核心資料
      series: [
        {
          name: '大吼次數',
          type: 'heatmap',
          data: data,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  }
};

onMounted(() => {
  initChart();
  // 監聽視窗大小改變
  window.addEventListener('resize', () => {
    myChart?.resize();
  });
});

onUnmounted(() => {
  // 元件銷毀時釋放資源
  if (myChart) {
    myChart.dispose();
  }
});

// 使用 watch 監聽 props.chartData 的變化，動態更新圖表
watch(() => props.chartData, (newData) => {
  if (newData.length > 0) {
    setChartOption(newData);
  }
}, { immediate: true });
</script>
<template>
  <div ref="chartRef" class="w-full h-64"></div>
</template>
<style scoped>
</style>