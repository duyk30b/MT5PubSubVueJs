<script setup lang="ts">
import { IconHospitalUser } from '@/common/icon-font-awesome'
import { UserType } from '@/modules/user'
import { ROUTER_NAME } from '@/router/router_name'
import { useAuthStore } from '@/stores/auth.store'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconCaretDown, IconHome, IconSetting, IconTeam } from '../../common/icon-antd'

const props = defineProps<{ collapsed?: boolean }>()

const authStore = useAuthStore()
const { user } = authStore

const emit = defineEmits(['closeMobile'])
const route = useRoute()
const router = useRouter()

const openGroups = ref<string[]>([])

type MenuItem = {
  key: string
  label: string
  routeName?: string
  icon?: 'home' | 'team' | 'setting'
  children?: MenuItem[]
}

const sidebarMenus = computed<MenuItem[]>(() => {
  const menus: MenuItem[] = [
    { key: 'home', label: 'Trang chủ', routeName: ROUTER_NAME.HOME, icon: 'home' },
    {
      key: 'mt5_program',
      label: 'MT5 Program',
      routeName: ROUTER_NAME.MT5_PROGRAM_LIST,
      icon: 'home',
    },
  ]

  if (user?.userType === UserType.Root || user?.userType === UserType.Admin) {
    menus.push(
      {
        key: 'staff',
        label: 'Nhân viên',
        icon: 'team',
        children: [
          { key: 'role', label: 'Vai trò', routeName: ROUTER_NAME.ROLE_LIST },
          { key: 'account', label: 'Tài khoản', routeName: ROUTER_NAME.ACCOUNT },
        ],
      },
      {
        key: 'systems',
        label: 'Hệ thống',
        icon: 'setting',
        children: [
          { key: 'system_setting', label: 'Cài đặt', routeName: ROUTER_NAME.SYSTEM_SETTING },
        ],
      },
    )
  }

  return menus
})

const isGroupOpen = (groupKey: string) => openGroups.value.includes(groupKey)

const isRouteActive = (menu: MenuItem): boolean => {
  if (menu.routeName) {
    return route.name === menu.routeName
  }
  if (menu.children?.length) {
    return menu.children.some((child) => isRouteActive(child))
  }
  return false
}

const navigateTo = async (routeName?: string) => {
  if (!routeName) return
  await router.push({ name: routeName })
  emit('closeMobile')
}

const toggleGroup = (groupKey: string) => {
  if (props.collapsed) return
  if (isGroupOpen(groupKey)) {
    openGroups.value = openGroups.value.filter((key) => key !== groupKey)
    return
  }
  openGroups.value = [...openGroups.value, groupKey]
}

const expandGroupByRoute = () => {
  if (props.collapsed) return
  const activeGroups = sidebarMenus.value
    .filter((menu) => menu.children?.some((child) => child.routeName === route.name))
    .map((menu) => menu.key)
  openGroups.value = Array.from(new Set([...openGroups.value, ...activeGroups]))
}

watch(
  () => route.name,
  () => {
    expandGroupByRoute()
  },
  { immediate: true },
)

watch(
  () => props.collapsed,
  (newValue) => {
    if (newValue) {
      openGroups.value = []
      return
    }
    expandGroupByRoute()
  },
)
</script>

<template>
  <div class="dashboard-menu-wrap" :class="{ collapsed: collapsed }">
    <router-link
      :to="{ name: ROUTER_NAME.HOME }"
      class="sider-brand"
      :class="{ collapsed: collapsed }"
    >
      <span class="brand-icon">
        <IconHospitalUser />
      </span>
      <span v-if="!collapsed" class="brand-text">
        <strong>MT5PubSub</strong>
        <small>Dashboard Control</small>
      </span>
    </router-link>

    <nav class="sider-nav" aria-label="Dashboard menu">
      <div v-for="menu in sidebarMenus" :key="menu.key" class="menu-block">
        <button
          type="button"
          class="menu-item"
          :class="{ active: isRouteActive(menu), parent: !!menu.children }"
          @click="menu.children?.length ? toggleGroup(menu.key) : navigateTo(menu.routeName)"
        >
          <span class="menu-item-left">
            <span class="menu-icon">
              <IconHome v-if="menu.icon === 'home'" />
              <IconTeam v-else-if="menu.icon === 'team'" />
              <IconSetting v-else-if="menu.icon === 'setting'" />
            </span>
            <span v-if="!collapsed" class="menu-label">{{ menu.label }}</span>
          </span>
          <IconCaretDown
            v-if="menu.children?.length && !collapsed"
            class="submenu-caret"
            :class="{ open: isGroupOpen(menu.key) }"
          />
        </button>

        <div
          v-if="menu.children?.length && !collapsed"
          class="submenu"
          :class="{ open: isGroupOpen(menu.key) }"
        >
          <button
            v-for="child in menu.children"
            :key="child.key"
            type="button"
            class="submenu-item"
            :class="{ active: isRouteActive(child) }"
            @click="navigateTo(child.routeName)"
          >
            {{ child.label }}
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-menu-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--dashboard-sider-text);
}

.sider-brand {
  min-height: 56px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--dashboard-sider-text);
  border-bottom: 1px solid color-mix(in srgb, var(--dashboard-sider-text) 16%, transparent);

  .brand-icon {
    font-size: 28px;
    color: var(--dashboard-primary-500);
    display: grid;
    place-items: center;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;

    strong {
      font-size: 14px;
      letter-spacing: 0.2px;
    }

    small {
      font-size: 10px;
      color: var(--dashboard-sider-text-soft);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
  }
}

.sider-brand.collapsed {
  justify-content: center;
  padding: 14px 8px;
}

.sider-nav {
  padding: 12px 10px;
  overflow: auto;
}

.menu-block {
  margin-bottom: 6px;
}

.menu-item {
  width: 100%;
  height: 42px;
  border: 0;
  border-radius: 10px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  color: var(--dashboard-sider-text);
  cursor: pointer;

  &:hover {
    background: var(--dashboard-sider-hover);
  }

  &.active {
    background: var(--dashboard-sider-active);
    color: var(--dashboard-header-text);
  }
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-icon {
  width: 18px;
  display: grid;
  place-items: center;
  font-size: 16px;
}

.submenu-caret {
  transition: transform 0.2s ease;

  &.open {
    transform: rotate(180deg);
  }
}

.submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease;
  margin-left: 28px;

  &.open {
    max-height: 160px;
  }
}

.submenu-item {
  width: 100%;
  height: 34px;
  border: 0;
  border-radius: 8px;
  padding: 0 10px;
  text-align: left;
  margin-top: 6px;
  background: transparent;
  color: var(--dashboard-sider-text-soft);
  cursor: pointer;

  &:hover {
    background: var(--dashboard-sider-hover);
  }

  &.active {
    background: color-mix(in srgb, var(--dashboard-primary-500) 24%, transparent);
    color: var(--dashboard-header-text);
    font-weight: 600;
  }
}

.dashboard-menu-wrap.collapsed {
  .sider-nav {
    padding: 10px 8px;
  }

  .menu-item {
    justify-content: center;
    padding: 0;
  }

  .menu-icon {
    width: auto;
    font-size: 17px;
  }
}
</style>
