<script setup lang="ts">
import VueButton from '@/common/VueButton.vue'
import {
  IconApartment,
  IconControl,
  IconExclamationCircle,
  IconForm,
  IconHome,
  IconReload
} from '@/common/icon-antd'
import { VueTooltip } from '@/common/popover'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import { VueSwitch } from '@/common/vue-form'
import { CONFIG } from '@/config'
import { MT5ProgramApi } from '@/modules/mt5_program/mt5_program.api.ts'
import type { MT5ProgramInfo } from '@/modules/mt5_program/mt5_program_info.model.ts'
import { useMt5ProgramStore } from '@/stores/mt5_program.store.ts'
import { computed, ref, watchEffect } from 'vue'
import { BugDevelopment } from './component'


const mt5ProgramStore = useMt5ProgramStore()

const realTimeEnabled = ref(true)
const keyLoading = ref<string>('')

const mt5ProgramInfoList = ref<MT5ProgramInfo[]>([])

const positionSortColumn = ref<'symbol' | 'time_msc' | 'profit' | ''>('')
const positionSortValue = ref<'ASC' | 'DESC' | ''>('')

watchEffect(() => {
  if (realTimeEnabled.value) {
    mt5ProgramInfoList.value = [...mt5ProgramStore.mt5ProgramInfoList]
    if (positionSortColumn.value && positionSortValue.value) {
      mt5ProgramInfoList.value.forEach(program => {
        if (program.data.position_list) {
          program.data.position_list.sort((a, b) => {
            const aValue = a[positionSortColumn.value] ?? 0
            const bValue = b[positionSortColumn.value] ?? 0
            if (aValue === bValue) {
              return a.time_msc > b.time_msc ? 1 : -1
            }
            if (positionSortValue.value === 'ASC') {
              return aValue > bValue ? 1 : -1
            } else {
              return aValue < bValue ? 1 : -1
            }
          })
        }
      })
    }
  }
})

const startOfToday = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
})



const formatNumber = (value: number | undefined | null) => {
  const safeValue = Number(value ?? 0)
  return (
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }).format(safeValue)
  )
}


const handleOpenTooltip = (isOpen: boolean) => {
  realTimeEnabled.value = !isOpen
}


const handleClickRefreshAll = async () => {
  keyLoading.value = 'REFRESH_ALL'
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.refreshAll()
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickClearAllLog = async () => {
  keyLoading.value = 'CLEAR_ALL_LOG'
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.clearAllLog()
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

</script>

<template>
  <ModalMT5AccountSetting ref="modalMt5AccountSettingRef" />
  <section class="flex flex-wrap gap-4">
    <div class="admin-hero-title">
      <div class="admin-hero-icon">
        <IconHome />
      </div>
      <div>
        <div class="flex gap-2 items-center flex-wrap">
          <h1>MT5 Software Instances</h1>
          <div class="flex gap-1 items-center mt-1 mt5-realtime-toggle">
            <VueSwitch v-model:modelValue="realTimeEnabled" :size="'18px'" />
            <span>Real time:</span>
            <span class="text-xs text-gray-500">
              {{ mt5ProgramStore.event_time }}
            </span class="text-xs text-gray-500">
          </div>
        </div>
      </div>
    </div>
    <div class="ml-auto flex gap-2 items-center flex-wrap">
      <VueButton size="small" color="purple" :icon="IconReload" @click="handleClickRefreshAll"
        :loading="keyLoading === 'REFRESH_ALL'">
        REFRESH ALL
      </VueButton>
      <VueButton size="small" color="blue" :icon="IconControl" @click="handleClickClearAllLog"
        :loading="keyLoading === 'CLEAR_ALL_LOG'">
        Clear All Log
      </VueButton>
    </div>
    <div class="table-wrap" style="flex-basis: 100%;">
      <table class="admin-table mt5-position-table">
        <thead>
          <tr>
            <th v-if="CONFIG.MODE === 'development'"></th>
            <th>#</th>
            <th>Name</th>
            <th></th>
            <th>Time</th>
            <th>Balance</th>
            <th>Equity</th>
            <th>Profit</th>
            <th>Positions</th>
            <th>Today</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(program, index) in mt5ProgramInfoList" :key="program.program_name" class="body-row">
            <td v-if="CONFIG.MODE === 'development'">
              <BugDevelopment @update:is-open="handleOpenTooltip" :data="program" />
            </td>
            <td>{{ index + 1 }}</td>
            <td>
              <span>{{ program.data.account_info?.name || '-' }}</span>
            </td>
            <td>
              <div class="flex gap-2 items-center">
                <span class="">
                  <VueTooltip maxHeight="600px" maxWidth="800px" @update:is-open="handleOpenTooltip">
                    <template #trigger>
                      <IconForm style="cursor: pointer;" width="1.2em" height="1.2em"
                        :style="{ color: program.log_list.length ? 'green' : '' }" />
                    </template>
                    <pre style="">{{ JSON.stringify(program.log_list, null, 4) }}</pre>
                  </VueTooltip>
                </span>
                <span>
                  <VueTooltip maxHeight="600px" maxWidth="800px" @update:is-open="handleOpenTooltip">
                    <template #trigger>
                      <IconExclamationCircle style="cursor: pointer" width="1.2em" height="1.2em"
                        :style="{ color: program.error_list.length ? 'red' : '' }" />
                    </template>
                    <pre style="">{{ JSON.stringify(program.error_list, null, 4) }}</pre>
                  </VueTooltip>
                </span>
              </div>
            </td>
            <td>{{ program.data.refresh_time || '-' }}</td>
            <td> {{
              formatNumber(
                program.data.account_info?.balance
              )
            }} {{ program.data.account_info?.currency }}</td>
            <td> {{
              formatNumber(
                program.data.account_info?.equity
              )
            }} {{ program.data.account_info?.currency }}</td>
            <td>
              {{
                formatNumber(
                  program.data.account_info?.profit
                )
              }} {{ program.data.account_info?.currency }}
            </td>
            <td>
              {{ program.data.position_list?.length || 0 }}
            </td>
            <td>
              {{(program.data.position_list || []).filter(i => i.time_msc > startOfToday).length}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.table-wrap {
  border: 1px solid var(--dashboard-line);
  border-radius: 12px;
  overflow: auto;
  background: color-mix(in srgb, var(--dashboard-panel) 88%, var(--dashboard-bg) 12%);
  tr {
    border-bottom: 1px solid var(--dashboard-line);
  }
}

.mt5-realtime-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--dashboard-line);
  background: color-mix(in srgb, var(--dashboard-panel) 88%, var(--dashboard-bg) 12%);

  span {
    font-size: 0.9rem;
    color: var(--dashboard-text-soft);
    font-weight: 600;
    letter-spacing: 0.01em;
  }
}
</style>
