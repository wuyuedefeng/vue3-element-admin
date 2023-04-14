<script lang="tsx" setup>
import Header from './Header/index.vue'
import LeftSide from './LeftSide/index.vue'
import Main from './Main/index.vue'
</script>

<template>
  <el-container class="h-full">
    <el-header class="h-auto p-0">
      <Header></Header>
    </el-header>
    <el-main class="p-0">
      <el-container class="h-full">
        <LeftSide></LeftSide>
        <Main>
          <slot></slot>
        </Main>
      </el-container>
    </el-main>
  </el-container>
</template>
