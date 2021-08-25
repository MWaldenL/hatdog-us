import Vue from 'vue'
import { rtdbPlugin } from 'vuefire'
import VueCookies from 'vue-cookies'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueCookies)
Vue.use(rtdbPlugin)

Vue.$cookies.config('7d')

new Vue({
  render: h => h(App),
}).$mount('#app')
