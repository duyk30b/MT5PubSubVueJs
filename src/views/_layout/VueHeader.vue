<script setup lang="ts">
import { IconLogout, IconMenuUnfold, IconUser } from '@/common/icon-antd'
import { IconContrast } from '@/common/icon-google'
import VueDropdown from '@/common/popover/VueDropdown.vue'
import { LOCAL_STORAGE_KEYS } from '@/core/local_storage/local_storage_keys'
import { ROUTER_NAME } from '@/router/router_name'
import { useAuthStore } from '@/stores/auth.store.ts'
import { useGlobalStore } from '@/stores/global.store'
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineProps<{ isMobile?: boolean }>()

const emit = defineEmits(['toggleSidebar'])
const emitToggleSidebar = () => emit('toggleSidebar')

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const { user } = authStore

const routeTitle = ref<string>('')
const themeMode = ref<'light' | 'dark'>(
  localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light',
)

const toggleTheme = () => {
  const mode = themeMode.value === 'light' ? 'dark' : 'light'
  themeMode.value = mode
  localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, mode)
  document.documentElement.classList.toggle('theme-dark', mode === 'dark')
}

watchEffect(() => {
  const titleList = route.matched.map((i) => i?.meta?.title).filter((i) => !!i)
  const title = titleList[titleList.length - 1]
  if (typeof title === 'function') {
    routeTitle.value = title(route)
  } else if (typeof title === 'string') {
    routeTitle.value = title
  }
})

const startLogout = async () => {
  try {
    await authStore.logout()
    router.push({ name: ROUTER_NAME.LOGIN })
  } catch (error) {
    console.log('🚀 ~ startLogout ~ error:', error)
  }
}
</script>

<template>
  <div class="dashboard-topbar">
    <div class="topbar-left">
      <button class="menu-toggle" type="button" @click="emitToggleSidebar">
        <IconMenuUnfold />
      </button>

      <span class="header-title">Dashboard</span>
    </div>

    <div class="topbar-right">
      <!-- <span class="route-title">{{ routeTitle }}</span> -->
      <div @click="toggleTheme()" style="cursor: pointer">
        <IconContrast :width="32" :height="32" />
      </div>

      <VueDropdown>
        <template #trigger>
          <div class="topbar-user">
            <IconUser />
            {{ user?.username }}
          </div>
        </template>
        <div class="topbar-user-menu">
          <a @click="startLogout">
            <IconLogout />
            <span>Đăng xuất</span>
          </a>
        </div>
      </VueDropdown>
    </div>

    <div v-if="globalStore.loading" class="progress-loader">
      <div
        class="progress-bar"
        :style="{ width: `${globalStore.percent}%`, transitionDuration: `${30000 / 10000}s` }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.topbar-user-menu {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: var(--dashboard-panel);
  border: 1px solid var(--dashboard-line);
  border-radius: 10px;

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 14px;
    color: var(--dashboard-text);

    &:hover {
      background: color-mix(in srgb, var(--dashboard-primary-500) 10%, var(--dashboard-panel));
    }
  }
}

.dashboard-topbar {
  position: relative;
  height: 56px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: normal;
  background: var(--dashboard-header-bg);
  color: var(--dashboard-header-text);

  .topbar-right {
    .topbar-user {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      border: 1px solid var(--dashboard-header-border);
      padding: 6px 12px;
      border-radius: 10px;
      background: var(--dashboard-header-chip);
      transition: background-color 0.2s ease;

      &:hover {
        background: var(--dashboard-header-chip-hover);
      }
    }
  }
}

html.theme-dark .topbar-theme-toggle button.active {
  background: #203352;
  color: #dbeafe;
}

.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-toggle {
  width: 34px;
  height: 34px;
  border: 1px solid var(--dashboard-header-border);
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: var(--dashboard-header-chip);
  color: var(--dashboard-header-text);
  cursor: pointer;

  &:hover {
    background: var(--dashboard-header-chip-hover);
  }
}

.header-title {
  color: var(--dashboard-header-text);
  font-size: 15px;
  font-weight: 600;
}

.route-title {
  color: var(--dashboard-header-text);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.progress-loader {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: color-mix(in srgb, var(--dashboard-header-text) 12%, transparent);

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%);
  }
}

@media (max-width: 991px) {
  .dashboard-topbar {
    padding: 0 12px;
  }

  .topbar-theme-toggle {
    display: none;
  }

  .route-title {
    display: none;
  }
}
</style>
