<script setup>
useSeoMeta({
  title: "我的 | 健康生活 OFFWORK APP",
  ogTitle: "我的 | 健康生活 OFFWORK APP",
});
</script>

<template>
  <main class="bg-neutral-950">
    <div class="px-4 pt-4 text-white">
      <!-- 使用者區塊 -->
      <section class="mb-3 flex items-center py-4">
        <div class="me-3">
          <div class="size-[72px] rounded-full border border-primary p-1">
            <div
              class="h-full w-full overflow-hidden rounded-full bg-secondary"
            >
              <img
                src="/images/home/green-volcano.svg"
                alt="綠色火山君"
                class="mt-0.5 scale-125 object-top"
              />
            </div>
          </div>
        </div>
        <div>
          <h2 class="mb-2 text-lg font-bold">火山君</h2>
          <p class="text-xs leading-[1rem] text-neutral-300">
            2025 年 7 月加入
          </p>
        </div>
        <div class="ms-auto p-2">
          <NuxtLink to="/">
            <img src="/icons/my/setting.svg" alt="" />
          </NuxtLink>
        </div>
      </section>
      <!-- 今天做了什麼 -->
      <section class="mb-3 rounded-3xl bg-neutral-900 px-6 pb-7 pt-4">
        <div class="mb-1 flex items-center py-[9.5px]">
          <h2 class="text-lg font-bold">今天做了什麼？</h2>
          <div class="ms-auto">
            <NuxtLink to="/" class="text-sm font-bold"> 查看更多 </NuxtLink>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <CardButton
            :cardButton="{
              title: '大吼',
              data: '5',
              unit: '次以上',
              color: 'text-alert-success',
              url: '/',
            }"
          />
          <CardButton
            :cardButton="{
              title: '冥想',
              data: '0',
              unit: '次',
              color: 'text-neutral-300',
              url: '/',
            }"
          />
          <CardButton
            :cardButton="{
              title: '呼吸',
              data: '30',
              unit: '分',
              color: 'text-alert-success',
              url: '/',
              isUpStandard: true,
            }"
          />
          <CardButton
            :cardButton="{
              title: '睡眠',
              data: '6.5',
              unit: '時',
              color: 'text-accent',
              url: '/',
              isUpStandard: false,
            }"
          />
        </div>
      </section>
      <!-- 深呼吸＋好好睡 = 情緒不崩潰 -->
      <section class="mb-3 rounded-3xl bg-neutral-900 px-6 py-7">
        <div class="mb-3">
          <h2 class="mb-2 text-lg font-bold">深呼吸＋好好睡 = 情緒不崩潰</h2>
          <p class="text-xs text-neutral-300">
            呼吸是遙控器，深吸一口氣，壞心情先按暫停。 睡眠是充電器，一夜好眠，心情滿電。
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <CardButton
            :cardButton="{
              title: '呼吸',
              data: '3',
              unit: '分',
              color: 'text-alert-success',
              url: '/',
              icon: '/images/home/volcano-image-breathing.svg',
              iconBg: 'bg-secondary',
            }"
          />
          <CardButton
            :cardButton="{
              title: '睡眠',
              data: '8',
              unit: '時',
              color: 'text-alert-success',
              url: '/',
              icon: '/images/home/volcano-sleep.svg',
              iconBg: 'bg-secondary-800',
            }"
          />
        </div>
      </section>
      <!-- notify -->
      <section class="mb-4 rounded-3xl bg-neutral-900 px-6 py-7">
        <div class="mb-5 flex items-center">
          <div class="me-2">
            <img src="/icons/my/alarm-add-fill.svg" alt="通知" />
          </div>
          <p class="text-xs font-bold">通知</p>
          <NuxtLink to="/" class="ms-auto">
            <img
              src="/icons/my/arrowRight.svg"
              class="size-6 text-sm font-bold"
            />
          </NuxtLink>
        </div>
        <div class="flex items-center">
          <div class="me-2">
            <img src="/icons/my/layout-grid-fill.svg" alt="桌面小組件" />
          </div>
          <p class="text-xs font-bold">桌面小組件</p>
          <NuxtLink to="/" class="ms-auto">
            <img
              src="/icons/my/arrowRight.svg"
              class="size-6 text-sm font-bold"
            />
          </NuxtLink>
        </div>
      </section>
      <!-- nav -->
      <div class="sticky inset-x-0 bottom-2">
        <LayoutNavBar />
        <LayoutBottomBar class="mb-2 mt-[27px]" />
      </div>
    </div>
  </main>
</template>
