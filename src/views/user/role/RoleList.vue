<script setup lang="ts">
import { CONFIG } from '@/config'
import { Role, RoleApi } from '@/modules/role'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import VueButton from '../../../common/VueButton.vue'
import VuePagination from '../../../common/VuePagination.vue'
import VueTag from '../../../common/VueTag.vue'
import { IconApartment, IconForm } from '../../../common/icon-antd'
import { InputSelect } from '../../../common/vue-form'
import { ROUTER_NAME } from '@/router/router_name.ts'

const roleList = ref<Role[]>([])

const dataLoading = ref(false)

const page = ref(1)
const limit = ref(Number(localStorage.getItem('DISTRIBUTOR_PAGINATION_LIMIT')) || 10)
const total = ref(0)

const router = useRouter()

const activeRoleCount = computed(
  () => roleList.value.filter((role) => Boolean(role.isActive)).length,
)

const startFetchData = async (options?: { refetch?: boolean }) => {
  try {
    dataLoading.value = true
    const paginationResponse = await RoleApi.pagination({
      relation: { userRoleList: { user: true } },
      page: page.value,
      limit: limit.value,
      sort: { id: 'ASC' },
    })
    roleList.value = paginationResponse.roleList
    total.value = paginationResponse.total
  } catch (error) {
    console.log('🚀 ~ file: RoleList.vue:35 ~ startFetchData ~ error:', error)
  } finally {
    dataLoading.value = false
  }
}

onBeforeMount(async () => {
  await startFetchData({ refetch: true })
})

const changePagination = async (options: { page?: number; limit?: number }) => {
  if (options.page) page.value = options.page
  if (options.limit) {
    limit.value = options.limit
    localStorage.setItem('DISTRIBUTOR_PAGINATION_LIMIT', String(options.limit))
  }
  await startFetchData({ refetch: true })
}
</script>

<template>
  <section class="admin-list-view">
    <div class="admin-hero">
      <div class="admin-hero-title">
        <div class="admin-hero-icon">
          <IconApartment />
        </div>
        <div>
          <h1>Danh sách vai trò</h1>
          <p>Quản lý quyền hạn, phân quyền người dùng và trạng thái vận hành.</p>
        </div>
      </div>

      <div class="admin-hero-controls">
        <VueButton color="blue" icon="plus" @click="router.push({ name: ROUTER_NAME.ROLE_UPSERT })">
          Thêm vai trò
        </VueButton>
      </div>
    </div>

    <div class="admin-summary-grid">
      <article class="admin-summary-card">
        <span>Tổng vai trò</span>
        <strong>{{ total }}</strong>
      </article>
      <article class="admin-summary-card">
        <span>Đang hiển thị</span>
        <strong>{{ roleList.length }}</strong>
      </article>
      <article class="admin-summary-card">
        <span>Đang hoạt động</span>
        <strong>{{ activeRoleCount }}</strong>
      </article>
    </div>

    <div class="admin-table-card">
      <div class="admin-table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th v-if="CONFIG.MODE === 'development'" class="admin-debug-col">ID</th>
              <th>Mã vai trò</th>
              <th>Tên vai trò</th>
              <th>Tài khoản</th>
              <th class="admin-status-col">Trạng thái</th>
              <th class="admin-action-col">Sửa</th>
            </tr>
          </thead>

          <tbody v-if="dataLoading">
            <tr v-for="row in 6" :key="`loading-${row}`" class="admin-loading-row">
              <td :colspan="CONFIG.MODE === 'development' ? 6 : 5">
                <div class="admin-loading-line"></div>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr v-if="roleList.length === 0">
              <td :colspan="CONFIG.MODE === 'development' ? 6 : 5" class="admin-empty-cell">
                Không có dữ liệu vai trò.
              </td>
            </tr>

            <tr v-for="role in roleList" :key="role.id" class="body-row">
              <td v-if="CONFIG.MODE === 'development'" class="admin-id-col">#{{ role.id }}</td>
              <td class="admin-code-col">{{ role.roleCode || '-' }}</td>
              <td class="admin-name-col">{{ role.name }}</td>
              <td class="admin-user-col">
                {{ role.userRoleList?.map((i) => i.user?.fullName).join(', ') || '-' }}
              </td>
              <td class="admin-status-col">
                <VueTag v-if="role.isActive" icon="check" color="green">Active</VueTag>
                <VueTag v-else icon="minus" color="orange">Inactive</VueTag>
              </td>
              <td class="admin-action-col">
                <button
                  type="button"
                  class="admin-action-edit"
                  @click="router.push({ name: ROUTER_NAME.ROLE_UPSERT, params: { id: role.id } })"
                >
                  <IconForm />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="admin-table-footer">
        <div class="admin-footer-meta">Hiển thị {{ roleList.length }} / {{ total }} vai trò</div>
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
