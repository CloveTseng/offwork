<script setup>
const { notify } = defineProps(["notify"]);
const isOpen = ref(false);
const emit = defineEmits([
  "openNotifyModal",
  "switchNotify",
  "openTimeModal",
  "deleteNotify",
]);
const daysList = ref({
  sun: {
    chinese: "日",
    value: "sun",
  },
  mon: {
    chinese: "一",
    value: "mon",
  },
  the: {
    chinese: "二",
    value: "the",
  },
  wed: {
    chinese: "三",
    value: "wed",
  },
  thu: {
    chinese: "四",
    value: "thu",
  },
  fri: {
    chinese: "五",
    value: "fri",
  },
  sat: {
    chinese: "六",
    value: "sat",
  },
});
const openDetail = () => {
  notify.isOpenDetail = !notify.isOpenDetail;
};
const notifyDayContext = computed(() => {
  if (notify.days.length < 1) {
    return "未排定";
  }
  if (
    notify.days.length == 5 &&
    notify.days.every((item) =>
      ["mon", "the", "wed", "thu", "fri"].includes(item),
    )
  ) {
    return "平日";
  }
  const textList = notify.days.map((item) => {
    return daysList.value[item].chinese;
  });
  return `週${textList.join("、")}`;
});

const switchType = (type) => {
  notify.type = type;
  isOpen.value = false;
};
</script>
<template>
  <div class="gradient-card-border rounded-[32px] bg-neutral-900 pb-6 pt-5">
    <div class="px-6">
      <div
        class="flex min-h-[44px] items-center justify-between overflow-hidden"
      >
        <button
          :class="`flex items-center gap-1 text-sm font-bold text-neutral-100 ${notify.isOpenDetail ? '' : '-translate-x-6'} transition-transform duration-300`"
          @click="isOpen = true"
        >
          <span><img src="/icons/my/bookmark-fill.svg" alt="編輯" /></span
          >{{ notify.type }}
        </button>
        <button class="z-10 py-[10px]" @click="openDetail">
          <img
            src="/icons/my/arrow-down-s-line.svg"
            alt="圖示"
            :class="`size-6 ${notify.isOpenDetail ? 'rotate-180' : ''} transition-all duration-300`"
          />
        </button>
      </div>
      <div :class="`flex items-end justify-between`">
        <div class="z-10">
          <button
            class="z-20 mb-1 flex items-end gap-1 text-white"
            @click="() => $emit('openTimeModal', notify.id)"
          >
            <h2 class="text-h5 font-medium">
              {{
                `${notify.hour.toString().padStart(2, "0")}:${notify.min.toString().padStart(2, "0")}`
              }}
            </h2>
            <span class="mb-[3px] block h-fit text-xs font-normal">{{
              `${notify.isMorning ? "上午" : "下午"}`
            }}</span>
          </button>

          <p class="text-xs font-normal text-neutral-300">
            {{ notifyDayContext }}
          </p>
        </div>

        <button
          type="button"
          @click="
            () => {
              if (notify.isNotify) {
                $emit('switchNotify', false, notify.id);
              } else {
                $emit('openNotifyModal', notify.id);
              }
            }
          "
          :class="`h-8 w-14 rounded-[100px] ${notify.isNotify ? 'bg-alert-success' : 'bg-neutral-500'} relative z-10 p-[2px] transition-all duration-300 ease-in-out`"
        >
          <span
            :class="`block size-7 rounded-[100px] bg-white ${notify.isNotify ? 'translate-x-6 shadow-[0px_3px_1px_0px_#0000000F,0px_3px_8px_0px_#00000026,0px_0px_0px_1px_#0000000A]' : ''} transition-all duration-300 ease-in-out`"
          ></span>
        </button>
      </div>
    </div>

    <div
      :class="`${notify.isOpenDetail ? 'pointer-events-auto z-50 -translate-y-0 opacity-100' : 'pointer-events-none -mb-[120px] -translate-y-6 opacity-0'} mt-6 px-4 transition-all duration-300`"
    >
      <div class="mb-2 flex items-center justify-between gap-[0.5px]">
        <div
          class="relative p-1 text-xs font-normal"
          v-for="item in daysList"
          :key="`${notify.id}-${item.value}`"
        >
          <label
            :class="`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer ${notify.days.includes(item.value) ? 'text-primary' : 'text-neutral-300'}`"
            :for="`${notify.id}-${item.value}`"
            >{{ item.chinese }}</label
          >
          <input
            :id="`${notify.id}-${item.value}`"
            type="checkbox"
            :value="item.value"
            v-model="notify.days"
            :class="`block size-9 cursor-pointer appearance-none rounded-full bg-neutral-850 checked:bg-neutral-950`"
          />
        </div>
      </div>
      <button
        class="z-10 flex items-center gap-2 px-2 py-3 text-xs font-bold text-white"
        @click="() => $emit('deleteNotify', notify.id)"
      >
        <img src="/icons/my/delete-bin-fill.svg" alt="刪除" />
        刪除
      </button>
    </div>
  </div>
  <LayoutBottomSheet
    handleMarginBottom="mb-5"
    v-model="isOpen"
    :threshold="0.3"
    :backdrop-fade="0.6"
  >
    <ul>
      <li>
        <button
          :class="`block w-full rounded-xl px-6 py-4 text-center text-md font-bold ${notify.type == '下班儀式' ? 'bg-neutral-900 text-primary' : 'text-white'}`"
          @click="() => switchType('下班儀式')"
        >
          下班儀式
        </button>
      </li>
      <li>
        <button
          :class="`block w-full rounded-xl px-6 py-4 text-center text-md font-bold ${notify.type == '睡眠' ? 'bg-neutral-900 text-primary' : 'text-white'}`"
          @click="() => switchType('睡眠')"
        >
          睡眠
        </button>
      </li>
    </ul>
  </LayoutBottomSheet>
</template>
