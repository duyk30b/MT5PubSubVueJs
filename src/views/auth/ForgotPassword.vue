<script setup lang="ts">
import { ROUTER_NAME } from '@/router/router_name'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AlertStore } from '../../common/vue-alert/vue-alert.store'
import { InputText } from '../../common/vue-form'
import VueButton from '../../common/VueButton.vue'

const router = useRouter()

const formState = reactive({
  email: '',
  username: '',
})

const loading = ref(false)

const startSendEmail = async () => {
  try {
    loading.value = true
    AlertStore.addSuccess('Gửi email kích hoạt thành công, vui lòng kiểm tra email !')
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
    <p class="panel-kicker">Khôi phục mật khẩu</p>
    <h2>Quên mật khẩu?</h2>
    <p class="panel-description">Nhập email và tài khoản để nhận hướng dẫn tạo mật khẩu mới.</p>

    <form class="auth-form" @submit.prevent="startSendEmail">
      <label class="field-label" for="forgot-email">Email</label>
      <InputText
        id="forgot-email"
        v-model:value="formState.email"
        name="email"
        type="email"
        placeholder="Nhập email"
        autocomplete="on"
        required
      />

      <label class="field-label" for="forgot-username">Tài khoản</label>
      <InputText
        id="forgot-username"
        v-model:value="formState.username"
        name="username"
        placeholder="Nhập tài khoản"
        required
      />

      <button class="auth-link" type="button" @click="router.push({ name: ROUTER_NAME.LOGIN })">
        Quay lại đăng nhập
      </button>

      <VueButton class="submit-btn" color="blue" size="large" type="submit" :loading="loading">
        Gửi email khôi phục
      </VueButton>
    </form>

    <p class="panel-note">
      Nếu chưa nhận được email, vui lòng kiểm tra spam hoặc thử lại sau vài phút.
    </p>
  </section>
</template>
