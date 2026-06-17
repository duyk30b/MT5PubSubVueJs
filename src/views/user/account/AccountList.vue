<script setup lang="ts">
import { CONFIG } from '@/config'
import BugDevelopment from '@/views/component/BugDevelopment.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { IconApartment, IconForm } from '../../../common/icon-antd'
import { InputSelect } from '../../../common/vue-form'
import VueButton from '../../../common/VueButton.vue'
import VuePagination from '../../../common/VuePagination.vue'
import VueTag from '../../../common/VueTag.vue'
import { UserApi, type User } from '../../../modules/user'
import ModalAccountUpsert from './ModalAccountUpsert.vue'

const modalAccountUpsert = ref<InstanceType<typeof ModalAccountUpsert>>()

const userList = ref<User[]>([])

const dataLoading = ref(false)

const page = ref(1)
const limit = ref(Number(localStorage.getItem('DISTRIBUTOR_PAGINATION_LIMIT')) || 10)
const total = ref(0)

const activeUserCount = computed(() => userList.value.filter((user) => user.isActive).length)

const startFetchData = async (options?: { refetch?: boolean }) => {
  try {
    const paginationResponse = await UserApi.pagination({
      relation: {
        userRoleList: { role: true },
        userRoomList: { room: true },
      },
      page: page.value,
      limit: limit.value,
      sort: { id: 'ASC' },
    })
    userList.value = paginationResponse.userList
    total.value = paginationResponse.total
  } catch (error) {
    console.log('🚀 ~ file: AccountList.vue:37 ~ startFetchData ~ error:', error)
  }
}

onBeforeMount(async () => {
  try {
    dataLoading.value = true
    await startFetchData({ refetch: true })
  } catch (error) {
    console.log('🚀 ~ onBeforeMount ~ error:', error)
  } finally {
    dataLoading.value = false
  }
})

const changePagination = async (options: { page?: number; limit?: number }) => {
  if (options.page) page.value = options.page
  if (options.limit) {
    limit.value = options.limit
    localStorage.setItem('DISTRIBUTOR_PAGINATION_LIMIT', String(options.limit))
  }
  await startFetchData({ refetch: true })
}

const handleModalAccountUpsertSuccess = async (
  data: User,
  type: 'CREATE' | 'UPDATE' | 'DELETE',
) => {
  await startFetchData({ refetch: true })
}

const deviceLogout = async (userId: number, clientId: string) => {
  const result = await UserApi.deviceLogout(userId, clientId)
  await startFetchData()
}
</script>

<template>
  <ModalAccountUpsert ref="modalAccountUpsert" @success="handleModalAccountUpsertSuccess" />

  <section class="admin-list-view">
    <div class="admin-hero">
      <div class="admin-hero-title">
        <div class="admin-hero-icon">
          <IconApartment />
        </div>
        <div>
          <h1>Danh sách tài khoản</h1>
          <p>Quản lý người dùng, vai trò và trạng thái hoạt động trong hệ thống.</p>
        </div>
      </div>

      <div class="admin-hero-controls">
        <VueButton color="blue" icon="plus" @click="modalAccountUpsert?.openModal()">
          Thêm tài khoản
        </VueButton>
      </div>
    </div>

    <div class="admin-summary-grid">
      <article class="admin-summary-card">
        <span>Tổng tài khoản</span>
        <strong>{{ total }}</strong>
      </article>
      <article class="admin-summary-card">
        <span>Đang hiển thị</span>
        <strong>{{ userList.length }}</strong>
      </article>
      <article class="admin-summary-card">
        <span>Đang hoạt động</span>
        <strong>{{ activeUserCount }}</strong>
      </article>
    </div>

    <div class="admin-table-card">
      <div class="admin-table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th v-if="CONFIG.MODE === 'development'" class="admin-debug-col"></th>
              <th style="text-align: center">ID</th>
              <th>Username</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th class="admin-status-col" style="text-align: center">Trạng thái</th>
              <th class="admin-action-col">Sửa</th>
            </tr>
          </thead>

          <tbody v-if="dataLoading">
            <tr v-for="row in 6" :key="`loading-${row}`" class="admin-loading-row">
              <td :colspan="CONFIG.MODE === 'development' ? 7 : 6">
                <div class="admin-loading-line"></div>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-if="userList.length === 0">
              <td :colspan="CONFIG.MODE === 'development' ? 7 : 6" class="admin-empty-cell">
                Không có dữ liệu tài khoản.
              </td>
            </tr>

            <tr v-for="user in userList" :key="user.id" class="body-row">
              <td v-if="CONFIG.MODE === 'development'" class="admin-debug-col">
                <BugDevelopment :data="user" />
              </td>
              <td class="admin-id-col">#{{ user.id }}</td>
              <td class="admin-username-col">{{ user.username }}</td>
              <td class="admin-name-col">{{ user.fullName }}</td>
              <td class="admin-role-col">
                {{ user.userRoleList?.map((i) => i.role?.name).join(', ') || '-' }}
              </td>
              <td class="admin-status-col">
                <VueTag v-if="user.isActive" icon="check" color="green">Active</VueTag>
                <VueTag v-else icon="minus" color="orange">Inactive</VueTag>
              </td>
              <td class="admin-action-col">
                <button
                  type="button"
                  class="admin-action-edit"
                  @click="modalAccountUpsert?.openModal(user.id)"
                >
                  <IconForm />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="admin-table-footer">
        <div class="admin-footer-meta">Hiển thị {{ userList.length }} / {{ total }} tài khoản</div>
        <div class="admin-footer-controls">
          <InputSelect
            v-model:value="limit"
            @update:value="(l: any) => changePagination({ page, limit: l })"
            :options="[
              { value: 10, label: '10 / page' },
              { value: 20, label: '20 / page' },
              { value: 50, label: '50 / page' },
              { value: 100, label: '100 / page' },
            ]"
          />
          <VuePagination
            v-model:page="page"
            :total="total"
            :limit="limit"
            @update:page="(p: any) => changePagination({ page: p, limit })"
          />
        </div>
      </div>
    </div>
  </section>
</template>
