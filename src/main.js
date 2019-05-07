import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import TableManager from "./database/TableManager"

Vue.config.productionTip = false

new Vue({
  beforeCreate: function(){
    const db = new TableManager("StartTable","Max");
    Vue.prototype.$db = db;
  },
  render: h => h(App),
}).$mount('#app')

