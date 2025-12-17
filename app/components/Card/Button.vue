<script setup lang="ts">
interface CardButtonProps {
  url: string;
  icon?: string;
  iconBg?: string;
  title: string;
  isUpStandard?: boolean;
  data: string | number;
  color: string;
  unit: string;
}

const props = defineProps<{ cardButton: CardButtonProps }>();
</script>

<template>
  <NuxtLink
    :to="props.cardButton.url"
    class="border-gradient gradient-card-border block min-w-[136px] rounded-2xl bg-neutral-950 p-4 active:bg-neutral-1000"
  >
    <div class="flex items-end">
      <div class="flex grow items-center">
        <div v-if="props.cardButton.icon" class="my-[3px] me-2">
          <div :class="`rounded-full ${props.cardButton.iconBg} size-12 overflow-hidden`">
            <img :src="props.cardButton.icon" alt="頭像" />
          </div>
        </div>
        <div>
          <div class="flex min-h-5 items-center">
            <p class="text-xs text-neutral-300">
              {{ props.cardButton.title }}
            </p>
            <div
              v-if="props.cardButton.isUpStandard != undefined"
              class="ms-2 flex items-baseline"
            >
              <div
                :class="`me-1 ${props.cardButton.isUpStandard ? 'bg-alert-success' : 'bg-accent'} size-2 rounded-full`"
              ></div>
              <p
                :class="`text-xs font-medium ${props.cardButton.isUpStandard ? 'text-alert-success' : 'text-accent'} `"
              >
                {{ props.cardButton.isUpStandard ? "達標" : "未達標" }}
              </p>
            </div>
          </div>
          <div class="flex">
            <p :class="`text-h5 font-bold ${props.cardButton.color}`">
              {{ props.cardButton.data }}
            </p>
            <p :class="`ms-0.5 mt-3 text-xs ${props.cardButton.color}`">
              {{ props.cardButton.unit }}
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
