import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(async params => {
  const { command, mode } = params
  const ENV = loadEnv(mode, process.cwd())
  console.log('node version', process.version)
  console.info(`running mode: ${ mode }, command: ${ command }, ENV: ${ JSON.stringify(ENV) }`)
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // additionalData: `$injectedColor: orange;`
          additionalData: '@import "@/assets/stylesheets/globalInjectedData.scss";',
        },
        // less: {
        //   modifyVars: {
        //     '@primary-color': '#1990EB',
        //     hack: `true; @import "@import "@/assets/stylesheets/globalInjectedData.less";`
        //   },
        //   javascriptEnabled: true,
        // }
      },
      // postcss: {}
    },
    plugins: [vue(), vueJsx()],
  }
})
