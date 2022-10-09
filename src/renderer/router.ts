import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
// import { setupLayouts } from 'virtual:generated-layouts'

// const routes2 = setupLayouts(generatedRoutes)

console.log(generatedRoutes);

const router = createRouter({
  // __ROUTER_BASE_PATH__ gets replaced by rollup on build!\
  history: createWebHashHistory('/'),
  routes: generatedRoutes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router