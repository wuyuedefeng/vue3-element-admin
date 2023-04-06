<script setup lang="ts">
import DefalutLayout from '@/components/layouts/Default.vue'
</script>

<template>
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
</template>

<style lang="scss" scoped></style>
