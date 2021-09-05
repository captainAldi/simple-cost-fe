import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      auth: true,
    },
  },
  {
    path: '/data',
    name: 'Data',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "data" */ '../views/Data.vue'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/data/detail/:idCost',
    name: 'DetailCost',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "DetailCost" */ '../views/DetailCost.vue'),
    meta: {
      auth: true,
    },
  },


   // Auth

  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "Login" */ '../views/Auth/Login.vue')
  },

  {
    path: '/oauth/google/callback',
    name: 'loginGoogle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "LoginGoogle" */ '../views/Auth/LoginGoogle.vue')
  },

  // 404

  {
    path: '*',
    name: 'NotFound',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "NotFound" */ '../views/NotFound.vue')
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // jika routing ada meta auth-nya maka
  if (to.matched.some(record => record.meta.auth)) {
    // jika user adalah guest
    if (store.getters['auth/guest']) {
      // tampilkan pesan bahwa harus login dulu
      store.dispatch('alert/set', {
        status: true,
        text: 'Login first',
        color: 'error',
      })
      // catat link sebelum nya
      store.dispatch('prevUrl/setPrevUrl', to.path)

      //redirect ke form login
      next('/login')
    }
    // Jika Routing ada meta admin-nya maka
    else if (to.matched.some(record => record.meta.admin)) {
      // jika user bukan admin
      if (store.getters['auth/user'].user.role != 'admin') {
        // tampilkan pesan Unauthorized !
        store.dispatch('alert/set', {
          status: true,
          text: 'Bukan Admin!',
          color: 'error',
        })

        //redirect ke dashboard
        next('/')
      } 
      else {
        next()
      }
    }

    // Jika Routing ada meta user-nya maka
    else if (to.matched.some(record => record.meta.user)) {
      // jika user bukan admin
      if (store.getters['auth/user'].user.role != 'user') {
        // tampilkan pesan Unauthorized !
        store.dispatch('alert/set', {
          status: true,
          text: 'Wrong Path !',
          color: 'error',
        })

        //redirect ke dashboard
        next('/')
      }
      else {
        next()
      }
    }

    // Bukan auth dan admin lanjut
    else {
      next()
    }
  }
  // Bukan Auth
  else {
    next()
  }
})

export default router
