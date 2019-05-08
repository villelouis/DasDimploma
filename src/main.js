import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import TableManager from "./database/TableManager"

Vue.config.productionTip = false
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import {router} from './routes'

new Vue({
  beforeCreate: function(){
    const db = new TableManager("StartTable","Max");
    Vue.prototype.$db = db;
  },
  router:router,
  render: h => h(App),
}).$mount('#app')

