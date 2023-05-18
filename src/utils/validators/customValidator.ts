import type { ComputedRef } from 'vue'

export type CustomOptions = {
  validate: (rule: any, value: any, callback: any) => Promise<void>
  message?: string | ComputedRef<string>
  trigger?: string | string[]
}

export default function (options: CustomOptions) {
  console.assert(!!options.validate, 'validate params must pass')
  function customValidator(rule: any, value: any, callback: any) {
    options!
      .validate(rule, value, callback)
      .then(() => {
        callback()
      })
      .catch((e: any) => {
        return callback(e)
      })
  }
  return Object.assign(
    {
      validator: customValidator,
      message: options.message ?? '校验不通过',
      trigger: options.trigger || 'blur'
    },
    options
  )
}
