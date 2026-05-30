import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { IndexedDBConnection } from './core/indexed-db'
import { SocketBase } from './core/socket/socket.base'
import { Router } from './router/router'

// import tailwind css first
import './assets/tailwind.css'
// then import custom scss
import './assets/main.scss'
// then import common scss
import './common/_scss/vue-common.scss'

const start = async () => {
  const app = createApp(App)

  IndexedDBConnection.init()

  app.use(createPinia())
  app.use(Router)

  app.mount('#app')
  SocketBase.connect()
}

start()
