<template>
  <router-view></router-view>
</template>

<!-- <script lang="tsx" setup>
import { useTagsViewStore } from '@/store/tagsView'
const tagsViewStore = useTagsViewStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="tagsViewStore.cachedRouteNames" :max="10">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template> -->
