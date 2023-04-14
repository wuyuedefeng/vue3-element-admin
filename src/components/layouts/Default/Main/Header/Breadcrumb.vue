<script lang="tsx" setup>
import { computed } from 'vue'
import type { RouteRecord } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const computedRoutes = computed(() => {
  let curRoute: any = route
  const routes = [curRoute]
  // eslint-disable-next-line no-constant-condition
  while (true) {
    curRoute = router.getParentRoute(curRoute as any as RouteRecord)
    if (curRoute?.meta.title) {
      routes.push(curRoute)
    } else {
      break
    }
  }
  return routes.reverse()
})
</script>

<template>
  <el-breadcrumb v-if="computedRoutes?.length" class="breadcrumb" separator="/">
    <template v-for="(routeItem, idx) in computedRoutes" :key="idx">
      <el-breadcrumb-item>
        {{ routeItem?.meta.title }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.page-breadcrumb {
  margin-bottom: 15px;
}
</style>
