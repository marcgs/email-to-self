import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import nprogress from 'nprogress';

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/success',
    name: 'Success',
    // route level code-splitting
    // this generates a separate chunk (success.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "success" */ '../views/Success.vue')
  },
  {
    path: '/verify',
    name: 'verify',
    // route level code-splitting
    // this generates a separate chunk (verify.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "verify" */ '../views/Verify.vue')
  }
]

const router = new VueRouter({
  routes
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    nprogress.start();
  }
  next();
})

router.afterEach((to, from) => {
  nprogress.done();
})

export default router
