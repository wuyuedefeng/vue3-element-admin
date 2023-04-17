import type { VNode } from 'vue'
import { createApp, render } from 'vue'
import { createPinia } from './stores'
import { createRouter } from './router'
import { createI18n } from './i18n'

import App from './App.vue'

import './assets/stylesheets/application.scss'

const app = createApp(App)

app.use(createPinia())
app.use(createRouter())
app.use(createI18n())

app.mount('#app')

app.render = (vnode: VNode | null, rootContainer: Element): void => {
  if (vnode && !vnode.appContext) vnode.appContext = app._context
  render(vnode, rootContainer)
}
