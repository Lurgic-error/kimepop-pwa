import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'
// import registerServiceWorker from './sw'
// const updateSW = registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
// })

registerSW({}).then(result => console.log('result', result))
// registerServiceWorker()
const app = createApp(App)

app.use(router)

app.mount('#app')
