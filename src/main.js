import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'
import { subscribeUser } from './sw'
// import registerServiceWorker from './sw'
const updateSW = registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
onRegistered(registration){
    console.log('sw registration', registration)
    subscribeUser(registration).then(data => console.log('data', data))
}
})

// registerSW({}).then(result => console.log('result', result))
// registerServiceWorker()
const app = createApp(App)

app.use(router)

app.mount('#app')
