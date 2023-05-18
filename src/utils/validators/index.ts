import type { RegexOptions } from './regexValidator'
import regexValidator from './regexValidator'
import customValidator from './customValidator'

export const requiredValidator = (options: any) => {
  return { required: true, message: '不允许为空', trigger: ['blur'], ...options }
}

export const emailValidator = (options: any) => {
  return { type: 'email', message: '邮箱格式不正确', trigger: 'blur', ...options }
}

export const mobileValidator = (options: RegexOptions) => {
  options.regex = options.regex || /^1\d{10}$/
  options.message = options.message ?? '手机号格式不正确'
  return regexValidator(options)
}

export { regexValidator, customValidator }

export default {
  required: requiredValidator,
  email: emailValidator,
  mobile: mobileValidator,
  regex: regexValidator,
  custom: customValidator
}
