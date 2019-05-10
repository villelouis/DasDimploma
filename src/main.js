import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
Vue.use(VueRouter)
import {router} from './routes'

import db from './ipc/mainapi'

new Vue({
  beforeCreate: function(){
    Vue.prototype.$db = db;
  },
  router:router,
  render: h => h(App),
}).$mount('#app')

