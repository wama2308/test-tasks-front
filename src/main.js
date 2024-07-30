//import './assets/main.css'
import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// Components
import App from './App.vue'

// Configuración de Axios
import axiosInstance from './axiosConfig'

// Importar fuentes de iconos (MDI en este caso)
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { mdiAccount } from '@mdi/js'


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      account: mdiAccount,
    },
    sets: {
      mdi,
    },
  },
})

const app = createApp(App);

app.config.globalProperties.$axios = axiosInstance;

app.use(vuetify).mount('#app')