/* eslint-disable dot-notation */
import Axios from 'axios'
import '@/plugins/vue-composition-api'
import '@/styles/styles.scss'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false
Vue.use(VeeValidate)
// Vue.prototype.$http = Axios
const token = localStorage.getItem('token')
// if (token) {
//   Vue.prototype.$http.defaults.headers.common['Authorization'] = token
// }
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
