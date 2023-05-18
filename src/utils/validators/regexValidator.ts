import type { ComputedRef } from 'vue'
export type RegexOptions = {
  regex?: RegExp
  message?: string | ComputedRef<string>
  trigger?: string | string[]
}

export default function (options: RegexOptions) {
  console.assert(!!options.regex, 'regex params must pass')
  function regexValidator(rule: any, value: any, callback: any) {
    if (options.regex && value && !value.match(options.regex)) {
      return callback(new Error('匹配失败'))
    }
    callback()
  }
  return Object.assign(
    {
      validator: regexValidator,
      message: options.message ?? '校验不通过',
      trigger: options.trigger || 'blur'
    },
    options
  )
}
