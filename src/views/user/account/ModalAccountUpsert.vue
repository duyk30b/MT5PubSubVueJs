<script setup lang="ts">
import VueButton from '@/common/VueButton.vue'
import { IconClose } from '@/common/icon-antd'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import { InputPassword, InputText, VueSwitch } from '@/common/vue-form'
import VueModal from '@/common/vue-modal/VueModal.vue'
import { ModalStore } from '@/common/vue-modal/vue-modal.store'
import { CONFIG } from '@/config'
import { User, UserApi } from '@/modules/user'
import { ESArray } from '@/utils'
import InputCheckboxRoleList from '@/views/component/InputCheckboxRoleList.vue'
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'success', value: User, type: 'CREATE' | 'UPDATE' | 'DELETE'): void
}>()

const userOrigin = ref<User>(User.blank())
const user = ref<User>(User.blank())

const username = ref('')
const password = ref('')

const roleIdListOrigin = ref<number[]>([])
const roleIdList = ref<number[]>([])

const showModal = ref(false)
const saveLoading = ref(false)

const hasChangeRoleIdList = computed(() => {
  if (!ESArray.equal(roleIdListOrigin.value, roleIdList.value)) {
    return true
  }
  return false
})

const hasChangeAccount = computed(() => {
  if (username.value !== user.value.username || password.value) {
    return true
  }
  return false
})

const hasChangeData = computed(() => {
  if (!User.equal(userOrigin.value, user.value)) {
    return true
  }
  if (hasChangeRoleIdList.value) {
    return true
  }
  if (hasChangeAccount.value) {
    return true
  }
  return false
})

const openModal = async (userId?: number) => {
  showModal.value = true
  try {
    if (userId) {
      userOrigin.value = await UserApi.detail(userId, {
        relation: { userRoleList: { role: false } },
      })
      roleIdListOrigin.value = (userOrigin.value.userRoleList || []).map((i) => i.roleId)
    } else {
      userOrigin.value = User.blank()
      roleIdListOrigin.value = []
    }

    user.value = User.from(userOrigin.value)
    username.value = user.value.username
    password.value = ''
    roleIdList.value = [...roleIdListOrigin.value]
  } catch (e: any) {
    console.log('🚀 ~ ModalAccountUpsert.vue:39 ~ openModal ~ e:', e)
    AlertStore.addError(e.message)
  }
}

const closeModal = () => {
  user.value = User.blank()
  showModal.value = false
}

const handleSave = async () => {
  saveLoading.value = true

  try {
    if (!user.value.id) {
      const response = await UserApi.createOne({
        user: user.value,
        account: { username: username.value, password: password.value },
        roleIdList: roleIdList.value,
      })
      emit('success', response, 'CREATE')
    } else {
      const response = await UserApi.updateOne(user.value.id, {
        user: user.value,
        account: hasChangeAccount.value
          ? { username: username.value, password: password.value }
          : undefined,
        roleIdList: hasChangeRoleIdList.value ? roleIdList.value : undefined,
      })
      emit('success', response, 'UPDATE')
    }
    closeModal()
  } catch (error) {
    console.log('🚀 ~ file: ModalAccountUpsert.vue:42 ~ handleSave ~ error:', error)
  } finally {
    saveLoading.value = false
  }
}

const handleDestroy = async () => {
  try {
    emit('success', user.value, 'DELETE')
    closeModal()
  } catch (error) {
    console.log('🚀 ~ file: ModalAccountUpsert.vue:75 ~ handleDestroy ~ error:', error)
  }
}

const clickDestroy = () => {
  ModalStore.confirm({
    title: 'Bạn có chắc chắn muốn xóa tài khoản này',
    content: 'Tài khoản đã xóa không thể khôi phục lại được. Bạn vẫn muốn xóa ?',
    async onOk() {
      await handleDestroy()
    },
  })
}

defineExpose({ openModal })
</script>

<template>
  <VueModal v-model:show="showModal">
    <form class="account-upsert-modal" @submit.prevent="handleSave">
      <div class="account-upsert-head">
        <div class="account-upsert-title">
          {{ user.id ? 'Cập nhật thông tin tài khoản' : 'Tạo tài khoản mới' }}
        </div>
        <button type="button" class="account-upsert-close" @click="closeModal">
          <IconClose />
        </button>
      </div>

      <div class="account-upsert-body">
        <div class="account-field">
          <div class="field-label">Username</div>
          <InputText v-model:value="username" required />
        </div>

        <div class="account-field">
          <div class="field-label">Password</div>
          <InputPassword v-model:value="password" placeholder="**********" />
        </div>

        <div class="account-field">
          <div class="field-label">Tên hiển thị</div>
          <InputText v-model:value="user.fullName" required />
        </div>

        <div class="account-role-wrap">
          <div class="account-role-label">
            <div class="field-label">Vai trò</div>
            <div v-if="CONFIG.MODE === 'development'" class="field-dev">
              {{ JSON.stringify(roleIdList) }}
            </div>
          </div>
          <div class="account-role-box">
            <InputCheckboxRoleList v-model:roleIdList="roleIdList" :checkboxAll="false" />
          </div>
        </div>

        <div class="account-active-wrap">
          <div class="field-label">Active</div>
          <div class="active-switch">
            <VueSwitch v-model="user.isActive" type-parser="number" />
          </div>
          <div v-if="!user.isActive" class="active-note">
            Tài khoản này tạm thời không thể sử dụng
          </div>
        </div>
      </div>

      <div class="account-upsert-footer">
        <div class="footer-actions">
          <VueButton color="red" icon="trash" :loading="saveLoading" @click="clickDestroy">
            Xóa
          </VueButton>
          <VueButton icon="close" type="reset" class="ml-auto" @click="closeModal">
            Hủy bỏ
          </VueButton>
          <VueButton
            color="blue"
            type="submit"
            :loading="saveLoading"
            icon="save"
            :disabled="!hasChangeData"
          >
            Lưu lại
          </VueButton>
        </div>
      </div>
    </form>
  </VueModal>
</template>

<style scoped lang="scss">
.account-upsert-modal {
  background: var(--dashboard-panel);
  color: var(--dashboard-text);
}

.account-upsert-head {
  padding: 14px 16px;
  border-bottom: 1px solid var(--dashboard-line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: color-mix(in srgb, var(--dashboard-panel) 88%, var(--dashboard-primary-500) 12%);
}

.account-upsert-title {
  flex: 1;
  font-size: 1.05rem;
  font-weight: 700;
}

.account-upsert-close {
  width: 32px;
  height: 32px;
  border: 1px solid var(--control-border);
  border-radius: 8px;
  background: var(--control-bg);
  color: var(--control-text);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.account-upsert-body {
  padding: 14px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.account-field {
  flex-basis: 300px;
  flex-grow: 1;
  display: grid;
  gap: 6px;
}

.field-label {
  color: var(--dashboard-text-soft);
  font-weight: 600;
}

.field-dev {
  color: #c084fc;
  font-size: 0.84rem;
}

.account-role-wrap {
  flex-basis: 100%;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.account-role-box {
  border: 1px solid var(--dashboard-line);
  border-radius: 10px;
  padding: 10px;
  background: color-mix(in srgb, var(--dashboard-panel) 90%, var(--dashboard-bg) 10%);
}

.account-active-wrap {
  flex-basis: 100%;
  display: grid;
  grid-template-columns: 120px auto 1fr;
  align-items: center;
  gap: 10px;
}

.active-switch {
  display: inline-flex;
}

.active-note {
  color: #f59e0b;
  font-size: 0.92rem;
}

html.theme-dark .active-note {
  color: #fbbf24;
}

.account-upsert-footer {
  padding: 12px 16px 16px;
  border-top: 1px solid var(--dashboard-line);
}

.footer-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .account-role-wrap {
    grid-template-columns: 1fr;
  }

  .account-active-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
