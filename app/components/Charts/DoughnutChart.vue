<template>
  <div class="relative w-[60px] h-[60px]">
    <canvas ref="canvasRef" class="absolute inset-0"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  percentage: {
    type: Number,
    default: 75,
    validator: (value: number) => value >= 0 && value <= 100
  },
  ringColor: {
    type: String,
    default: '#95C533'
  },
  backgroundColor: {
    type: String,
    default: '#44434A'
  },
  ringWidth: {
    type: Number,
    default: 10
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

const drawRing = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const size = 60
  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  const centerX = size / 2
  const centerY = size / 2
  const radius = (size / 2) - (props.ringWidth / 2)
  const startAngle = 0
  const endAngle = startAngle + (2 * Math.PI) * (props.percentage / 100)

  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#A3CC444D')
  gradient.addColorStop(1, '#A4CD44')

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.lineWidth = props.ringWidth
  ctx.strokeStyle = props.backgroundColor
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, endAngle)
  ctx.lineWidth = props.ringWidth
  ctx.strokeStyle = gradient;
  ctx.lineCap = 'round'
  ctx.stroke()
}

onMounted(() => {
  drawRing()
})
</script>
