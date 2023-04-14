<script setup></script>

<template>
  <div class="header">
    <div class="header-left">header-left</div>
    <div class="header-left">header-right</div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  @apply flex justify-between items-center px-5;
  background: var(--el-color-primary);
  height: 60px;
}
</style>
