export type RegixOptions = {
  regex: RegExp
  message?: string
  trigger?: string | string[]
}

export default function (options: RegixOptions) {
  function regexValidator(rule: any, value: any, callback: any) {
    if (options.regex && value && !value.match(options.regex)) {
      return callback(new Error('匹配失败'))
    }
    callback()
  }
  return Object.assign(
    {
      validator: regexValidator,
      message: options.message || '格式错误',
      trigger: options.trigger || 'blur'
    },
    options
  )
}
