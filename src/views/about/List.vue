<script lang="tsx" setup>
import { createVNode } from 'vue'
import { useList } from '@/utils/hooks/useList'
import { useDialog } from '@/utils/hooks/useDialog'
import Form from './Form.vue'
import { ElTag } from 'element-plus'

const dialog = useDialog()

const list = useList({
  tableColumns: [
    {
      label: 'ID',
      prop: 'id',
      width: 100,
      // renderHeader: () => <ElTag>ID</ElTag>,
      render: ({ row }) => <ElTag>{row.id}</ElTag>
    },
    { label: '姓名', prop: 'name' }
  ],
  async onLoad() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    list.records = [{ id: 1, name: '张三' }]
    list.pagination.totalCount = 1
  }
})
list.onLoad()

const onCreate = () => {
  const instance = dialog.create({
    title: '新增',
    slots: {
      default: () => createVNode(Form)
    }
  })
  console.log(instance)
}

const onEdit = () => {
  const instance = dialog.create({
    title: '编辑',
    slots: {
      default: () =>
        createVNode(Form, {
          record: { title: 111 },
          onSubmit() {
            instance.close()
          }
        })
    }
  })
  console.log(instance)
}
</script>

<template>
  <FragmentList ref="listRef" :list="list">
    <template #query>
      <el-form inline>
        <el-form-item label="标题:">
          <el-input v-model="list.query.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="list.isLoading" @click="list.onLoad()">
            <template #icon><i-ep-search /></template>搜索
          </el-button>
          <el-button @click="list.onReset()">重置</el-button>
          <el-button type="primary" @click="onCreate">添加</el-button>
          <el-button type="primary" @click="onEdit">编辑</el-button>
        </el-form-item>
      </el-form>
    </template>
  </FragmentList>
</template>
