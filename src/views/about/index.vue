<script lang="tsx" setup>
import List from './List.vue'
import Form from './Form.vue'
</script>

<template>
  <main class="about">
    <ul>
      <li class="flex">
        <h1>This is an about page</h1>
        <el-button type="primary">hello</el-button>
        <i-svg-file-copy style="font-size: 40px; fill: red"></i-svg-file-copy>
        <i-svg-vue style="font-size: 40px"></i-svg-vue>
        <el-divider></el-divider>
      </li>
      <li>
        <el-button @click="$i18n.locale = 'zhCN'">中文</el-button>
        <el-button @click="$i18n.locale = 'enUS'">英文</el-button>
        {{ $t('message.hello') }}
      </li>
      <li>
        <List></List>
        <el-divider></el-divider>
      </li>
      <li class="mt-5">
        <Form></Form>
        <el-divider></el-divider>
      </li>
    </ul>
  </main>
</template>

<style lang="scss" scoped>
// .about {
//   @include when-inside('#app') {
//     background-color: #f00;
//  }
// }
</style>
