<script setup lang="ts">
import { provide } from 'vue'
import DefalutLayout from '@/components/layouts/Default.vue'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const configProvider = {
  locale: zhCn
}

provide('configProvider', configProvider)
</script>

<template>
  <el-config-provider :locale="configProvider.locale">
    <DefalutLayout>
      <header>
        <img
          alt="Vue logo"
          class="logo"
          src="@/assets/images/svg-icons/vue.svg"
          width="125"
          height="125"
        />

        <div class="wrapper flex">
          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </nav>
        </div>
      </header>
      <router-view></router-view>
    </DefalutLayout>
  </el-config-provider>
</template>

<style lang="scss" scoped></style>
