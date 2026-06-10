<script setup lang="ts">
import { VueButton, VueTag } from '@/common'
import { IconRight } from '@/common/icon-antd'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import { InputCheckboxList, InputText, VueSwitch } from '@/common/vue-form'
import type { CheckboxOptionType } from '@/common/vue-form/InputCheckboxList.vue'
import VueModal from '@/common/vue-modal/VueModal.vue'
import { ModalStore } from '@/common/vue-modal/vue-modal.store'
import { VueTabMenu, VueTabPanel, VueTabs } from '@/common/vue-tabs'
import { CONFIG } from '@/config'
import { Permission } from '@/modules/permission'
import { Role } from '@/modules/role'
import { useGlobalStore } from '@/stores/global.store.ts'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const TABS_KEY = {
  ROLE_INFORMATION: 'ROLE_INFORMATION',
  ROLE_PERMISSION: 'ROLE_PERMISSION',
}

const activeTab = ref(TABS_KEY.ROLE_INFORMATION)

const globalStore = useGlobalStore()
const { isMobile } = globalStore

const route = useRoute()
const router = useRouter()

const role = ref<Role>(Role.blank())
const checkboxUserId = ref<Record<string, boolean>>({})
const checkboxUserIdOptions = ref<CheckboxOptionType[]>([])
const permissionAllTree = ref<Permission[]>([])
const showModalAddUser = ref(false)
const modalUserSearch = ref('')
const modalUserCheckedMap = ref<Record<string, boolean>>({})

const randomId = computed(() => {
  return Math.random().toString(36).substring(2)
})

type Level1Checked = {
  permission: Permission
  checkedAll: boolean
  indeterminate: boolean
  level2Map: Record<string, boolean>
}

const checkedOptions = reactive<{
  checkedAll: boolean
  indeterminate: boolean
  level1Map: Record<string, Level1Checked>
}>({ checkedAll: false, indeterminate: false, level1Map: {} })

const saveLoading = ref(false)

const selectedUserOptions = computed(() => {
  return checkboxUserIdOptions.value.filter((option) => Boolean(checkboxUserId.value[option.key]))
})

const selectedUserCount = computed(() => selectedUserOptions.value.length)

const modalFilteredUserOptions = computed(() => {
  const keyword = modalUserSearch.value.trim().toLowerCase()
  if (!keyword) return checkboxUserIdOptions.value
  return checkboxUserIdOptions.value.filter((option) =>
    option.label.toLowerCase().includes(keyword),
  )
})

const modalSelectedCount = computed(() => {
  return checkboxUserIdOptions.value.filter((option) =>
    Boolean(modalUserCheckedMap.value[option.key]),
  ).length
})

const startFetchPermission = async (roleId?: number) => {}

onBeforeMount(async () => {
  const roleId = Number(route.params.id)
  try {
    startFetchPermission(roleId)
  } catch (error) {
    console.log('🚀 ~ RoleUpsertContainer.vue:96 ~ onBeforeMount ~ error:', error)
  }
})

const handleSave = async () => {
  saveLoading.value = true
  try {
    router.push({ name: 'RoleList' })
  } catch (error: any) {
    AlertStore.addError(error.message)
    console.log('🚀 ~ handleSave ~ error:', error)
  } finally {
    saveLoading.value = false
  }
}

const clickDelete = () => {
  ModalStore.confirm({
    title: 'Bạn có chắc chắn muốn xóa vai trò này',
    content: 'Vai trò đã xóa không thể khôi phục lại được. Bạn vẫn muốn xóa ?',
    async onOk() {
      try {
        router.push({ name: 'RoleList' })
      } catch (error) {
        console.log('🚀 ~ file: RoleUpsert.vue:82 ~ onOk ~ error:', error)
      }
    },
  })
}

const openModalAddUser = () => {
  modalUserSearch.value = ''
  modalUserCheckedMap.value = JSON.parse(JSON.stringify(checkboxUserId.value || {}))
  showModalAddUser.value = true
}

const closeModalAddUser = () => {
  showModalAddUser.value = false
}

const confirmModalAddUser = () => {
  checkboxUserId.value = JSON.parse(JSON.stringify(modalUserCheckedMap.value || {}))
  showModalAddUser.value = false
}

const refreshRootChecked = () => {
  const level1Values = Object.values(checkedOptions.level1Map)
  const hasCheckedAll = level1Values.every((i) => i.checkedAll)
  const noCheckedAll = level1Values.every((i) => !i.checkedAll)
  if (hasCheckedAll) {
    checkedOptions.checkedAll = true
    checkedOptions.indeterminate = false
  } else if (noCheckedAll) {
    checkedOptions.checkedAll = false
    checkedOptions.indeterminate = false
  } else {
    checkedOptions.checkedAll = false
    checkedOptions.indeterminate = true
  }
}

const refreshLevel1Checked = (level1Id: number) => {
  const level1Current = checkedOptions.level1Map[level1Id]

  const level2Values = Object.values(level1Current.level2Map)

  const hasCheckedAll = level2Values.every((i) => i)
  const noCheckedAll = level2Values.every((i) => !i)

  if (hasCheckedAll) {
    level1Current.checkedAll = true
    level1Current.indeterminate = false
  } else if (noCheckedAll) {
    level1Current.checkedAll = false
    level1Current.indeterminate = false
  } else {
    level1Current.checkedAll = false
    level1Current.indeterminate = true
  }
}

const handleChangeCheckAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  const checked = target.checked
  Object.values(checkedOptions.level1Map).forEach((level1) => {
    level1.checkedAll = checked
    level1.indeterminate = false
    Object.keys(level1.level2Map).forEach((c) => (level1.level2Map[c] = checked))
  })
}

const handleChangeCheckLevel1 = (e: Event, level1Id: number) => {
  const target = e.target as HTMLInputElement
  const checked = target.checked

  checkedOptions.level1Map[level1Id].checkedAll = checked
  checkedOptions.level1Map[level1Id].indeterminate = false

  const level2Map = checkedOptions.level1Map[level1Id].level2Map
  Object.keys(level2Map).forEach((key) => (level2Map[key] = checked))

  refreshRootChecked()
}

const handleChangeCheckLevel2 = (e: Event, level1Id: number, level2Id: number) => {
  const target = e.target as HTMLInputElement
  checkedOptions.level1Map[level1Id].level2Map[level2Id] = target.checked

  refreshLevel1Checked(level1Id)
  refreshRootChecked()
}
</script>

<template>
  <section class="role-upsert-view">
    <div class="role-upsert-hero">
      <div class="hero-left">
        <div class="hero-crumb">
          <Breadcrumb />
          <IconRight class="hero-crumb-icon" />
          <span>{{ role.name || 'Vai trò mới' }}</span>
        </div>
        <h1>{{ route.params.id ? 'Cập nhật vai trò' : 'Tạo vai trò mới' }}</h1>
        <p>Tùy chỉnh thông tin, gán tài khoản và cấu hình quyền truy cập cho vai trò.</p>
      </div>
      <div class="hero-right">
        <VueTag color="blue">{{ selectedUserCount }} user</VueTag>
      </div>
    </div>

    <form class="role-upsert-form" @submit.prevent="handleSave">
      <VueTabs v-model:tabShow="activeTab">
        <template #menu>
          <VueTabMenu :tabKey="TABS_KEY.ROLE_INFORMATION">Cài đặt chung</VueTabMenu>
          <VueTabMenu :tabKey="TABS_KEY.ROLE_PERMISSION">Phân quyền vai trò</VueTabMenu>
        </template>
        <template #panel>
          <VueTabPanel :tabKey="TABS_KEY.ROLE_INFORMATION">
            <div class="role-info-grid">
              <div class="role-input-row" :class="isMobile ? 'mobile' : ''">
                <div class="role-label">Tên vai trò</div>
                <InputText v-model:value="role.name" required />
              </div>
              <div class="role-input-row" :class="isMobile ? 'mobile' : ''">
                <div class="role-label">Mã vai trò</div>
                <InputText v-model:value="role.roleCode" placeholder="Tạo tự động" />
              </div>
              <div class="role-input-row align-center">
                <div class="role-label">Active</div>
                <div class="role-switch-wrap">
                  <VueSwitch v-model="role.isActive" type-parser="number" />
                </div>
                <div v-if="!role.isActive" class="role-inactive-note">
                  Tất cả user thuộc vai trò này tạm thời bị khóa
                </div>
              </div>

              <div class="role-input-row top-align">
                <div class="role-label">Tài khoản</div>
                <div class="role-user-box">
                  <div class="role-user-head">
                    <p>Đã chọn {{ selectedUserCount }} tài khoản</p>
                    <VueButton type="button" color="cyan" icon="plus" @click="openModalAddUser">
                      Thêm user
                    </VueButton>
                  </div>

                  <div class="role-user-tags" v-if="selectedUserOptions.length">
                    <VueTag
                      v-for="userOption in selectedUserOptions"
                      :key="String(userOption.key)"
                      color="blue"
                    >
                      {{ userOption.label }}
                    </VueTag>
                  </div>

                  <div v-else class="role-user-empty">Chưa chọn user nào cho vai trò này.</div>

                  <div v-if="CONFIG.MODE === 'development'" class="role-dev-json">
                    {{ JSON.stringify(checkboxUserId) }}
                  </div>
                </div>
              </div>
            </div>
          </VueTabPanel>
          <VueTabPanel :tabKey="TABS_KEY.ROLE_PERMISSION">
            <div class="role-permission-wrap">
              <div class="role-permission-title">
                <div>
                  Phân quyền vai trò
                  <span v-if="CONFIG.MODE === 'development'" class="role-dev-json">
                    {{ role.permissionIds }}
                  </span>
                </div>
              </div>

              <div class="table-wrapper role-permission-table">
                <table>
                  <thead>
                    <tr>
                      <th style="width: 30px">
                        <div class="flex justify-center">
                          <input
                            style="cursor: pointer"
                            type="checkbox"
                            :checked="checkedOptions.checkedAll"
                            :indeterminate="checkedOptions.indeterminate"
                            @change="(e) => handleChangeCheckAll(e)"
                          />
                        </div>
                      </th>
                      <th class="text-center" colspan="2">Vai trò</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="level1 in permissionAllTree" :key="level1.id">
                      <tr style="user-select: none">
                        <td class="text-center">
                          <div class="flex justify-center">
                            <input
                              :id="randomId + '_' + level1.id"
                              style="cursor: pointer"
                              :indeterminate="checkedOptions.level1Map[level1.id].indeterminate"
                              :checked="checkedOptions.level1Map[level1.id].checkedAll"
                              type="checkbox"
                              @change="(e) => handleChangeCheckLevel1(e, level1.id)"
                            />
                          </div>
                        </td>
                        <td colspan="2" class="font-medium">
                          <label
                            style="cursor: pointer; user-select: none"
                            :for="randomId + '_' + level1.id"
                          >
                            <span>{{ level1.name }}</span>
                            <span v-if="CONFIG.MODE === 'development'" style="color: violet">
                              - {{ level1.id }}
                            </span>
                          </label>
                        </td>
                      </tr>
                      <template v-for="child in level1.children" :key="child.id">
                        <tr style="user-select: none">
                          <td></td>
                          <td class="text-center" style="width: 30px">
                            <div class="flex justify-center">
                              <input
                                :id="randomId + '_' + child.id"
                                style="cursor: pointer"
                                :checked="
                                  checkedOptions.level1Map[level1.id].level2Map[child.id] ||
                                  checkedOptions.level1Map[level1.id].checkedAll
                                "
                                type="checkbox"
                                @change="(e) => handleChangeCheckLevel2(e, level1.id, child.id)"
                              />
                            </div>
                          </td>
                          <td>
                            <label
                              style="cursor: pointer; user-select: none"
                              :for="randomId + '_' + child.id"
                            >
                              <span>{{ child.name }}</span>
                              <span v-if="CONFIG.MODE === 'development'" style="color: violet">
                                - {{ child.id }}
                              </span>
                            </label>
                          </td>
                        </tr>
                      </template>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </VueTabPanel>
        </template>
      </VueTabs>

      <div class="role-submit-row">
        <VueButton color="red" type="button" @click="clickDelete">Xóa</VueButton>
        <VueButton color="blue" type="submit" :loading="saveLoading" icon="save">
          Lưu lại
        </VueButton>
      </div>
    </form>

    <VueModal v-model:show="showModalAddUser" :style="{ width: '760px' }">
      <div class="role-user-modal">
        <div class="role-user-modal-head">
          <div>
            <h3>Thêm user vào vai trò</h3>
            <p>Chọn tài khoản cần gán cho vai trò này.</p>
          </div>
          <VueTag color="blue">{{ modalSelectedCount }} đã chọn</VueTag>
        </div>

        <div class="role-user-modal-search">
          <InputText v-model:value="modalUserSearch" placeholder="Tìm theo tên user..." />
        </div>

        <div class="role-user-modal-options">
          <InputCheckboxList
            v-model:value="modalUserCheckedMap"
            :options="modalFilteredUserOptions"
            :checkbox-all="true"
          />
        </div>

        <div class="role-user-modal-footer">
          <VueButton type="button" @click="closeModalAddUser">Hủy</VueButton>
          <VueButton type="button" color="blue" @click="confirmModalAddUser">Xác nhận</VueButton>
        </div>
      </div>
    </VueModal>
  </section>
</template>

<style scoped lang="scss">
.role-upsert-view {
  display: grid;
  gap: 16px;
  padding: 0;
}

.role-upsert-hero {
  border: 1px solid var(--dashboard-line);
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--dashboard-primary-800) 90%, #ffffff 10%) 0%,
    color-mix(in srgb, var(--dashboard-primary-600) 86%, #ffffff 14%) 100%
  );
  color: #eff6ff;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

html.theme-dark .role-upsert-hero {
  background: linear-gradient(120deg, #122138 0%, #1d3150 100%);
}

.hero-crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  margin-bottom: 8px;
  opacity: 0.95;
}

.hero-crumb-icon {
  font-size: 0.72rem;
  opacity: 0.8;
}

.hero-left h1 {
  margin: 0;
  font-size: clamp(1.15rem, 1rem + 0.5vw, 1.5rem);
}

.hero-left p {
  margin: 6px 0 0;
  color: rgba(239, 246, 255, 0.9);
}

.hero-right {
  display: flex;
  align-items: center;
}

.role-upsert-form {
  background: var(--dashboard-panel);
  border: 1px solid var(--dashboard-line);
  border-radius: 16px;
  padding: 16px;
}

.role-info-grid {
  max-width: 900px;
  margin-top: 12px;
  display: grid;
  gap: 14px;
}

.role-input-row {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.role-input-row.mobile {
  grid-template-columns: 1fr;
}

.role-input-row.top-align {
  align-items: flex-start;
}

.role-input-row.align-center {
  align-items: center;
}

.role-label {
  color: var(--dashboard-text-soft);
  font-weight: 600;
}

.role-switch-wrap {
  display: inline-flex;
}

.role-inactive-note {
  margin-left: 12px;
  color: #f59e0b;
  font-size: 0.9rem;
}

html.theme-dark .role-inactive-note {
  color: #fbbf24;
}

.role-user-box {
  border: 1px solid var(--dashboard-line);
  border-radius: 12px;
  padding: 12px;
  background: color-mix(in srgb, var(--dashboard-panel) 90%, var(--dashboard-bg) 10%);
  display: grid;
  gap: 12px;
}

.role-user-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.role-user-head p {
  margin: 0;
  color: var(--dashboard-text-soft);
}

.role-user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-user-empty {
  border: 1px dashed var(--dashboard-line);
  border-radius: 10px;
  padding: 16px;
  color: var(--dashboard-text-soft);
  text-align: center;
}

.role-dev-json {
  color: #c084fc;
  font-size: 0.84rem;
}

.role-permission-wrap {
  margin-top: 14px;
}

.role-permission-title {
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  color: var(--dashboard-text);
}

.role-permission-table {
  margin-top: 14px;
  max-height: 620px;
  border-bottom: 1px solid var(--dashboard-line);
}

.role-submit-row {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.role-user-modal {
  background: var(--dashboard-panel);
  border: 1px solid var(--dashboard-line);
  border-radius: 14px;
  overflow: hidden;
}

.role-user-modal-head {
  padding: 14px 16px;
  border-bottom: 1px solid var(--dashboard-line);
  background: color-mix(in srgb, var(--dashboard-panel) 74%, var(--dashboard-primary-500) 26%);
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.role-user-modal-head h3 {
  margin: 0;
  color: var(--dashboard-text);
}

.role-user-modal-head p {
  margin: 4px 0 0;
  color: var(--dashboard-text-soft);
  font-size: 0.9rem;
}

.role-user-modal-search {
  padding: 12px 16px;
}

.role-user-modal-options {
  padding: 0 16px 8px;
  max-height: 400px;
  overflow: auto;
}

.role-user-modal-footer {
  padding: 12px 16px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 768px) {
  .role-upsert-view {
    padding: 0;
  }

  .role-upsert-hero {
    flex-direction: column;
  }

  .role-input-row {
    grid-template-columns: 1fr;
  }

  .role-submit-row {
    justify-content: stretch;

    :deep(button) {
      flex: 1;
    }
  }
}
</style>
