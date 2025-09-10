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
    url: "/analysis",
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
const currentDate = ref('7/17');
const openModal = ref(false);
const chartTitle = ref('爆發指數')
</script>
<template>
  <ClientOnly>
  <main class="bg-neutral-950 px-4 ">
    <div class=" text-white grid gap-4 py-4">
      <!-- 日期及日曆 -->
      <LayoutDateNavigation :dateText="currentDate" @open-modal="openModal = true"/>
      <CommonModal v-model:show="openModal">
        <CommonCalendar />
      </CommonModal>
      <!-- 爆發指數 -->
      <section>
        <ChartsHalfCircleBar :chartTitle="chartTitle"/>
      </section>
      <!-- 火山君關心你 -->
      <section>
        <div class="grid grid-cols-4 pb-4 gap-2">
          <div class="size-[80px] rounded-full">
            <div class="h-full w-full overflow-hidden rounded-full bg-secondary">
              <img
                src="/images/home/normal-circle.webp"
                alt="綠色火山君"
                class="scale-100 object-top" loading="lazy"
              />
            </div>
          </div>
          <div class="bg-primary rounded-3xl col-span-3">
            <p class="py-4 px-5 font-medium text-[#27292B] relative 
            before:content-['']
            before:absolute
            before:top-1/3
            before:left-[-15px]
            before:-translate-y-1/2
            before:w-[20px]
            before:h-[15px]
            before:bg-[url(/images/home/triangle.svg)]
            before:bg-no-repeat
            before:bg-contain
            before:bg-center
            before:z-10
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