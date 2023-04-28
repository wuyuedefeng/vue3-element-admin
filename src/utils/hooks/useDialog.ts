import type { VNode, Slot } from 'vue'
import {
  getCurrentInstance,
  createVNode,
  defineComponent,
  reactive,
  ref,
  provide,
  inject
} from 'vue'
import 'element-plus/es/components/dialog/style/css'
import { ElDialog, ElConfigProvider } from 'element-plus'

const ModalComponent = defineComponent({
  props: {
    options: {
      type: Object,
      required: true
    },
    configProvider: [Object]
  },
  setup(props) {
    const { slots = {}, ...options } = props.options as DialogOptions
    const dialogState = reactive({
      ...options,
      'onUpdate:modelValue'(value: boolean) {
        dialogState.modelValue = value
        if (typeof options['onUpdate:modelValue'] === 'function') {
          options['onUpdate:modelValue'](value)
        }
      }
    })
    provide('configProvider', props.configProvider)
    const dialogSlots = reactive(slots)
    provide(
      'dialogState',
      new Proxy(dialogState, {
        get(target, key, ...args) {
          if (key === 'close') {
            return () => target['onUpdate:modelValue'](false)
          }
          return Reflect.get(target, key, ...args)
        }
      })
    )
    provide('dialogSlots', dialogSlots)

    return {
      dialogState,
      dialogSlots
    }
  },
  render() {
    console.log(22221)
    const dialog = createVNode(ElDialog, this.dialogState, this.dialogSlots)
    return this.configProvider
      ? createVNode(
          ElConfigProvider,
          {
            locale: this.configProvider.locale
          },
          {
            default: () => dialog
          }
        )
      : dialog
  }
})

/* usage */
// import { createVNode } from 'vue'
// const dialog = useDialog()
//const instance = dialog.create({
//  title: '新建仓库',
//  slots: {
//    default: () => createVNode(New, {
//      onCancel: () => {
//        //instance.unmount() // 直接移除
//        instance.close() // 弹出框完全关闭后移除
//      }
//    })
//  }
//})

export const useDialog = (defaultOptions: DialogOptions | {} = {}) => {
  const instance = getCurrentInstance()
  console.assert(!!instance, 'getCurrentInstance无法获取到实例，请检查')
  const configProvider = inject('configProvider', null)
  const app = instance!.appContext.app

  return {
    create(options: DialogOptions) {
      const div = document.createElement('div')
      div.setAttribute('class', 'use-dialog')
      document.body.appendChild(div)

      const modelValue = ref(true)

      const modalVNode = createVNode(ModalComponent, {
        options: {
          //destroyOnClose: true,
          ...defaultOptions,
          ...options,
          modelValue,
          onClosed() {
            app.render(null, div)
            div.parentNode?.removeChild(div)
            if (typeof options.onClosed === 'function') {
              options.onClosed()
            }
          }
        },
        configProvider
      })
      modalVNode.appContext = instance!.appContext
      app.render(modalVNode, div)

      return {
        close() {
          modelValue.value = false
          // modalVNode.component.setupState.close()
        }
      }
    }
  }
}

export interface DialogOptions {
  modelValue?: boolean
  title?: string
  width?: string | number
  style?: string | Record<string, any>
  fullscreen?: boolean
  modal?: boolean
  openDelay?: number
  closeDelay?: number
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  beforeClose?: (done: () => void) => void
  draggable?: boolean
  center?: boolean
  alignCenter?: boolean
  slots: Slot | Record<string, Slot | (() => VNode)>
  'onUpdate:modelValue'?: (modelValue: boolean) => void
  onClosed?: () => void
}
