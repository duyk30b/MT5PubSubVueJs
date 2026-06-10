<script setup lang="ts">
import { AlertStore } from '@/common/vue-alert/vue-alert.store.ts'
import { ROUTER_NAME } from '@/router/router_name.ts'
import { useAuthStore } from '@/stores/auth.store.ts'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { InputPassword, InputText } from '../../common/vue-form'
import VueButton from '../../common/VueButton.vue'

const router = useRouter()

const authStore = useAuthStore()

const formState = reactive({
  username: '',
  password: '',
})

const loading = ref(false)

const startLogin = async () => {
  try {
    loading.value = true
    await authStore.login({
      username: formState.username,
      password: formState.password,
    })
    router.push({ name: ROUTER_NAME.HOME })
  } catch (error: any) {
    AlertStore.addError(error.message || 'Đăng nhập thất bại')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-panel">
    <p class="panel-kicker">Đăng nhập tài khoản</p>
    <h2>Chào mừng bạn quay lại</h2>
    <p class="panel-description">Vui lòng điền thông tin để truy cập hệ thống quản trị.</p>

    <form class="auth-form" @submit.prevent="startLogin">
      <label class="field-label" for="username">Tài khoản</label>
      <InputText
        id="username"
        v-model:value="formState.username"
        name="username"
        placeholder="Nhập tài khoản"
        autocomplete="on"
        required
      />

      <label class="field-label" for="password">Mật khẩu</label>
      <InputPassword
        id="password"
        v-model:value="formState.password"
        name="password"
        placeholder="Nhập mật khẩu"
        autocomplete="on"
        required
      />

      <button
        class="auth-link"
        type="button"
        @click="router.push({ name: ROUTER_NAME.FORGOT_PASSWORD })"
      >
        Quên mật khẩu?
      </button>

      <VueButton class="submit-btn" color="blue" size="large" type="submit" :loading="loading">
        Đăng nhập
      </VueButton>
    </form>

    <p class="panel-note">Hệ thống tối ưu cho desktop và mobile, hỗ trợ chế độ sáng/tối.</p>
  </section>
</template>
