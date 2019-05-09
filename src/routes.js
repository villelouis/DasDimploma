import VueRouter from 'vue-router'

import CurrentTable from './views/CurrentTable'
import Tables from "./views/Tables";

const routes = [
    { path: '/CurrentTable/:tableName', component: CurrentTable,props:true},
    { path: '/Tables', component: Tables },
]

export const router = new VueRouter({
    routes
})

