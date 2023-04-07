<script lang="tsx" setup>
import NavMenu from './NavMenu.vue'
import Header from './Header/index.vue'
</script>

<template>
  <el-container class="h-full">
    <el-aside class="w-auto">
      <NavMenu></NavMenu>
    </el-aside>
    <el-scrollbar class="w-full">
      <Header></Header>
      <el-main>
        <slot></slot>
      </el-main>
    </el-scrollbar>
  </el-container>
</template>
