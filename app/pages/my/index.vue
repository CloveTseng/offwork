<script setup>
useSeoMeta({
  title: "我的 | 健康生活 OFFWORK APP",
  ogTitle: "我的 | 健康生活 OFFWORK APP",
});
const nav = useTemplateRef("nav");
const haveData = ref(false);
const isIntersecting = ref(true);
const showCeremonyNav = ref(false);
let observer = null;
// 因為需要觀察火山君自我介紹頁面是否離開視線
// IntersectionObserver(callback,[option])
const createObserver = () => {
  return new IntersectionObserver((entries) => {
    isIntersecting.value = entries[0].isIntersecting;
  });
};
onMounted(() => {
  observer = createObserver();
  observer.observe(nav.value);
  console.log("建立監聽火山君物件");
  if (import.meta.client) {
    haveData.value = sessionStorage.getItem("isRelieved") == "true";
  }
});
onUnmounted(() => {
  observer.disconnect();
  console.log("卸除火山君物件");
});
</script>
<!-- <div class="w-6"></div>
<h1 class="text-xl font-bold text-white">我的</h1> -->
<template>
  <main class="bg-neutral-950">
    <div class="px-4 pt-4 text-white">
      <!-- 使用者區塊 -->
      <!-- 如果使用 fixed 會黏到整個頁面，套用手機框框時會飛走，所以要用 sticky -->
      <!-- 使用 sticky 會佔據實際大小所以用負值 margin 讓他不佔空間 -->
      <!-- 使用 opacity 讓出現有效果感覺，不像使用 hidden 和 block -->
      <!-- sm:top-[56px] 是防止 sticky 時會黏到手機上邊時間電量那邊 -->

      <section
        :class="`${isIntersecting ? 'pointer-events-none opacity-0' : 'opacity-100'} sticky inset-x-0 top-0 z-50 -mb-[48px] flex min-h-[48px] items-center justify-between bg-neutral-950 transition-all duration-150 ease-linear sm:top-[56px]`"
      >
        <div class="size-6 py-2 pr-2"></div>
        <p>我的</p>
        <div class="py-2 pl-2">
          <NuxtLink to="/">
            <img src="/icons/my/setting.svg" alt="設定按鈕" />
          </NuxtLink>
        </div>
      </section>
      <section :class="`mb-3 flex items-center bg-neutral-950 py-4`">
        <div ref="nav" :class="`flex items-center`">
          <div class="me-3">
            <div class="size-[72px] rounded-full border border-primary p-1">
              <div class="h-full w-full overflow-hidden rounded-full">
                <img src="/images/home/normal-circle.webp" alt="綠色火山君" />
              </div>
            </div>
          </div>
          <div class="">
            <h2 class="mb-2 text-lg font-bold">火山君</h2>
            <p class="text-xs leading-[1rem] text-neutral-300">
              2025 年 7 月加入
            </p>
          </div>
        </div>

        <div class="ms-auto p-2">
          <NuxtLink to="/">
            <img src="/icons/my/setting.svg" alt="設定按鈕" />
          </NuxtLink>
        </div>
      </section>

      <!-- 今天做了什麼 -->

      <section
        v-if="haveData"
        class="mb-3 rounded-3xl bg-neutral-900 px-6 pb-7 pt-4"
      >
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
      <button
        v-else
        class="gradient-card-border relative mb-3 w-full overflow-hidden rounded-3xl bg-neutral px-6 py-[25.5px] text-start"
        @click="showCeremonyNav = true"
      >
        <div class="max-w-[207px]">
          <h1 class="mb-1 text-lg font-bold text-alert-success">
            開始下班儀式
          </h1>
          <p class="text-xs text-neutral-300">
            電腦要關機才不會當機，大腦也要下班才不會炸裂。
          </p>
        </div>
        <div class="absolute -right-[39.49px] -top-5 z-10 w-[182.49px]">
          <img
            src="/images/home/green-volcano.webp"
            alt="火山軍"
            class="mask-alpha"
          />
        </div>
      </button>
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
              url: '/my/target/breath',
              icon: '/images/home/feeling-calm.webp',
              iconBg: 'bg-secondary',
            }"
          />
          <CardButton
            :cardButton="{
              title: '睡眠',
              data: '8',
              unit: '時',
              color: 'text-alert-success',
              url: '/my/target/sleep',
              icon: '/images/home/sleep-circle.webp',
              iconBg: 'bg-secondary-800',
            }"
          />
        </div>
      </section>
      <!-- notify -->
      <section class="mb-3 rounded-3xl bg-neutral-900 px-6 py-7">
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
        <!-- 下班了，也讓腦袋收工吧！ -->
        <LayoutBottomSheet
          v-model="showCeremonyNav"
          hasBottomBar
          :threshold="0.3"
          :backdrop-fade="0.6"
        >
          <div class="mb-6 text-center">
            <h3 class="mb-2 text-xl font-bold text-white">
              下班了，也讓腦袋收工吧！
            </h3>
            <p class="text-md text-neutral-300">你現在的狀態如何呢？</p>
          </div>
          <ul class="space-y-4">
            <li>
              <NuxtLink
                to="/yelling"
                class="gradient-card-border rounded-[32px]"
              >
                <article
                  class="flex items-center gap-5 rounded-[32px] bg-neutral p-5"
                >
                  <img
                    src="/images/home/eruption.webp"
                    alt="感覺有點煩"
                    class="w-[120px]"
                  />
                  <div>
                    <h4 class="mb-1 text-md font-bold text-white">
                      感覺有點煩
                    </h4>
                    <p
                      class="flex items-center gap-0.5 text-md text-neutral-300"
                    >
                      讓我吼一吼
                      <img src="/icons/right-arrow.svg" alt="右箭頭" />
                    </p>
                  </div>
                </article>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/find-peace"
                class="gradient-card-border rounded-[32px]"
              >
                <article
                  class="flex items-center gap-5 rounded-[32px] bg-neutral p-5"
                >
                  <img
                    src="/images/home/breath.webp"
                    alt="想找回平靜"
                    class="w-[120px]"
                  />
                  <div>
                    <h4 class="mb-1 text-md font-bold text-white">
                      想找回平靜
                    </h4>
                    <p
                      class="flex items-center gap-0.5 text-md text-neutral-300"
                    >
                      來吸幾口氣
                      <img src="/icons/right-arrow.svg" alt="右箭頭" />
                    </p>
                  </div>
                </article>
              </NuxtLink>
            </li>
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
        </LayoutBottomSheet>
      </div>
    </div>
  </main>
</template>
