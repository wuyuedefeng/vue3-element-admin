<script lang="tsx" setup>
// import 'element-plus/es/components/affix/style/css'
// import { ElAffix } from 'element-plus'
import Breadcrumb from './Breadcrumb.vue'
import Humburger from './Humburger.vue'
import TagsView from './TagsView.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const onToggleNavMenu = () => {
  appStore.navMenu.collapse = !appStore.navMenu.collapse
}
</script>

<template>
  <div class="header">
    <div class="header-nav flex justify-between items-center">
      <div class="left-panel flex items-center">
        <Humburger
          :is-active="appStore.navMenu.collapse"
          @toggleClick="onToggleNavMenu"
        ></Humburger>
        <Breadcrumb></Breadcrumb>
      </div>
      <!-- <div class="right-panel flex items-center mr-5">个人中心</div> -->
    </div>
    <div class="header-tags-view">
      <TagsView></TagsView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  background-color: var(--color-background);
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .header-nav {
    min-height: 50px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  }
}
</style>
