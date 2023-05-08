<script lang="tsx" setup>
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="appStore.cachedRouteNames" :max="10">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
