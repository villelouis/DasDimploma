import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
// import TableManager from "./database/TableManager"

Vue.config.productionTip = false

// const db = new TableManager("StartTable","Max");

import VueRouter from 'vue-router'
Vue.use(VueRouter)
import {router} from './routes'

import mainapi from './ipc/mainapi'

new Vue({
  beforeCreate: function(){
    Vue.prototype.$db = db;
  },
  router:router,
  render: h => h(App),
}).$mount('#app')

