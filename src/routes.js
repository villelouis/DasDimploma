import AAA from "./views/AAA"
import SimpleTable from "./components/SimpleTable"
import VueRouter from 'vue-router'

const routes = [
    { path: '/AAA', component: AAA },
    { path: '/Table', component: SimpleTable },
]

export const router = new VueRouter({
    routes
})

