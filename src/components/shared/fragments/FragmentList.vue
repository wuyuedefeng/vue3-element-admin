<script lang="tsx">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { List } from '@/utils/hooks/useList'
import { get } from 'lodash-es'

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
    return { get }
  }
})
</script>

<template>
  <slot name="query" v-bind="{ list }"></slot>
  <slot name="actions" v-bind="{ list }"></slot>
  <slot v-bind="{ list }">
    <template v-if="defaultTableSlot">
      <el-table
        :ref="list.setListRef"
        v-loading="list.isLoading"
        :data="list.records"
        v-bind="$attrs"
      >
        <template v-for="(column, idx) in list.tableColumns" :key="idx">
          <el-table-column v-bind="column">
            <template
              v-if="['selection', 'index'].indexOf(`${column.type}`) === -1"
              #default="scope"
            >
              <slot :name="column.slot || `${column.prop}Column`" v-bind="scope">
                <template v-if="!!column.render && Object.keys(scope.row).length">
                  <component :is="column.render(scope)"></component>
                </template>
                <template
                  v-else-if="column.prop"
                  >{{ get((scope as any).row, column.prop, '') }}</template
                >
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </template>
  </slot>
  <slot name="pagination" v-bind="{ list }">
    <template v-if="defaultPaginationSlot">
      <el-pagination
        small
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="list.pagination.pageNo"
        :page-size="list.pagination.pageSize"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="list.pagination.totalCount"
        @current-change="list.pagination.onCurrentChange"
        @size-change="list.pagination.onSizeChange"
        class="mt-4"
      />
    </template>
  </slot>
</template>

<style lang="scss" scoped></style>
