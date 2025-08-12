<script setup>
useSeoMeta({
  title: "首頁 | 健康生活 OFFWORK APP",
  ogTitle: "首頁 | 健康生活 OFFWORK APP",
});

// 控制 Off Canvas (下班儀式) 顯示狀態
const showCeremonyNav = ref(false);
</script>

<template>
  <main class="h-full overflow-y-hidden bg-secondary pt-5">
    <!-- CTA、標題、時間 -->
    <div
      class="relative z-10 mx-auto mb-11 flex flex-col items-center gap-2 text-center text-md text-neutral"
    >
      <h2 class="font-medium">讓火山降溫，從下班開始</h2>
      <h1 class="text-h2 font-bold text-neutral-900">啟動下班人生</h1>
      <span class="flex items-center gap-1 font-medium">
        <img src="/icons/clock.svg" alt="鬧鐘 icon" />下班儀式｜下午 06:30
      </span>
    </div>
    <!-- 爆發指數 -->
    <p
      class="relative z-10 flex items-center justify-center gap-1 text-sm font-bold text-white"
    >
      <img src="/icons/light.svg" alt="白色點點" />
      爆發指數 70％
    </p>
    <!-- 火山君（會隨著爆發指數來換） -->
    <img
      src="/images/home/red-valcano.webp"
      alt="紅色火山君"
      class="absolute bottom-10 left-1/2 z-0 w-full max-w-[366px] -translate-x-1/2"
    />
    <!-- 漸層底色&導覽選單 -->
    <div
      class="absolute bottom-0 left-1/2 z-10 w-full -translate-x-1/2 rounded-b-[50px] bg-gradient-to-t from-[#49B3DD] from-40% to-[#49B3DD00] px-4 pt-2"
    >
      <!-- 下班儀式 -->
      <div
        class="mb-6 flex justify-center gap-6 text-center text-xs font-bold text-white"
      >
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="shadow-button rounded-full bg-[#33333980] p-5 backdrop-blur"
          >
            <img src="/icons/home/mood.svg" alt="紀錄心情" />
          </button>
          紀錄心情
        </div>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="shadow-button rounded-full bg-[#33333980] p-5 backdrop-blur"
            @click="showCeremonyNav = true"
          >
            <img src="/icons/home/ceremony.svg" alt="下班儀式" />
          </button>
          下班儀式
        </div>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="shadow-button rounded-full bg-[#33333980] p-5 backdrop-blur"
          >
            <img src="/icons/home/sleep.svg" alt="睡眠" />
          </button>
          睡眠
        </div>
      </div>
      <!-- 切換頁面 -->
      <LayoutNavBar />
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </div>
  </main>
  <ClientOnly>
    <!-- Backdrop：淡入淡出 -->
    <transition name="backdrop">
      <div
        v-if="showCeremonyNav"
        class="absolute inset-0 z-20 block rounded-[50px] bg-[#16161699]"
        @click="showCeremonyNav = false"
      ></div>
    </transition>
    <!-- Off Canvas：由下往上滑入 -->
    <transition name="offcanvas">
      <nav
        v-if="showCeremonyNav"
        class="absolute bottom-0 left-0 right-0 z-30 block rounded-b-[50px] rounded-t-[32px] bg-neutral-950 px-6 pt-5"
        role="dialog"
        aria-modal="true"
      >
        <LayoutBottomBar isInBottomSheet class="mb-6" />
        <!-- 標題區 -->
        <div class="mb-6 text-center">
          <h3 class="mb-2 text-xl font-bold text-white">
            下班了，也讓腦袋收工吧！
          </h3>
          <p class="text-md text-neutral-300">你現在的狀態如何呢？</p>
        </div>
        <ul class="space-y-4">
          <!-- 感覺有點煩 -->
          <li>
            <NuxtLink to="/yelling">
              <article
                class="flex items-center gap-5 rounded-[32px] bg-neutral p-5"
              >
                <img src="/images/home/eruption.webp" alt="感覺有點煩" />
                <div>
                  <h4 class="mb-1 text-md font-bold text-white">感覺有點煩</h4>
                  <p class="flex items-center gap-0.5 text-md text-neutral-300">
                    讓我吼一吼
                    <img src="/icons/right-arrow.svg" alt="右箭頭" />
                  </p>
                </div>
              </article>
            </NuxtLink>
          </li>
          <!-- 想找回平靜 -->
          <li>
            <NuxtLink to="/find-peace">
              <article
                class="flex items-center gap-5 rounded-[32px] bg-neutral p-5"
              >
                <img src="/images/home/breath.webp" alt="想找回平靜" />
                <div>
                  <h4 class="mb-1 text-md font-bold text-white">想找回平靜</h4>
                  <p class="flex items-center gap-0.5 text-md text-neutral-300">
                    來吸幾口氣
                    <img src="/icons/right-arrow.svg" alt="右箭頭" />
                  </p>
                </div>
              </article>
            </NuxtLink>
          </li>
          <!-- 先躺平，晚點再說 -->
          <li>
            <button
              type="button"
              class="w-full rounded-full bg-neutral-900 px-6 py-3 text-center text-md font-bold text-neutral-100"
              @click="showCeremonyNav = false"
            >
              先躺平，晚點再說
            </button>
          </li>
        </ul>
        <LayoutBottomBar class="mb-2 mt-[27px]" />
      </nav>
    </transition>
  </ClientOnly>
</template>

<style scoped>
/* Backdrop：淡入淡出 */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Off Canvas：自下而上滑入 */
.offcanvas-enter-active,
.offcanvas-leave-active {
  transition: transform 0.3s ease-in;
}
.offcanvas-enter-from,
.offcanvas-leave-to {
  transform: translateY(100%);
}
</style>
