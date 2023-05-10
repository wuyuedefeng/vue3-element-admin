<script lang="tsx" setup>
import { computed } from 'vue'
import type { RouteRecord } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/store/app'
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const menuRoutes = computed(() => [
  router.getRoute('home'),
  router.getRoute('about'),
  router.getRoute('auth')
])

const defalutActive = computed(() => route.name)
const defaultOpeneds = computed(() => {
  if (!route) return []
  const parentRotues: RouteRecord[] = []
  let parentRoute = router.getParentRoute(route as any as RouteRecord)
  while (parentRoute) {
    parentRotues.splice(0, 0, parentRoute)
    parentRoute = router.getParentRoute(parentRoute)
  }
  return parentRotues.map((route) => route.name)
})

const onMenuItemClick = (route: any) => {
  router.push({ name: route.name })
}
</script>

<template>
  <el-menu
    v-bind="appStore.navMenu"
    class="h-full"
    :defaultActive="defalutActive"
    :defaultOpeneds="defaultOpeneds"
  >
    <template v-for="menuRoute in menuRoutes" :key="menuRoute.name">
      <template v-if="menuRoute?.children?.length">
        <el-sub-menu :index="menuRoute.name">
          <template #title>
            <!-- <el-icon><i-ep-home-filled /></el-icon> -->
            <span>{{ menuRoute.meta.title }}</span>
          </template>
          <template v-for="subMenuRoute in menuRoute.children" :key="subMenuRoute.name">
            <el-menu-item :index="subMenuRoute.name" @click="onMenuItemClick(subMenuRoute)">{{
              subMenuRoute.meta?.title
            }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="menuRoute?.name" @click="onMenuItemClick(menuRoute)">
          <!-- <el-icon><i-ep-home-filled /></el-icon> -->
          <template #title>
            {{ menuRoute?.meta.title }}
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<style lang="scss" scoped>
.el-menu {
  width: 250px;

  &.el-menu--collapse {
    width: 60px;
  }
}
</style>
