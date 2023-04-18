import type { Ref, VNodeRef } from 'vue'
import { reactive, inject } from 'vue'

export const useForm = (options: FormOptions) => {
  const dialogState = inject('dialogState', null)
  const state = reactive<Form>({
    setFormRef: (formRef: Ref<VNodeRef>) => {
      state.formRef = formRef
    },
    formRef: null,
    model: options.model,
    rules: options.rules || {},
    submitLoading: false,
    async onSubmit() {
      try {
        state.submitLoading = true
        await (state.formRef as any).validate(async (valid: boolean, fields: any[]) => {
          if (valid) {
            await options.onSubmit()
          } else {
            console.error('error submit!', fields)
          }
        })
      } finally {
        state.submitLoading = false
      }
    },
    async onCancel() {
      if (options.onCancel) {
        await options.onCancel()
      }
    },
    resetFields() {
      ;(state.formRef as any)?.resetFields()
    },
    close() {
      if (dialogState) {
        ;(dialogState as any).close()
      }
    }
  })
  return state
}

export interface FormOptions {
  model: Record<string, any>
  rules?: Record<string, any[]> | {}
  onSubmit: () => Promise<void>
  onCancel?: () => Promise<void>
}

export interface Form {
  setFormRef: (formRef: Ref<VNodeRef>) => void
  formRef: Ref<VNodeRef> | null
  model: Record<string, any>
  rules: Record<string, any[]> | {}
  submitLoading: boolean
  onSubmit: () => Promise<void>
  onCancel: () => Promise<void>
  resetFields: () => void
  close: () => void
}
