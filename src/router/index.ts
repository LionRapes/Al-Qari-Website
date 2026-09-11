import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { isAuth } from '@/utils/authUtils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // HOME
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // QURAN
    {
      path: '/quran',
      name: 'quran',
      component: () => import('@/views/QuranView.vue'),
    },
    {
      path: '/quran/:id',
      name: 'surah',
      component: () => import('@/views/SurahView.vue'),
    },
    // PLAYLIST
    {
      path: '/playlists',
      name: 'playlists',
      component: () => import('@/views/playlist/PlaylistsView.vue'),
    },
    {
      path: '/playlists/:id',
      name: 'playlistDetail',
      component: () => import('@/views/playlist/PlaylistDetailView.vue'),
    },
    {
      path: '/playlists/create',
      name: 'CreatePlaylist',
      component: () => import('@/views/playlist/PlaylistEditorView.vue'),
    },
    {
      path: '/playlists/:id/edit',
      name: 'EditPlaylist',
      component: () => import('@/views/playlist/PlaylistEditorView.vue'),
      props: true,
    },
    // PROFILE
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('@/views/profile/ProfileView.vue'),
    },
    // AUTH
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/profile/LoginView.vue'),
    },
    {
      path: '/auth/verify',
      name: 'verify',
      component: () => import('@/views/profile/VerifyView.vue'),
    },
    // FORUM
    {
      path: '/forum',
      name: 'forum',
      component: () => import('@/views/forum/ForumIndexView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/forum/category/:id',
      name: 'category',
      component: () => import('@/views/forum/CategoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/forum/topic/:id',
      name: 'topic',
      component: () => import('@/views/forum/TopicView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuth()) {
    return '/login'
  } else {
    return true
  }
})

export default router
