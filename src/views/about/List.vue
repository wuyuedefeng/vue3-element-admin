<script lang="tsx" setup>
import { createVNode, defineAsyncComponent } from 'vue'
import { useList } from '@/utils/hooks/useList'
import { useDialog } from '@/utils/hooks/useDialog'
import { ElTag } from 'element-plus'

const dialog = useDialog()

const list = useList({
  tableColumns: [
    { type: 'index', width: 50 },
    {
      label: 'ID',
      prop: 'id',
      width: 100,
      // renderHeader: () => <ElTag>ID</ElTag>,
      render: ({ row }) => <ElTag>{row.id}</ElTag>
    },
    { label: '姓名', prop: 'name' },
    { label: '操作', prop: 'actions' }
  ],
  async onLoad() {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    list.records = [{ id: 1, name: '张三' }]
    list.pagination.totalCount = 1
  }
})
list.onLoad()

const onShow = (record: Object) => {
  const instance = dialog.create({
    title: '详情',
    slots: {
      default: () =>
        createVNode(
          defineAsyncComponent(() => import('./Info.vue')),
          {
            record
          }
        )
    }
  })
  console.log(instance)
}

const onCreate = () => {
  const instance = dialog.create({
    title: '新增',
    closeOnClickModal: false,
    slots: {
      default: () => createVNode(defineAsyncComponent(() => import('./Form.vue')))
    }
  })
  console.log(instance)
}

const onEdit = (record: Object) => {
  const instance = dialog.create({
    title: '编辑',
    closeOnClickModal: false,
    slots: {
      default: () =>
        createVNode(
          defineAsyncComponent(() => import('./Form.vue')),
          {
            record,
            onSubmit() {
              instance.close()
            }
          }
        )
    }
  })
  console.log(instance)
}

const onDelete = async (record: any) => {
  // eslint-disable-next-line no-undef
  ElMessageBox.confirm('确定删除条目?', '确认消息', {
    type: 'warning' /*, confirmButtonText: 'OK' */ /* cancelButtonText: 'Cancel'*/
  })
    .then(() => {
      console.log('delete', record)
    })
    .catch(() => {})
}
</script>

<template>
  <main>
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
            <el-button @click="list.onReset()">
              <template #icon><i-ep-refresh /></template>重置
            </el-button>
          </el-form-item>
        </el-form>
        <div class="operations text-right">
          <el-space>
            <el-button type="primary" @click="onCreate">
              <template #icon><i-ep-plus /></template>新增
            </el-button>
            <el-button>
              <template #icon><i-ep-download /></template>导出
            </el-button>
            <el-dropdown trigger="click" split-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item> <i-ep-download />导出模板 </el-dropdown-item>
                </el-dropdown-menu>
              </template>
              <i-ep-upload />导入
            </el-dropdown>
          </el-space>
        </div>
      </template>
      <template #actionsColumn="{ row }">
        <el-space>
          <el-button size="small" circle @click="onShow(row)">
            <template #icon><i-ep-view /></template>
          </el-button>
          <el-button size="small" circle @click="onEdit(row)">
            <template #icon><i-ep-edit /></template>
          </el-button>
          <el-button size="small" type="danger" circle @click="onDelete(row)">
            <template #icon><i-ep-delete /></template>
          </el-button>
        </el-space>
      </template>
    </FragmentList>
  </main>
</template>
