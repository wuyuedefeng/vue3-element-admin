import type { VNode } from 'vue'
import { createApp, render } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/stylesheets/application.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

app.render = (vnode: VNode | null, rootContainer: Element): void => {
    if (vnode && !vnode.appContext) vnode.appContext = app._context
    render(vnode, rootContainer)
}