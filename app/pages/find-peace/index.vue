<script setup>
useSeoMeta({
  title: "找回平靜 | 健康生活 OFFWORK APP",
  ogTitle: "找回平靜 | 健康生活 OFFWORK APP",
});
</script>

<template>
  <h1
    class="sticky top-0 bg-[#29292DCC] py-2.5 text-center text-xl font-bold text-white backdrop-blur-lg sm:top-14"
  >
    <NuxtLink
      :to="{ path: '/', query: { openCeremony: 'true' } }"
      class="absolute left-0 top-1/2 block -translate-y-1/2 py-2 pl-4 pr-2"
    >
      <img src="/icons/white-left-arrow.svg" alt="返回箭頭" />
    </NuxtLink>
    找回平靜
  </h1>
  <main class="bg-neutral-950 px-4 pt-4">
    <!-- Tab -->
    <nav
      class="mb-4 grid grid-cols-2 rounded-full bg-neutral-900 p-1 text-center"
    >
      <!-- 呼吸 -->
      <NuxtLink
        to="/find-peace"
        class="rounded-full text-md font-bold transition hover:text-white"
        :class="
          $route.path === '/find-peace'
            ? 'bg-neutral text-white shadow-tab'
            : 'bg-transparent text-neutral-500'
        "
        >呼吸
      </NuxtLink>
      <!-- 冥想（沒有頁面純裝飾） -->
      <NuxtLink
        to="#"
        class="rounded-full text-md font-bold transition hover:text-white"
        :class="
          $route.path === '#'
            ? 'bg-neutral text-white shadow-tab'
            : 'bg-transparent text-neutral-500'
        "
        >冥想
      </NuxtLink>
    </nav>
    <!-- 各種呼吸法連結 -->
    <nav>
      <ul class="space-y-4">
        <!-- 平穩呼吸法 -->
        <li>
          <NuxtLink to="/find-peace/calm-breathe" class="gradient-border-1px">
            <article
              class="flex items-center gap-5 rounded-[32px] bg-neutral-900 p-5"
            >
              <img
                src="/images/find-peace/breathe1.webp"
                alt="平穩呼吸法"
                class="w-[120px]"
              />
              <div>
                <h2 class="mb-1 text-md font-bold text-white">平穩呼吸法</h2>
                <p class="text-md text-neutral-300">
                  慢慢吸，輕輕吐，讓節奏帶你回到平靜。
                </p>
              </div>
            </article>
          </NuxtLink>
        </li>
        <!-- 腹式呼吸法（沒有頁面純裝飾） -->
        <li>
          <NuxtLink to="/find-peace/calm-breathe" class="gradient-border-1px">
            <article
              class="flex items-center gap-5 rounded-[32px] bg-neutral-900 p-5"
            >
              <img
                src="/images/find-peace/breathe2.webp"
                alt="腹式呼吸法"
                class="w-[120px]"
              />
              <div>
                <h2 class="mb-1 text-md font-bold text-white">腹式呼吸法</h2>
                <p class="text-md text-neutral-300">
                  感受腹部起伏，深呼吸讓身體鬆開一點。
                </p>
              </div>
            </article>
          </NuxtLink>
        </li>
        <!-- 4-7-8 呼吸（沒有頁面純裝飾） -->
        <li>
          <NuxtLink to="/find-peace/calm-breathe" class="gradient-border-1px">
            <article
              class="flex items-center gap-5 rounded-[32px] bg-neutral-900 p-5"
            >
              <img
                src="/images/find-peace/breathe3.webp"
                alt="4-7-8 呼吸"
                class="w-[120px]"
              />
              <div>
                <h2 class="mb-1 text-md font-bold text-white">4-7-8 呼吸</h2>
                <p class="text-md text-neutral-300">
                  吸 4 秒，憋氣 7 秒，吐氣 8 秒，進入休息。
                </p>
              </div>
            </article>
          </NuxtLink>
        </li>
        <!-- 4-4-4 方格呼吸（沒有頁面純裝飾） -->
        <li>
          <NuxtLink to="/find-peace/calm-breathe" class="gradient-border-1px">
            <article
              class="flex items-center gap-5 rounded-[32px] bg-neutral-900 p-5"
            >
              <img
                src="/images/find-peace/breathe4.webp"
                alt="4-4-4 方格呼吸"
                class="w-[120px]"
              />
              <div>
                <h2 class="mb-1 text-md font-bold text-white">
                  4-4-4 方格呼吸
                </h2>
                <p class="text-md text-neutral-300">
                  用呼吸畫出方形，節奏讓心穩定下來。
                </p>
              </div>
            </article>
          </NuxtLink>
        </li>
        <!-- 平穩呼吸法 -->
        <li>
          <NuxtLink to="/find-peace/calm-breathe" class="gradient-border-1px">
            <article
              class="flex items-center gap-5 rounded-[32px] bg-neutral-900 p-5"
            >
              <img
                src="/images/find-peace/breathe1.webp"
                alt="平穩呼吸法"
                class="w-[120px]"
              />
              <div>
                <h2 class="mb-1 text-md font-bold text-white">平穩呼吸法</h2>
                <p class="text-md text-neutral-300">
                  慢慢吸，輕輕吐，讓節奏帶你回到平靜。
                </p>
              </div>
            </article>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="sticky bottom-0 pb-2 pt-[27px]">
      <LayoutBottomBar />
    </div>
  </main>
</template>
