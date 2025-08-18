<script setup>
// 初始化 isRelieved（只在瀏覽器端、且尚未存在時）
onMounted(() => {
  if (!import.meta.client) return;
  if (sessionStorage.getItem("isRelieved") === null) {
    sessionStorage.setItem("isRelieved", "false");
  }
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
