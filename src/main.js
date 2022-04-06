import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import { registerSW } from 'virtual:pwa-register'
import registerServiceWorker from './sw'
// const updateSW = registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
// })

registerServiceWorker()
const app = createApp(App)

app.use(router)

app.mount('#app')
