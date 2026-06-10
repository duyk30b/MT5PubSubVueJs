<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.ts'
import VueLayout from './_layout/VueLayout.vue'
import { ROUTER_NAME } from '@/router/router_name.ts'

const router = useRouter()
const authStore = useAuthStore()
const loaded = ref(false)

watch(
  () => authStore.user,
  (newUser) => {
    if (!newUser.id) {
      router.push({ name: ROUTER_NAME.LOGIN })
    }
  },
  // { immediate: true } // Không để immediate vì mới vào thì user.id = 0
)

onBeforeMount(async () => {
  loaded.value = false
  try {
    await authStore.initMeData()
  } catch (error) {
    console.log('🚀 ~ file: AppContainer.vue:26 ~ onBeforeMount ~ error:', error)
  } finally {
    loaded.value = true
  }
})
</script>

<template>
  <VueLayout v-if="loaded">
    <RouterView />
  </VueLayout>
</template>

<style></style>
