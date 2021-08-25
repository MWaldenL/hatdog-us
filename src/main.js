import Vue from 'vue'
import { rtdbPlugin } from 'vuefire'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(rtdbPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
