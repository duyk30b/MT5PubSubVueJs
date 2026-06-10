import { createRouter, createWebHistory, type RouteLocationNormalizedLoaded } from 'vue-router'
import { ROUTER_NAME } from './router_name.ts'

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
      name: ROUTER_NAME.APP_CONTAINER,
      component: () => import('../views/AppContainer.vue'),
      meta: { auth: AuthLevel.USER },
      children: [
        {
          path: '',
          name: ROUTER_NAME.HOME,
          component: () => import('../views/AppHome.vue'),
          meta: { title: 'Trang chủ' },
        },
        {
          path: 'user',
          name: ROUTER_NAME.USER,
          children: [
            {
              path: 'account',
              meta: { title: 'Tài khoản' },
              name: ROUTER_NAME.ACCOUNT,
              component: () => import('../views/user/account/AccountList.vue'),
            },
            {
              path: 'role',
              name: ROUTER_NAME.ROLE,
              meta: { title: 'Vai trò' },
              redirect: () => ({ name: ROUTER_NAME.ROLE_LIST }),
              children: [
                {
                  path: 'list',
                  name: ROUTER_NAME.ROLE_LIST,
                  component: () => import('../views/user/role/RoleList.vue'),
                },
                {
                  path: 'upsert/:id?',
                  name: ROUTER_NAME.ROLE_UPSERT,
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
        {
          path: 'mt5-program',
          name: ROUTER_NAME.MT5_PROGRAM,
          meta: { title: 'MT5 Program' },
          children: [
            {
              path: 'list',
              name: ROUTER_NAME.MT5_PROGRAM_LIST,
              component: () => import('../views/mt5_program/MT5ProgramList.vue'),
            },
          ],
        },
        {
          path: 'systems',
          name: ROUTER_NAME.SYSTEMS,
          meta: { title: 'Hệ thống' },
          children: [
            {
              path: 'system-setting',
              name: ROUTER_NAME.SYSTEM_SETTING,
              component: () => import('../views/systems/system-setting/SystemSetting.vue'),
              meta: { title: 'Cài đặt' },
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
          name: ROUTER_NAME.LOGIN,
          component: () => import('../views/auth/Login.vue'),
        },
        {
          path: 'forgot-password',
          name: ROUTER_NAME.FORGOT_PASSWORD,
          component: () => import('../views/auth/ForgotPassword.vue'),
        },
        {
          path: 'reset-password',
          name: ROUTER_NAME.RESET_PASSWORD,
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
