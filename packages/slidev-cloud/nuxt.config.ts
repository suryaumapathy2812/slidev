import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
  ],

  css: [
    // Import Slidev styles directly from workspace
    '@slidev/client/styles/vars.css',
    '@slidev/client/styles/layouts-base.css',
    '@slidev/client/styles/code.css',
    // Cloud-specific overrides
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    preset: 'node-server',
  },

  // UnoCSS will be configured in uno.config.ts
  unocss: {
    preflight: true,
  },

  // Optimize Shiki bundling
  vite: {
    optimizeDeps: {
      include: ['shiki'],
    },
  },
})
