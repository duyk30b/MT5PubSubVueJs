import { createRouter, createWebHistory, type RouteLocationNormalizedLoaded } from 'vue-router'

enum AuthLevel {
  GUEST = 'GUEST',
  USER = 'USER',
  ROOT = 'ROOT',
}

const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AppContainer',
      component: () => import('../views/AppContainer.vue'),
      meta: { auth: AuthLevel.USER },
      children: [
        {
          path: '',
          name: 'AppHome',
          component: () => import('../views/AppHome.vue'),
          meta: { title: 'Trang chủ' },
        },
        {
          path: 'user',
          name: 'User',
          children: [
            {
              path: 'account',
              meta: { title: 'Tài khoản' },
              name: 'Account',
              component: () => import('../views/user/account/AccountList.vue'),
            },
            {
              path: 'role',
              name: 'Role',
              meta: { title: 'Vai trò' },
              redirect: () => ({ name: 'RoleList' }),
              children: [
                {
                  path: 'list',
                  name: 'RoleList',
                  component: () => import('../views/user/role/RoleList.vue'),
                },
                {
                  path: 'upsert/:id?',
                  name: 'RoleUpsert',
                  component: () => import('../views/user/role/upsert/RoleUpsertContainer.vue'),
                  meta: {
                    title: (route: RouteLocationNormalizedLoaded) => {
                      if (route.params.id) return 'Cập nhật vai trò'
                      return 'Tạo mới vai trò'
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/auth',
      meta: { auth: AuthLevel.GUEST },
      component: () => import('../views/auth/AuthContainer.vue'),
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('../views/auth/Login.vue'),
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: () => import('../views/auth/ForgotPassword.vue'),
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: () => import('../views/auth/ResetPassword.vue'),
        },
      ],
    },
    {
      path: '/privacy',
      component: () => import('../views/AppPrivacy.vue'),
    },
    {
      path: '/term',
      component: () => import('../views/AppTerm.vue'),
    },
    // Route bắt tất cả và redirect về trang chủ
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export { Router }
