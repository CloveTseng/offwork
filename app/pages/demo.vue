<script setup>
const route = useRoute();
const router = useRouter();

// 讓頁面上方顯示出標題的方式，傳入 PageMeta
definePageMeta({
  header: {
    backTo: { path: "/" },
    title: "元件展示頁面",
    right: { openParam: { openDemoBottomSheet: "true" } },
  },
});

// 控制 Modal。預設關閉就 false，預設打開就 true
const openDemoModal = ref(false);

/* —— URL ↔︎ UI 同步（Demo Bottom Sheet）—— */
const showDemoBottomSheet = ref(false);

// 判斷 URL 是否帶了 openDemoBottomSheet 參數（存在即可）
const hasDemoParam = computed(
  () => route.query.openDemoBottomSheet !== undefined,
);

// URL → UI：網址有參數就打開；移除參數就關閉
watch(hasDemoParam, (has) => {
  if (has && !showDemoBottomSheet.value) showDemoBottomSheet.value = true;
  if (!has && showDemoBottomSheet.value) showDemoBottomSheet.value = false;
});

// UI → URL：開啟時補上參數；關閉時移除參數（用 replace 保持瀏覽紀錄乾淨）
watch(showDemoBottomSheet, (open) => {
  if (!import.meta.client) return;
  const q = { ...route.query };
  if (open) {
    if (!("openDemoBottomSheet" in q)) {
      router.replace({ query: { ...q, openDemoBottomSheet: "true" } });
    }
  } else {
    if ("openDemoBottomSheet" in q) {
      delete q.openDemoBottomSheet;
      router.replace({ query: q });
    }
  }
});

// 進頁面時若本來就有參數，直接打開
onMounted(() => {
  if (hasDemoParam.value) showDemoBottomSheet.value = true;
});
</script>

<template>
  <main class="h-full space-y-6 p-5">
    <!-- 綁一個 click 事件去控制布林值 -->
    <button
      type="button"
      class="w-full rounded-full bg-alert-success py-3 text-center text-md font-bold text-neutral-950"
      @click="openDemoModal = true"
    >
      打開 Modal
    </button>
    <!-- 
    用 v-model:show 來控制 Modal 的開關狀態。
    Modal 本體的內容則透過元件內的 slot 來傳入，所以外層這邊可以放自己想要的東西。
    -->
    <CommonModal v-model:show="openDemoModal">
      <div class="size-40 bg-white">
        <p class="text-md">Demo Modal 內的文字字字字</p>
      </div>
    </CommonModal>
    <button
      type="button"
      class="w-full rounded-full bg-alert-success py-3 text-center text-md font-bold text-neutral-950"
      @click="showDemoBottomSheet = true"
    >
      打開 Bottom Sheet
    </button>
    <!-- Demo Bottom Sheet：用上面的 showDemoBottomSheet 控制 -->
    <LayoutBottomSheet
      v-model="showDemoBottomSheet"
      hasBottomBar
      :threshold="0.3"
      :backdrop-fade="0.6"
    >
      <p class="text-white">
        這是 Demo Bottom Sheet。<br />
        點標題列右側按鈕（layout 代為注入 query） → URL 出現
        <code>?openDemoBottomSheet=true</code> → 這裡自動打開。 關閉時會自動從
        URL 移除該參數。
      </p>
      <LayoutBottomBar class="mb-2 mt-[27px]" />
    </LayoutBottomSheet>
  </main>
</template>
