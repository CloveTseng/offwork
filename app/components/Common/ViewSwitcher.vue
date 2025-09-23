<script setup>
const props = defineProps({
  views: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['update:view'])
const activeViewKey = ref(props.views[0].key)
const setActiveView = (key) => {
  activeViewKey.value = key
  emits('update:view', key)
}
</script>
<template>
  <section class="rounded-full bg-neutral-900 p-1 mx-4">
    <ul class="grid grid-cols-4">
      <li v-for="view in views" :key="view.key"
      class="font-md font-bold text-center py-1 rounded-full cursor-pointer transition duration-300 ease-in-out" 
      :class="{'text-white rounded-full bg-neutral' : view.key === activeViewKey, 'text-neutral-500' : view.key !== activeViewKey}"
      @click="setActiveView(view.key)"
      >{{ view.label }}</li>
    </ul>
  </section>
</template>
<style scoped>
</style>