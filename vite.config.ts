import { fileURLToPath, URL } from 'node:url'
import type { ConfigEnv, Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import visualizer from 'rollup-plugin-visualizer'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite' // node14 support
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig(async (params: ConfigEnv) => {
  const { command, mode } = params
  const ENV = loadEnv(mode, process.cwd())
  console.log('node version', process.version)
  console.info(`running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)}`)

  return {
    // https://vitejs.dev/config/#server-options
    server: {
      host: '0.0.0.0',
      disableHostCheck: true, // 解决127.0.0.1指向其他域名时出现"Invalid Host header"问题
      proxy: {
        '/api': {
          target: 'http://ip:port',
          headers: {},
          changOrigin: true, // 配置跨域
          ws: true, // 配置ws跨域
          secure: false, // https
          //loglevel: 'debug',
          rewrite: (path) => path.replace('/api', '')
        }
      }
    },
    plugins: generatePlugins(),
    resolve: {
      extensions: ['.json', '.js', '.jsx', '.ts', 'tsx', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/utils/hooks', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        '#': fileURLToPath(new URL('./types', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // additionalData: `$injectedColor: orange;`
          additionalData: '@import "@/assets/stylesheets/globalInjectedData.scss";'
        }
        // less: {
        //   modifyVars: {
        //     '@primary-color': '#1990EB',
        //     hack: `true; @import "@import "@/assets/stylesheets/globalInjectedData.less";`
        //   },
        //   javascriptEnabled: true,
        // }
      }
      // postcss: {}
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'lodash-es': ['lodash-es'],
            'element-plus': ['element-plus'],
            echarts: ['echarts', 'echarts-gl']
          }
        }
      }
    }
  }
})

function generatePlugins(): Plugin[] {
  const plugins = [
    vue(),
    vueJsx(),
    // https://github.com/antfu/unplugin-auto-import
    // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
    AutoImport({
      dts: fileURLToPath(new URL('./types/auto-imports.d.ts', import.meta.url)),
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      // imports: ['vue', '@vueuse/core'],
      imports: [
        {
          vue: ['defineComponent', 'defineAsyncComponent', 'createVNode']
        }
      ],
      // dirs: [pathResolve('./components')],
      resolvers: [ElementPlusResolver()]
    }),
    // https://github.com/antfu/unplugin-vue-components#configuration
    Components({
      dts: fileURLToPath(new URL('./types/components.d.ts', import.meta.url)),
      resolvers: [
        ElementPlusResolver({ importStyle: false }),
        IconsResolver({
          // https://github.com/sxzz/element-plus-best-practices/blob/main/src/App.vue
          enabledCollections: ['ep'], // elelemt-plus图标库， eg： <i-ep-refresh />
          alias: { svg2: 'svg-inline' },
          customCollections: ['svg', 'svg-inline']
        })
      ]
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
      customCollections: {
        // <i-svg-file-copy style="font-size: 50px; fill: red;" />
        svg: FileSystemIconLoader('src/assets/images/svg-icons'),
        'svg-inline': {
          // <i-svg-inline-foo />
          // <i-svg2-foo />
          foo: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100%" height="100%"/><circle cx="50%" cy="50%" r="50" fill="white"/></svg>`
        }
      }
    })
  ]

  if (process.env.FOR_ANALYTICS) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    )
  }
  return plugins
}
