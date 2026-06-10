<script setup lang="ts">
import { ROUTER_NAME } from '@/router/router_name'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VueButton from '../../common/VueButton.vue'
import { AlertStore } from '../../common/vue-alert/vue-alert.store'
import { InputPassword, InputText } from '../../common/vue-form'

const router = useRouter()
const route = useRoute()

const formState = reactive({
  username: (route.query?.username || '') as string,
  password: '',
  passwordRepeat: '',
})

const loading = ref(false)

const startResetPassword = async () => {
  try {
    loading.value = true
    if (formState.passwordRepeat !== formState.password) {
      return AlertStore.addError('Điền mật khẩu lần 2 không chính xác')
    }
    AlertStore.addSuccess('Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại để vào ứng dụng')
    router.push({ name: ROUTER_NAME.LOGIN })
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || error?.config.signal?.reason
    AlertStore.addError(message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="auth-panel">
    <p class="panel-kicker">Đặt lại mật khẩu</p>
    <h2>Tạo mật khẩu mới</h2>
    <p class="panel-description">Đảm bảo mật khẩu đủ mạnh và không trùng với mật khẩu cũ.</p>

    <form class="auth-form" @submit.prevent="startResetPassword">
      <label class="field-label" for="reset-username">Tài khoản</label>
      <InputText
        id="reset-username"
        v-model:value="formState.username"
        name="username"
        placeholder="Nhập tài khoản"
        required
      />

      <label class="field-label" for="reset-password">Mật khẩu mới</label>
      <InputPassword
        id="reset-password"
        v-model:value="formState.password"
        name="password"
        placeholder="Nhập mật khẩu mới"
        required
      />

      <label class="field-label" for="reset-password-repeat">Nhập lại mật khẩu mới</label>
      <InputPassword
        id="reset-password-repeat"
        v-model:value="formState.passwordRepeat"
        name="password-repeat"
        placeholder="Nhập lại mật khẩu mới"
        required
      />

      <button class="auth-link" type="button" @click="router.push({ name: ROUTER_NAME.LOGIN })">
        Quay lại đăng nhập
      </button>

      <VueButton class="submit-btn" color="blue" size="large" type="submit" :loading="loading">
        Cập nhật mật khẩu mới
      </VueButton>
    </form>

    <p class="panel-note">Mật khẩu nên có chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
  </section>
</template>
