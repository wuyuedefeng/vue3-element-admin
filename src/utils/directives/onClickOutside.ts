import type { Directive, DirectiveBinding } from 'vue'

interface ExtendedElement extends Element {
  __onClick__?: (event: Event) => void
}

export default {
  mounted(el: ExtendedElement, binding: DirectiveBinding) {
    const onClick = (event: Event) => {
      const isClickOutside = event.target !== el && !el.contains(event.target as Node)
      if (isClickOutside) {
        binding.value?.(el)
      }
    }
    el.addEventListener('click', onClick)
    el.__onClick__ = onClick
  },
  beforeUnmount(el: ExtendedElement) {
    if (el.__onClick__) {
      el.removeEventListener('click', el.__onClick__)
    }
  }
} as Directive

/**
 * usage
 <script setup lang="ts">
import vOnClickOutside from '@/utils/directives/onClickOutside'
const onClickOutside = (el) => { console.log('onClickOutside', el) }
</script>

<template>
  <div v-onClickOutside="onClickOutside"></div>
</template>
 */
