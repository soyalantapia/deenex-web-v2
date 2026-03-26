import { createApp } from 'vue'
import App from './router/App.vue'
import router from './router'
import './styles/main.css'
import Vue3Marquee from 'vue3-marquee'

const app = createApp(App)

app.use(router)
app.use(Vue3Marquee)

app.mount('#app')
