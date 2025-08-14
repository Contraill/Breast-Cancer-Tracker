import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style/main.css'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(PrimeVue)
app.use(router)
app.use(ToastService)

app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Toast', Toast)

app.mount('#app')
