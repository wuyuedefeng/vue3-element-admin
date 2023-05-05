<script lang="tsx" setup></script>

<template>
  <div class="header">
    <div class="header-left text-base text-white font-bold">Title</div>
    <div class="header-right">
      <el-dropdown>
        <div class="flex outline-0 text-white">
          Username
          <i-ep-arrow-down />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  @apply flex justify-between items-center px-5;
  background: var(--el-color-primary);
  height: 60px;
}
</style>
