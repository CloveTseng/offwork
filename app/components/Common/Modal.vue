<script setup lang="ts">
defineProps({
  /**
   * 是否顯示
   * @type {Boolean}
   */
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const close = () => {
  emit("update:show", false);
};
</script>

<template>
  <ClientOnly>
    <Teleport to="#app-overlay-root">
      <!-- Backdrop -->
      <Transition name="fade">
        <div
          v-if="show"
          class="absolute inset-0 z-40 bg-[#16161699]"
          :class="show ? 'pointer-events-auto' : 'pointer-events-none'"
          @click="close"
        ></div>
      </Transition>

      <!-- Modal 本體 -->
      <Transition name="fade">
        <div
          v-if="show"
          class="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          :class="show ? 'pointer-events-auto' : 'pointer-events-none'"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
