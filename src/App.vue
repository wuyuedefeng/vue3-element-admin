<script lang="tsx" setup>
import { provide } from 'vue'
import { useAppStore } from './stores/app'
import DefaultLayout from '@/components/layouts/Default/index.vue'
// @ts-ignore
import zhCN from 'element-plus/dist/locale/zh-cn.mjs'

const appStore = useAppStore()
const configProvider = {
  locale: zhCN
}

provide('configProvider', configProvider)
</script>

<template>
  <el-config-provider :locale="configProvider.locale">
    <DefaultLayout>
      <header>
        <img
          alt="Vue logo"
          class="logo"
          src="@/assets/images/svg-icons/vue.svg"
          width="125"
          height="125"
        />
        <div class="wrapper flex">
          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </nav>
        </div>
      </header>
      <router-view v-slot="{ Component }">
        <keep-alive :include="appStore.cachedRouteNames" :max="10">
          <component :is="Component" :key="$route.path" />
        </keep-alive>
      </router-view>
    </DefaultLayout>
  </el-config-provider>
</template>

<style lang="scss" scoped></style>
