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
    async onSubmit(...args: any[]) {
      state.submitLoading = true
      // eslint-disable-next-line no-async-promise-executor
      await new Promise(async (resolve, reject) => {
        try {
          await (state.formRef as any).validate(async (valid: boolean, fields: any[]) => {
            if (valid) {
              resolve(await options.onSubmit(...args).catch((e) => reject(e)))
            } else {
              console.error('error submit!', fields)
              reject(fields)
            }
          })
        } catch (e: any) {
          reject(e)
        }
      }).finally(() => {
        state.submitLoading = false
      })
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
  onSubmit: (...args: any[]) => Promise<void>
  onCancel?: () => Promise<void>
}

export interface Form {
  setFormRef: (formRef: Ref<VNodeRef>) => void
  formRef: Ref<VNodeRef> | null
  model: Record<string, any>
  rules: Record<string, any[]> | {}
  submitLoading: boolean
  onSubmit: (...args: any[]) => Promise<void>
  onCancel: () => Promise<void>
  resetFields: () => void
  close: () => void
}
