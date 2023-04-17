<script lang="tsx" setup>
import type { Ref } from 'vue'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { EChartsType } from 'echarts'
import * as echarts from 'echarts'
import 'echarts-gl'

const props = defineProps({
  options: {
    type: [Object]
  },
  mergeOptions: [Boolean],
  loadingOptions: {
    type: Object,
    default: () => ({ text: 'Loading...' })
  }
})

const emits = defineEmits(['click'])

const chartRef: Ref<any> = ref(null)
let chartInstance: EChartsType | null = null

const setOptions = () => {
  if (props.options) {
    chartInstance?.hideLoading()
    // chartInstance.clear() // 会导致图表重置，重绘伴有动画
    chartInstance?.setOption(props.options, !props.mergeOptions)
  }
}

const handleResizeWindow = () => {
  nextTick(() => {
    setTimeout(() => {
      chartInstance?.resize()
    }, 300)
  })
}

onMounted(() => {
  chartInstance = echarts.init(chartRef.value)
  chartInstance.showLoading(props.loadingOptions)
  chartInstance.on('click', (params) => {
    // console.log('click chart', params)
    emits('click', params)
  })
  watch(
    () => props.options,
    () => {
      setOptions()
    },
    { immediate: true }
  )
  nextTick(() => {
    chartInstance?.resize()
  })
  window.addEventListener('resize', handleResizeWindow)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResizeWindow)
  chartInstance?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="echarts"></div>
</template>

<style lang="scss" scoped>
.echarts {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
