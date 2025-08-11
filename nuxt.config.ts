export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/google-fonts', '@nuxtjs/tailwindcss', 'nuxt-lottie'],

  app: {
    head: {
      title: '健康生活 OFFWORK APP',
      htmlAttrs: {
        lang: 'zh-Hant',
      },
      meta: [
        {
          name: 'description',
          content: `丟掉煩惱，讓腦袋準時下班。用 OFFWORK 啟動你的下班人生。`,
        },
        {
          property: 'og:title',
          content: '健康生活 OFFWORK APP',
        },
        {
          property: 'og:description',
          content: `丟掉煩惱，讓腦袋準時下班。用 OFFWORK 啟動你的下班人生。`,
        },
        {
          property: 'og:image',
          content: '/ogImage.webp',
        },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "zh_TW" },
        { name: "twitter:card", content: "/ogImage.webp" },
        {
          name: "twitter:image",
          content: "/ogImage.webp",
        },
      ],
    },
  },

  lottie: {
    componentName: 'Lottie',
    lottieFolder: '/assets/lottie',
  },

  googleFonts: {
    families: {
      "Noto+Sans+TC": [400, 600, 700],
      Poppins: [400],
    },
    download: true,
    inject: true,
    display: "swap",
  }
})