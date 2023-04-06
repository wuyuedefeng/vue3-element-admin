import type { Directive, DirectiveBinding } from 'vue'

interface ExtendedElement extends Element {
  __observer__?: ResizeObserver
}

export default {
  mounted(el: ExtendedElement, binding: DirectiveBinding) {
    const observer =
      ResizeObserver &&
      new ResizeObserver((_entries) => {
        binding.value?.(el)
      })
    observer.observe(el)
    el.__observer__ = observer
  },
  beforeUnmount(el: ExtendedElement) {
    el.__observer__ && el.__observer__.disconnect()
  }
} as Directive

/**
 * usage
 <script setup lang="ts">
import vOnResize from '@/utils/directives/onResize'
const onResize = (el) => { console.log('onResize', el) }
</script>

<template>
  <div v-onResize="onResize"></div>
</template>
 */
