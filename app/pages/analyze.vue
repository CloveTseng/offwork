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
</script>
<template>
  <main class="bg-neutral-950 px-4 ">
    <div class=" text-white grid gap-4 py-4">
      <!-- 日期及日曆 -->
      <section class="flex justify-between items-center">
        <NuxtLink to="/" class="bg-[#333339] rounded-full p-2 text-center transition">
          <img src="/icons/white-left-arrow.svg" alt="左箭頭" />
        </NuxtLink>
        <div class="bg-[#333339] rounded-full py-2 px-4 text-center">
          <p class="text-[14px] leading-relaxed font-bold">7/17</p>
        </div>
        <NuxtLink to="#" class="bg-[#333339] rounded-full p-2 text-center">
          <img src="/icons/right-arrow.svg" alt="左箭頭" />
        </NuxtLink>
      </section>
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
      <!-- 大吼分析 -->
      <NuxtLink
        to="/"
        class="gradient-border-1px rounded-[32px]"
      >
        <article
          class="rounded-[32px] bg-neutral-900 p-5"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <h2 class="text-md font-bold text-white">大吼</h2>
              <p class="">過多</p>
            </div>
            <img src="/icons/right-arrow.svg" alt="左箭頭" />
          </div>
        </article>
      </NuxtLink>
    </div>
    <!-- nav -->
    <div class="sticky inset-x-0 bottom-2">
      <LayoutNavBar />
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
</template>