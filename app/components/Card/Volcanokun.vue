<script setup>
const textContent = '還好嗎？你似乎壓力很大，吼一吼有沒有比較舒服啊～';
</script>
<template>
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
      "><span v-for="(char, index) in textContent" :key="index">{{ char }}</span></p>
    </div>
  </div>
</section>
</template>
<style scoped>
</style>