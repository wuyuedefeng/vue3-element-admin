import type { Ref, VNodeRef } from 'vue'
import { reactive, inject } from 'vue'

export const useForm = (options: FormOptions) => {
  const dialogState = inject('dialogState', null)
  const state = reactive<Form>({
    model: options.model,
    submitLoading: false,
    async onSubmit(formRef: Ref<VNodeRef>) {
      state.submitLoading = true
      await (formRef as any)
        .validate(async (valid: boolean, fields: any[]) => {
          if (valid) {
            await options.onSubmit()
          } else {
            console.error('error submit!', fields)
          }
        })
        .finally(() => {
          state.submitLoading = false
        })
    },
    async onCancel() {
      if (options.onCancel) {
        await options.onCancel()
      }
    },
    resetFields(formRef: Ref<VNodeRef>) {
      ;(formRef as any).resetFields()
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
  onSubmit: () => Promise<void>
  onCancel?: () => Promise<void>
}

export interface Form {
  model: Record<string, any>
  submitLoading: boolean
  onSubmit: (formRef: Ref<any>) => Promise<void>
  onCancel: () => Promise<void>
  resetFields: (formRef: Ref<VNodeRef>) => void
  close: () => void
}
