import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  vite: {
   "define": {
     "process.env": process.env,
   },
   vue: {
    template: {
      transformAssetUrls,
    },
  },
 },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ["@/assets/stylesheets/all.scss"],
  "components": {
   "dirs": [
     {
         "path": "~/components/global",
         "global": true
     }
   ]
  },
  build: {
    transpile: ['vuetify'],
  },
  modules:[
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  veeValidate: {
    // 啟用 auto imports
    autoImports: true,
    // 更換 components 名稱
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    }
  },
})