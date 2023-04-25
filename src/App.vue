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
        <transition name="fade">
          <keep-alive :include="appStore.visitedRouteNames" :max="10">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </DefaultLayout>
  </el-config-provider>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
