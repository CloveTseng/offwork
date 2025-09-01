<template>
  <NuxtLink
    :to="cardButton.url"
    class="border-gradient gradient-card-border block min-w-[136px] rounded-2xl bg-neutral-950 p-4 active:bg-neutral-1000"
  >
    <div class="flex items-end">
      <div class="flex grow items-center">
        <div v-if="cardButton.icon" class="my-[3px] me-2">
          <div
            :class="`rounded-full ${cardButton.iconBg} size-12 overflow-hidden`"
          >
            <img :src="cardButton.icon" alt="頭像" />
          </div>
        </div>
        <div>
          <div class="flex min-h-5 items-center">
            <p class="text-xs text-neutral-300">
              {{ cardButton.title }}
            </p>
            <div
              v-if="cardButton.isUpStandard != undefined"
              class="ms-2 flex items-baseline"
            >
              <div
                :class="`me-1 ${cardButton.isUpStandard ? 'bg-alert-success' : 'bg-accent'} size-2 rounded-full`"
              ></div>
              <p
                :class="`text-xs font-medium ${cardButton.isUpStandard ? 'text-alert-success' : 'text-accent'} `"
              >
                {{ cardButton.isUpStandard ? "達標" : "未達標" }}
              </p>
            </div>
          </div>
          <div class="flex">
            <p :class="`text-h5 font-bold ${cardButton.color}`">
              {{ cardButton.data }}
            </p>
            <p :class="`ms-0.5 mt-3 text-xs ${cardButton.color}`">
              {{ cardButton.unit }}
            </p>
          </div>
        </div>
      </div>
      <div class="justify-end pb-0.5">
        <img src="/icons/my/arrowRight.svg" class="text-sm font-bold" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(["cardButton"]);
</script>
