<script lang="tsx" setup>
import { useForm } from '@/utils/hooks/useForm'

const props = defineProps({
  record: [Object]
})
const emits = defineEmits(['submit'])
const form = useForm({
  model: { ...props.record },
  async onSubmit() {
    emits('submit')
  }
})
</script>

<template>
  <el-form :ref="form.setFormRef" :model="form.model" label-width="80px">
    <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请输入标题' }]">
      <el-input v-model="form.model.title"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="form.submitLoading" @click="form.onSubmit"
        >保存</el-button
      >
      <el-button @click="form.close">取消</el-button>
    </el-form-item>
  </el-form>
</template>
