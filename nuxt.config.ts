// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  runtimeConfig: {
    public: {
      BASE_URI: process.env.BASE_URI,
      IMAGE_URI: process.env.IMAGE_URI,
    },
  },
});
