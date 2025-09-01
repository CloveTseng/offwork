<template>
  <NuxtLink
    :to="url"
    class="border-gradient gradient-card-border block min-w-[136px] rounded-2xl bg-[#333339] p-4 active:bg-neutral-1000"
  >
    <div class="flex">
      <div class="flex grow items-center">
        <!-- <div v-if="cardButton.icon" class="my-[3px] me-2">
          <div
            :class="`rounded-full ${cardButton.iconBg} size-12 overflow-hidden`"
          >
            <img :src="cardButton.icon" alt="頭像" />
          </div>
        </div> -->
        <div>
          <div>
            <div class="flex">
              <p class="min-h-5 text-xs leading-[1rem] text-neutral-300">
                {{ title }}
              </p>
              <div
                v-if="analyzeCard.isUpStandard != undefined"
                class="ms-2 flex items-center"
              >
                <div
                  :class="`me-1 ${analyzeCard.isUpStandard ? 'bg-alert-success' : 'bg-accent'} size-2 rounded-full`"
                ></div>
                <p
                  :class="`text-xs font-medium ${analyzeCard.isUpStandard ? 'text-alert-success' : 'text-accent'} `"
                >
                  {{ analyzeCard.isUpStandard ? "尚可" : "過多" }}
                </p>
              </div>
            </div>
            <div class="flex">
              <p :class="`text-h5 font-bold ${analyzeCard.color}`">
                {{ analyzeCard.data }}
              </p>
              <p :class="`ms-0.5 mt-3 text-xs ${analyzeCard.color}`">
                {{ analyzeCard.unit }}
              </p>
            </div>
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
const props = defineProps({
  title: String,
  data: Number,
  unit: String,
  comment: String,
  color: String,
  url: String,
  charts: String,
  isUpStandard: Boolean
});
</script>
