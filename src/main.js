import { createApp } from 'vue'
import ConfigProvider from 'ant-design-vue/lib/config-provider'
import Table from 'ant-design-vue/lib/table'
import App from './App.vue'
import router from './router'
import './firebase'
import './dateformat'

import './assets/style.css'
import 'ant-design-vue/lib/table/style/index.css'

/* if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser')
  worker.start()
} */

const app = createApp(App)
app.use(router)
app.use(ConfigProvider)
app.use(Table)
app.mount('#app')
