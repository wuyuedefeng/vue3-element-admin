<script lang="tsx">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { List } from '@/utils/hooks/useList'

export default defineComponent({
  inheritAttrs: false,
  props: {
    list: {
      type: Object as PropType<List>,
      required: true
    },
    defaultTableSlot: {
      type: Boolean,
      default: true
    },
    defaultPaginationSlot: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    return {}
  }
})
</script>

<template>
  <slot name="query" v-bind="{ list }"></slot>
  <slot v-bind="{ list }">
    <template v-if="defaultTableSlot">
      <el-table v-loading="list.isLoading" :data="list.records" v-bind="$attrs">
        <template v-for="(column, idx) in list.tableColumns" :key="idx">
          <el-table-column v-bind="column"></el-table-column>
        </template>
      </el-table>
    </template>
  </slot>
  <slot name="pagination" v-bind="{ list }">
    <template v-if="defaultPaginationSlot">
      <el-pagination
        small
        background
        layout="total, prev, pager, next, jumper"
        :total="list.pagination.totalCount"
        class="mt-4"
      />
    </template>
  </slot>
</template>

<style lang="scss" scoped></style>
