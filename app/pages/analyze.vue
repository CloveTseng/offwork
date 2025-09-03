<script setup>
useSeoMeta({
  title: "分析 | 健康生活 OFFWORK APP",
  ogTitle: "分析 | 健康生活 OFFWORK APP",
});
definePageMeta({
  header: {
    title: "分析",
  },
});
const analyzeData = ref([
  {
    id: 1,
    title: "大吼",
    data: 80,
    unit: "dB",
    comment: "最大分貝",
    url: "/",
    charts: "progress",
    isUpStandard:false
  },
  {
    id: 2,
    title: "心情關鍵字",
    charts: "bubble",
  },
  {
    id: 3,
    title: "睡眠",
    data: 6.5,
    unit: "小時 / 8小時",
    comment: "今日 / 目標",
    url: "#",
    charts: "doughnut",
    isUpStandard:true
  },
  {
    id:4,
    title: "呼吸",
    data: 30,
    unit: "分鐘 / 3分鐘",
    comment: "今日 / 目標",
    url: "#",
    charts: "doughnut",
    isUpStandard:true
  },
  {
    id:5,
    title: "冥想",
    comment: "尚無紀錄",
    url: "#",
  },
])
const openModal = ref(false);
</script>
<template>
  <ClientOnly>
  <main class="bg-neutral-950 px-4 ">
    <div class=" text-white grid gap-4 py-4">
      <!-- 日期及日曆 -->
      <section class="flex justify-between items-center">
        <NuxtLink to="/" class="bg-[#333339] rounded-full p-2 text-center transition">
          <img src="/icons/white-left-arrow.svg" alt="左箭頭" />
        </NuxtLink>
        <button class="bg-[#333339] rounded-full py-2 px-4 text-center" @click="openModal = true">
          <p class="text-[14px] leading-relaxed font-bold">7/17</p>
        </button>
        <NuxtLink to="#" class="bg-[#333339] rounded-full p-2 text-center">
          <img src="/icons/right-arrow.svg" alt="右箭頭" />
        </NuxtLink>
      </section>
      <CommonModal v-model:show="openModal">
        <div class="size-auto bg-[#242426]">
          <p class="text-md text-white">Demo Modal 內的文字Demo Modal 內的文字Demo Modal 內的文字Demo Modal 內的文字Demo Modal 內的文字Demo Modal 內的文字</p>
        </div>
      </CommonModal>
      <!-- 爆發指數 -->
      <section>
        <ChartsHalfCircleBar />
      </section>
      <!-- 火山君關心你 -->
      <section>
        <div class="grid grid-cols-4 pb-4 gap-2">
          <div class="size-[80px] rounded-full p-1">
            <div class="h-full w-full overflow-hidden rounded-full bg-secondary">
              <img
                src="/images/home/normal-circle.webp"
                alt="綠色火山君"
                class="scale-100 object-top"
              />
            </div>
          </div>
          <div class="bg-[#A4CD44] rounded-3xl col-span-3">
            <p class="py-4 px-5 font-medium text-[#27292B] relative before:absolute before:top-1/3 before:-translate-y-1/2 before:right-[calc(100%-2px)] before:border-b-[10px] before:border-t-[10px] before:border-r-[20px] before:border-b-transparent before:border-t-transparent before:border-r-[#A4CD44]
            ">還好嗎？你似乎壓力很大，吼一吼有沒有比較舒服啊～</p>
          </div>
        </div>
      </section>
      <!-- 分析圖卡 -->
      <template v-for="item in analyzeData" :key="item.id">
        <CardAnalyzeCard
          :title="item.title"
          :data="item.data"
          :unit="item.unit"
          :comment="item.comment"
          :url="item.url"
          :charts="item.charts"
          :isUpStandard="item.isUpStandard"
        />
      </template>
    </div>
    <!-- nav -->
    <div class="sticky inset-x-0 bottom-2">
      <LayoutNavBar />
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
  </ClientOnly>
</template>