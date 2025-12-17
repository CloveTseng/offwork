<script setup lang="ts">
import { CardNotify } from "#components";

let tempId = null;
const nofityList = ref([
  {
    id: "1",
    type: "下班儀式",
    hour: "6",
    min: "0",
    isMorning: false,
    days: ["mon", "the", "wed", "thu", "fri"],
    isNotify: false,
    isOpenDetail: false,
  },
  {
    id: "2",
    type: "睡眠",
    hour: "11",
    min: "0",
    isMorning: false,
    days: ["wed", "thu", "fri"],
    isNotify: false,
    isOpenDetail: false,
  },
]);

// 路由
const router = useRouter();
// 因為睡眠目標和呼吸目標，所以直接使用上一頁
const goBack = () => {
  router.back();
};

// 刪除通知
const deleteNotify = (id) => {
  nofityList.value = nofityList.value.filter((item) => {
    return item.id != id;
  });
};
// 新增通知
const createNotify = () => {
  // 隨機創建 id
  let random = Math.floor(Math.random() * 10000);
  const newNotify = {
    id: random,
    type: "下班儀式",
    hour: "8",
    min: "0",
    isMorning: false,
    days: [],
    isNotify: true,
    isOpenDetail: true,
  };
  nofityList.value.unshift(newNotify);
  anchor(random);
};

// 通知開啟相關
const notifyModal = ref(false);
const switchNotify = (state, id = tempId) => {
  nofityList.value = nofityList.value.map((item) => {
    if (item.id == id) {
      return {
        ...item,
        isNotify: state,
      };
    }
    return { ...item };
  });
  closeNotifyModal();
};
const handleNotifyModal = (id) => {
  tempId = id;
  notifyModal.value = true;
  document.body.classList.add("overflow-hidden");
};
const closeNotifyModal = () => {
  tempId = null;
  notifyModal.value = false;
  document.body.classList.remove("overflow-hidden");
};

// 時間bar相關
// 定位時間bar
const isOpen = ref(false);
const tempMin = ref(0);
const tempHour = ref(0);
const tempIsMorning = ref(false);
const isMorningScrollbar = useTemplateRef("isMorningRef");
const anchor = async (id) => {
  isOpen.value = true; // 先打開 BottomSheet
  tempId = id;
  const tempItem = nofityList.value.filter((item) => {
    return item.id == id;
  })[0];
  tempHour.value = Number.parseInt(tempItem.hour);
  tempMin.value = Number.parseInt(tempItem.min);
  tempIsMorning.value = tempItem.isMorning ? 1 : 0;
  await nextTick(); // 等待 DOM 更新
  const isMorningInterval =
    (isMorningScrollbar.value.scrollHeight - 144 - 4) / 2 + 4;
  // 安全訪問 ref
  if (isMorningScrollbar.value) {
    isMorningScrollbar.value.scrollTop =
      isMorningInterval * (tempIsMorning.value - 1) * -1;
  }
};

const handleIsMorningScroll = () => {
  const isMorningInterval =
    (isMorningScrollbar.value.scrollHeight - 144 - 4) / 2 + 4;
  tempIsMorning.value =
    Math.round(isMorningScrollbar.value.scrollTop / isMorningInterval) < 1;
};

const cancleHandler = () => {
  tempId = null;
  isOpen.value = false;
};
const submitHandler = () => {
  let state = null;
  nofityList.value = nofityList.value.map((item) => {
    if (item.id == tempId) {
      state = item.isNotify;
      return {
        ...item,
        hour: tempHour.value,
        min: tempMin.value,
        isMorning: tempIsMorning.value,
      };
    }
    return { ...item };
  });

  isOpen.value = false;
  if (!state) {
    handleNotifyModal(tempId);
  } else {
    tempId = null;
  }
};

useSeoMeta({
  title: "我的 | 健康生活 OFFWORK APP",
  ogTitle: "我的 | 健康生活 OFFWORK APP",
});
</script>
<template>
  <main class="flex h-full flex-col">
    <!-- 功能列 -->
    <section class="flex items-center justify-between px-4 py-3">
      <button @click="goBack">
        <img src="/icons/my/arrow-left-s-line.svg" alt="返回" />
      </button>

      <h1 class="text-xl font-bold text-white">通知</h1>
      <div class="w-6"></div>
    </section>
    <!-- 通知 -->
    <section class="flex flex-col gap-4 px-4 pt-4">
      <CardNotify
        v-for="notify in nofityList"
        :key="notify.id"
        :notify="notify"
        @open-notify-modal="(id) => handleNotifyModal(id, state)"
        @switch-notify="(id, state) => switchNotify(id, state)"
        @open-time-modal="(id) => anchor(id)"
        @delete-notify="(id) => deleteNotify(id)"
      />
    </section>

    <div class="sticky inset-x-0 bottom-2 mt-auto">
      <div class="mx-auto mb-[6px] size-[52px] p-[2.36px]">
        <!-- 新增通知 -->
        <button
          class="flex h-full w-full items-center justify-center rounded-[100px] bg-primary"
          @click="createNotify"
        >
          <img
            src="/icons/my/add-large-fill.svg"
            alt="新增通知"
            class="size-[24.64px]"
          />
        </button>
      </div>
      <LayoutBottomBar class="mt-[27px]" />
      <!-- 時間設定bar -->
      <LayoutBottomSheet
        handleMarginBottom="mb-10"
        v-model="isOpen"
        :threshold="0.3"
        :backdrop-fade="0.6"
      >
        <div
          class="relative mx-auto flex max-h-[213.5px] min-h-[213.5px] max-w-[198.5px] justify-between px-5 py-[18px]"
        >
          <!-- 中間選中區塊 -->
          <div
            class="pointer-events-none absolute left-0 right-0 top-1/2 z-20 h-[35px] -translate-y-1/2 rounded-[7px] bg-[#78788014]"
          ></div>
          <!-- 時間區塊 -->
          <div class="gradient-background rotate-x-50 flex w-full text-md">
            <!-- ${tempHour - value + 1 > 0 ? 'origin-bottom' : 'origin-top'} -->
            <CommonInfiniteScroll
              :item-height="35"
              :item-counts="12"
              scroll-name="hourScroll"
              :default-value="tempHour"
              scrollStyle="text-[#B2B2B2] mr-[40px] font-normal"
              item-style="min-h-[35px] text-end"
              :is-number-format="false"
              :is-rotate="true"
              @change-value="
                (newValue) => {
                  tempHour = newValue;
                }
              "
            />
            <CommonInfiniteScroll
              :item-height="35"
              :item-counts="60"
              scroll-name="minScroll"
              :default-value="tempMin"
              scrollStyle="text-[#B2B2B2] mr-[32px] font-normal"
              item-style="min-h-[35px]"
              :is-rotate="true"
              @change-value="
                (newValue) => {
                  tempMin = newValue;
                }
              "
            />
            <ul
              ref="isMorningRef"
              class="scrollbar-hide flex snap-y flex-col gap-1 overflow-scroll py-[72px] text-[#B2B2B2]"
              @scroll="handleIsMorningScroll"
            >
              <li
                :class="`self-center text-h5 font-normal ${tempIsMorning ? 'text-primary' : ''}`"
              >
                AM
              </li>
              <li
                :class="`self-center text-h5 font-normal ${!tempIsMorning ? 'text-primary' : ''}`"
              >
                PM
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-5 flex w-full gap-[10px]">
          <button
            class="w-full rounded-[100px] bg-[#F1F1F1] px-6 py-3 font-bold"
            @click="cancleHandler"
          >
            取消
          </button>
          <button
            class="w-full rounded-[100px] bg-primary px-6 py-3 font-bold"
            @click="submitHandler"
          >
            確定
          </button>
        </div>
      </LayoutBottomSheet>
    </div>
  </main>
  <!-- 通知開啟視窗 -->
  <div
    :class="`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-neutral-950 px-4 py-5 ${notifyModal ? 'opacity-100' : 'pointer-events-none opacity-0'} min-w-[343px] rounded-2xl transition-all duration-300`"
  >
    <div class="mb-3">
      <h2 class="mb-2 text-center text-md font-medium text-white">
        要允許 Offwork 傳送通知嗎?
      </h2>
      <p class="text-center text-sm text-neutral-300">
        通知可包含提示、聲音和圖像標記
      </p>
    </div>
    <div class="mb-3 flex flex-col text-md font-bold text-neutral-950">
      <button
        @click="() => switchNotify(true)"
        class="mb-2 w-full rounded-[100px] bg-primary px-6 py-3"
      >
        允許
      </button>
      <button
        @click="() => switchNotify(false)"
        class="mb-2 w-full rounded-[100px] bg-white px-6 py-3"
      >
        現在不要
      </button>
    </div>
  </div>
  <!-- 背景遮罩 -->
  <div
    v-if="notifyModal"
    className="fixed inset-0 z-40 bg-[#161616] opacity-60"
  ></div>
</template>
<style scoped>
.gradient-background {
  mask: linear-gradient(
    180deg,
    #b2b2b24d 0%,
    #b2b2b2 25%,
    #b2b2b2 75%,
    #b2b2b24d 100%
  );
}
</style>
