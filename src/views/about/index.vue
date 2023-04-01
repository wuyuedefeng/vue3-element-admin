<template>
  <main class="about">
    <h1>This is an about page</h1>
    <el-button type="primary">hello</el-button>
    <i-svg-file-copy style="font-size: 40px; fill: red"></i-svg-file-copy>
    <i-svg-vue style="font-size: 40px"></i-svg-vue>
  </main>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

// .about {
//   @include when-inside('#app') {
//     background-color: #f00;
//  }
// }
</style>
