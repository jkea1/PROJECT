import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import MovieDetailModal from './MovieDetailModal.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/:id',
          component: MovieDetailModal
        }
      ]
    }
  ]
})
