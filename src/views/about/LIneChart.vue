<script setup lang="tsx">
import { computed } from 'vue'
const chartOptions = computed(() => {
  return {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }
    ]
  }
})
</script>

<template>
  <ECharts :options="chartOptions"></ECharts>
</template>

<style lang="scss" scoped></style>
