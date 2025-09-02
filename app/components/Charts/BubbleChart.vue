<script setup>
import { ref, onMounted } from 'vue';

const width = 255;
const height = 245;
const canvasRef = ref(null);

const bubbles = ref([
  {
    text: '老闆',
    x: 110,
    y: 112,
    radius: 57,
    color: '#A4CD44',
    textColor: '#29292D',
    fontSize: 17
  },
  {
    text: '好煩',
    x: 185,
    y: 40,
    radius: 40,
    color: '#A4CD44B2',
    textColor: '#29292D',
    fontSize: 17
  },
  {
    text: '快被氣死',
    x: 205,
    y: 175,
    radius: 48,
    color: '#A4CD44',
    textColor: '#29292D',
    fontSize: 17
  },
  {
    text: '睡不著',
    x: 70,
    y: 205,
    radius: 36,
    color: '#A4CD44B2',
    textColor: '#29292D',
    fontSize: 17
  },
  {
    text: '主管',
    x: 35,
    y: 55,
    radius: 30,
    color: '#A4CD44B2',
    textColor: '#29292D',
    fontSize: 17
  },
  {
    text: '放假',
    x: 25,
    y: 145,
    radius: 20,
    color: '#A4CD444D',
    textColor: '#29292D',
    fontSize: 13
  },
]);

const drawChart = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  bubbles.value.forEach(bubble => {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = bubble.color;
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = bubble.textColor;
    ctx.font = `bold ${bubble.fontSize}px "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bubble.text, bubble.x, bubble.y);
  });
};

onMounted(() => {
  drawChart();
});

</script>
<template>
  <div
    class="relative"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <canvas ref="canvasRef" :width="width" :height="height"></canvas>
  </div>
</template>
