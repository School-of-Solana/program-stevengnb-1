import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import CreateEscrow from '@/views/CreateEscrow.vue'
import MyEscrows from '@/views/MyEscrows.vue'
import Claimable from '@/views/Claimable.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/create',
    name: 'CreateEscrow',
    component: CreateEscrow,
    meta: { title: 'Create Escrow' }
  },
  {
    path: '/my-escrows',
    name: 'MyEscrows',
    component: MyEscrows,
    meta: { title: 'My Escrows' }
  },
  {
    path: '/claimable',
    name: 'Claimable',
    component: Claimable,
    meta: { title: 'Claimable Escrows' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Escrow System` : 'Escrow System'
  next()
})

export default router
