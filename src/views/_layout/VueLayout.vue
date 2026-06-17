<script setup lang="ts">
import { LOCAL_STORAGE_KEYS } from '@/core/local_storage/local_storage_keys'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CONFIG } from '../../config'
import VueFooter from './VueFooter.vue'
import VueHeader from './VueHeader.vue'
import VueSider from './VueSider.vue'

const mobileBreakpoint = 992
const isMobile = ref(window.innerWidth < mobileBreakpoint)
const openSideDrawer = ref<boolean>(false)

const firstCollapsed = localStorage.getItem('SIDE_COLLAPSED') === 'true'
const collapsed = ref<boolean>(firstCollapsed)

const setSideCollapsed = (value: boolean) => {
  localStorage.setItem('SIDE_COLLAPSED', String(value))
  collapsed.value = value
}

const handleResize = () => {
  isMobile.value = window.innerWidth < mobileBreakpoint
  if (!isMobile.value) {
    openSideDrawer.value = false
  }
}

const toggleSidebar = () => {
  if (isMobile.value) {
    openSideDrawer.value = !openSideDrawer.value
    return
  }
  setSideCollapsed(!collapsed.value)
}

const closeMobileSidebar = () => {
  openSideDrawer.value = false
}

onMounted(() => {
  const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light'
  document.documentElement.classList.toggle('theme-dark', savedTheme === 'dark')
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div id="dashboard-layout" :class="{ 'is-mobile': isMobile }">
    <div v-if="isMobile && openSideDrawer" class="dashboard-overlay" @click="closeMobileSidebar" />

    <aside
      class="dashboard-sider"
      :class="{
        'collapsed': collapsed && !isMobile,
        'mobile-open': isMobile && openSideDrawer,
      }"
    >
      <VueSider :collapsed="collapsed && !isMobile" @closeMobile="closeMobileSidebar" />
    </aside>

    <section class="dashboard-main">
      <header class="dashboard-header">
        <VueHeader :isMobile="isMobile" @toggleSidebar="toggleSidebar" />
      </header>

      <!-- <div v-if="CONFIG.MODE === 'development'" class="dashboard-dev-mode">
        <span class="label">DEV API:</span>
        <span>{{ CONFIG.API_BASE_URL }}</span>
      </div> -->

      <main class="dashboard-content">
        <slot />
      </main>

      <VueFooter />
    </section>
  </div>
</template>

<style lang="scss" scoped>
#dashboard-layout {
  height: 100vh;
  display: flex;
  background: var(--dashboard-bg);
  overflow: hidden;
}

.dashboard-header {
  flex-shrink: 0;
  z-index: 50;
  border-bottom: 1px solid var(--dashboard-line);
}

.dashboard-overlay {
  position: fixed;
  inset: 0;
  background: var(--dashboard-overlay);
  backdrop-filter: blur(1px);
  z-index: 70;
}

.dashboard-sider {
  width: 268px;
  height: 100vh;
  flex-shrink: 0;
  border-right: 1px solid var(--dashboard-line);
  background: var(--dashboard-sider-bg);
  transition:
    width 0.25s ease,
    transform 0.25s ease;
  overflow: hidden;
}

.dashboard-sider.collapsed {
  width: 76px;
}

.dashboard-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.dashboard-dev-mode {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 12px;
  color: var(--dashboard-primary-700);
  background: #dbeafe;
  border-bottom: 1px solid #bfdbfe;

  .label {
    font-weight: 700;
  }
}

.dashboard-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
}

@media (max-width: 991px) {
  .dashboard-sider {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 276px;
    transform: translateX(-100%);
    z-index: 80;
    border-right: none;
    box-shadow: 0 20px 45px var(--dashboard-shadow);
  }

  .dashboard-sider.mobile-open {
    transform: translateX(0);
  }

  .dashboard-content {
    padding: 12px;
  }
}
</style>
