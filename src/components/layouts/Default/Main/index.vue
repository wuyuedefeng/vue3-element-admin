<script lang="tsx" setup>
import Header from './Header/index.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<template>
  <template v-if="appStore.config.fixHeader">
    <el-main class="p-0 flex flex-col">
      <Header></Header>
      <el-scrollbar class="w-full flex-1">
        <el-main class="main-body">
          <slot></slot>
        </el-main>
      </el-scrollbar>
    </el-main>
  </template>
  <template v-else>
    <el-main class="p-0 flex flex-col">
      <el-scrollbar class="w-full flex-1">
        <Header></Header>
        <el-main class="main-body">
          <slot></slot>
        </el-main>
      </el-scrollbar>
    </el-main>
  </template>
</template>

<style lang="scss" scoped>
.main-body {
  min-width: 500px;
}
</style>
