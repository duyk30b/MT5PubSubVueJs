<script setup lang="ts">
import VueButton from '@/common/VueButton.vue'
import VueTag from '@/common/VueTag.vue'
import {
  IconApartment,
  IconClose,
  IconControl,
  IconCopy,
  IconExclamationCircle,
  IconForm,
  IconReload,
  IconSend,
  IconSetting
} from '@/common/icon-antd'
import VueDropdown from '@/common/popover/VueDropdown.vue'
import VueTooltip from '@/common/popover/VueTooltip.vue'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import { VueSwitch } from '@/common/vue-form'
import { CONFIG } from '@/config'
import { MT5ProgramApi } from '@/modules/mt5_program/mt5_program.api.ts'
import type { MT5ProgramData } from '@/modules/mt5_program/mt5_program_data.model.ts'
import { useMt5ProgramStore } from '@/stores/mt5_program.store.ts'
import { ESTimer } from '@/utils'
import { computed, ref, watchEffect } from 'vue'
import BugDevelopment from '../component/BugDevelopment.vue'
import ModalMT5AccountSetting from './ModalMT5AccountSetting.vue'
import { Mt5AccountType } from '@/modules/mt5_account/mt5_account.model.ts'

const modalMt5AccountSettingRef = ref<InstanceType<typeof ModalMT5AccountSetting>>()

const mt5ProgramStore = useMt5ProgramStore()

const realTimeEnabled = ref(true)
const keyLoading = ref<string>('')

const mt5ProgramDataList = ref<MT5ProgramData[]>([])

watchEffect(() => {
  if (realTimeEnabled.value) {
    mt5ProgramDataList.value = [...mt5ProgramStore.mt5ProgramDataList]
  }
})

const startOfToday = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
})


const getNumberValue = (source: any, keys: string[], fallback = 0) => {
  for (const key of keys) {
    const value = source?.[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value !== '' && Number.isFinite(Number(value))) {
      return Number(value)
    }
  }
  return fallback
}

const formatMoney = (value: number | undefined | null, currency = 'USD') => {
  const safeValue = Number(value ?? 0)
  return (
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeValue) + ` ${currency}`
  )
}

const formatPrice = (value: number | undefined | null) => {
  const safeValue = Number(value ?? 0)
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(safeValue)
}

const getProfitClass = (value: number | undefined | null) => {
  const safeValue = Number(value ?? 0)
  return {
    positive: safeValue > 0,
    negative: safeValue < 0,
  }
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

const handleClickOpenAll = async () => {
  keyLoading.value = 'OPEN_ALL'
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.openAll()
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickCloseAll = async () => {
  keyLoading.value = 'CLOSE_ALL'
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.closeAll()
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickRefresh = async (program: MT5ProgramData) => {
  const key = `REFRESH_${program.program_name}`
  keyLoading.value = key
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.refresh({ program_name: program.program_name })
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickOpen = async (program: MT5ProgramData) => {
  keyLoading.value = `OPEN_${program.program_name}`
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.open({
      program_name: program.program_name,
    })
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickClose = async (program: MT5ProgramData) => {
  keyLoading.value = `CLOSE_${program.program_name}`
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.close({
      program_name: program.program_name,
    })
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickCopyEnabled = async (program: MT5ProgramData) => {
  keyLoading.value = `COPY_ENABLED_${program.program_name}`
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.copyEnabled({
      program_name: program.program_name,
    })
  } catch (error: any) {
    console.log("🚀 ~ handleClickCopyEnabled ~ error:", error)
    // AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickCopyDisabled = async (program: MT5ProgramData) => {
  keyLoading.value = `COPY_DISABLED_${program.program_name}`
  realTimeEnabled.value = false
  try {
    await MT5ProgramApi.copyDisabled({
      program_name: program.program_name,
    })
  } catch (error: any) {
    AlertStore.addError(error.message)
  } finally {
    keyLoading.value = ''
    realTimeEnabled.value = true
  }
}

const handleClickOpenSetting = (program: MT5ProgramData) => {
  if (!program.information?.account_info?.login) {
    AlertStore.addError('Account login not found for this program')
    return
  }
  modalMt5AccountSettingRef.value?.openModal({
    accountLogin: program.information.account_info.login,
    programName: program.program_name,
  })
}

const handleClickClearLog = async (program: MT5ProgramData) => {
  if (!confirm(`Are you sure you want to clear log for program ${program.program_name}?`)) {
    return
  }
  try {
    await MT5ProgramApi.clearLog({
      program_name: program.program_name,
    })
  } catch (error: any) {
    AlertStore.addError(error.message)
  }
}

const handleClickClearError = async (program: MT5ProgramData) => {
  if (!confirm(`Are you sure you want to clear error log for program ${program.program_name}?`)) {
    return
  }
  try {
    await MT5ProgramApi.clearError({
      program_name: program.program_name,
    })
  } catch (error: any) {
    AlertStore.addError(error.message)
  }
}
</script>

<template>
  <ModalMT5AccountSetting ref="modalMt5AccountSettingRef" />
  <section class="admin-list-view mt5-instance-view">
    <div class="admin-hero mt5-hero">
      <div class="admin-hero-title">
        <div class="admin-hero-icon">
          <IconApartment />
        </div>
        <div>
          <div class="flex gap-2 items-center flex-wrap">
            <h1>MT5 Software Instances</h1>
            <div class="flex gap-1 items-center mt-1 mt5-realtime-toggle">
              <VueSwitch v-model:modelValue="realTimeEnabled" :size="'18px'" />
              <span>Real time:</span>
              <span class="text-xs text-gray-500">
                {{ ESTimer.timeToText(mt5ProgramStore.event_time, 'YYYY-MM-DD hh:mm:ss') }}
              </span class="text-xs text-gray-500">
            </div>
          </div>
          <p>Theo dõi trạng thái MT5, PY, process và setting cho từng program.</p>
        </div>
      </div>

      <div class="mt5-hero-right">
        <div class="mt5-hero-actions">
          <VueButton size="small" color="purple" :icon="IconReload" @click="handleClickRefreshAll"
            :loading="keyLoading === 'REFRESH_ALL'">
            REFRESH ALL
          </VueButton>
          <VueButton size="small" color="green" :icon="IconControl" @click="handleClickOpenAll">
            Open All
          </VueButton>
          <VueButton size="small" color="red" :icon="IconClose" @click="handleClickCloseAll">
            Close All
          </VueButton>
        </div>
      </div>
    </div>

    <div v-if="mt5ProgramDataList.length === 0" class="admin-empty-cell mt5-empty">
      Không có program nào đang mở.
    </div>

    <article v-for="(program, index) in mt5ProgramDataList" :key="program.program_name"
      class="admin-table-card mt5-instance-card">
      <div class="mt5-instance-head">
        <div class="mt5-instance-head-main">
          <div class="mt5-instance-title-row">
            <div class="mt5-instance-name flex items-center gap-2">
              <span v-if="CONFIG.MODE === 'development'">
                <BugDevelopment @update:is-open="handleOpenTooltip" :data="program" />
              </span>
              <span>{{ program.program_name }}</span>
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

            <div class="mt5-instance-badges" v-if="program.isOpening">
              <VueTag color="green">
                PID: {{ program.information.exe_process?.pid || '-' }}
              </VueTag>
              <VueTag color="blue">
                RAM: {{ program.information.exe_process?.memory_mb || '-' }}
              </VueTag>
              <VueTag color="orange">
                CPU: {{ program.information.exe_process?.cpu_percent || '-' }}%
              </VueTag>
            </div>
          </div>

          <div class="mt5-instance-path">{{ program.information.path || '-' }}</div>
        </div>

        <div class="flex flex-wrap items-center mt5-instance-actions">
          <VueButton size="small" color="green" :icon="IconSend" @click="handleClickOpen(program)"
            :disabled="program.isOpening" :loading="keyLoading == `OPEN_${program.program_name}`">
            Open MT5
          </VueButton>
          <VueButton size="small" color="red" :icon="IconClose" @click="handleClickClose(program)"
            :disabled="!program.isOpening" :loading="keyLoading == `CLOSE_${program.program_name}`">
            Close MT5
          </VueButton>
          <!-- <VueButton size="small" color="purple" :icon="IconSend" @click="handleClickRefresh(program)"
            :loading="keyLoading == `REFRESH_${program.program_name}`">
            Refresh Process
          </VueButton> -->
          <VueDropdown>
            <template #trigger>
              <div class="px-1 py-1 cursor-pointer">
                <IconSetting />
              </div>
            </template>
            <div class="px-3 pt-1 pb-2">
              <div class="flex gap-2 cursor-pointer mt-2" style="font-size: 0.9em;"
                @click="handleClickOpenSetting(program)">
                <IconSetting width="20" height="20" style="color: var(--dashboard-primary)" />
                <strong class="block mb-1">Account Setting</strong>
              </div>
              <div class="flex gap-2 cursor-pointer mt-1 pt-2" style="font-size: 0.9em; border-top: 1px solid #cdcdcd;"
                @click="handleClickClearLog(program)">
                <IconSetting width="20" height="20" style="color: var(--dashboard-primary)" />
                <strong class="block mb-1">Clear Log</strong>
              </div>
              <div class="flex gap-2 cursor-pointer mt-1 pt-2" style="font-size: 0.9em;border-top: 1px solid #cdcdcd;"
                @click="handleClickClearError(program)">
                <IconSetting width="20" height="20" style="color: var(--dashboard-primary)" />
                <strong class="block mb-1">Clear Error</strong>
              </div>
            </div>
          </VueDropdown>

        </div>
      </div>

      <div class="mt5-account-grid">
        <article class="mt5-metric-card">
          <span>{{ program.information.account_info?.server || '-' }}</span>
          <div>
            <strong>{{ program.account_setting.mt5_account.id || '-' }}</strong>
            <strong> - {{ program.information.account_info?.name || '-' }}</strong>
            <strong> - {{ program.information.account_info?.login || '-' }}</strong>
          </div>
        </article>

        <article class="mt5-metric-card">
          <span>Balance</span>
          <strong>
            {{
              formatMoney(
                getNumberValue(program.information.account_info, ['balance']),
                program.information.account_info?.currency || 'USD',
              )
            }}
          </strong>
        </article>

        <article class="mt5-metric-card">
          <span>Equity</span>
          <strong>
            {{
              formatMoney(
                getNumberValue(program.information.account_info, ['equity']),
                program.information.account_info?.currency || 'USD',
              )
            }}
          </strong>
        </article>

        <article class="mt5-metric-card"
          :class="getProfitClass(getNumberValue(program.information.account_info, ['profit']))">
          <span>Profit</span>
          <strong>
            {{
              formatMoney(
                getNumberValue(program.information.account_info, ['profit']),
                program.information.account_info?.currency || 'USD',
              )
            }}
          </strong>
        </article>
      </div>

      <div class="mt5-position-table-wrap">
        <div class="mt5-position-head">
          <h3 class="flex items-center gap-2">
            <span>{{ program.information.position_list?.length || 0 }} Positions:</span>
            <span>{{ program.information.refresh_time || '-' }}</span>
          </h3>
          <template v-if="program.account_setting?.mt5_account?.accountType === Mt5AccountType.MASTER">
            <VueTag color="cyan">Account Master</VueTag>
          </template>
          <template v-if="program.account_setting?.mt5_account?.accountType === Mt5AccountType.FOLLOWER">
            <VueButton v-if="!program.information.copy_enabled" size="small" color="purple" :icon="IconCopy"
              @click="handleClickCopyEnabled(program)" :loading="keyLoading === `COPY_ENABLED_${program.program_name}`">
              Start Copy From {{ program.account_setting?.mt5_account?.copyMasterLogin || '-' }}
            </VueButton>
            <VueButton v-else size="small" color="default" :icon="IconCopy" @click="handleClickCopyDisabled(program)"
              :loading="keyLoading === `COPY_DISABLED_${program.program_name}`">
              Stop Copy
            </VueButton>
          </template>
        </div>

        <div class="admin-table-scroll">
          <table class="admin-table mt5-position-table">
            <thead>
              <tr>
                <th v-if="CONFIG.MODE === 'development'"></th>
                <th>#</th>
                <th>Ticket</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Volume</th>
                <th>Open Time</th>
                <th style="text-align: center">Price</th>
                <th>Profit</th>
                <th>Comment</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="!program.information.position_list?.length">
                <td colspan="100" class="admin-empty-cell">
                  Không có position đang mở.
                </td>
              </tr>

              <tr v-for="(position, index) in program.information.position_list || []" :key="position.ticket"
                class="body-row" :style="position.time_msc > startOfToday ? 'font-weight: bold' : ''">
                <td v-if="CONFIG.MODE === 'development'">
                  <span>
                    <BugDevelopment @update:is-open="handleOpenTooltip" :data="position" />
                  </span>
                </td>
                <td>{{ index + 1 }}</td>
                <td>{{ position.ticket }}</td>
                <td>{{ position.symbol || '-' }}</td>
                <td>
                  <VueTag :color="position.type === 0 ? 'green' : position.type === 1 ? 'red' : 'default'
                    ">
                    {{ position.type == 0 ? 'BUY' : position.type === 1 ? 'SELL' : `TYPE ${position.type ?? '-'}` }}
                  </VueTag>
                </td>
                <td>{{ position.volume }}</td>
                <td>{{ ESTimer.timeToText(position.time_msc, 'YYYY-MM-DD hh:mm:ss', 7) }}</td>
                <td style="text-align: center">
                  {{ formatPrice(position.price_open) }} ➞
                  {{ formatPrice(position.price_current) }}
                </td>
                <td :class="getProfitClass(position.profit)">
                  {{ formatMoney(position.profit, program.information.account_info?.currency || 'USD') }}
                </td>
                <td class="position-comment">{{ position.comment || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.mt5-instance-view {
  display: grid;
  gap: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -12px;
    background:
      radial-gradient(circle at 8% 0%, rgba(37, 99, 235, 0.14), transparent 28%),
      radial-gradient(circle at 92% 0%, rgba(16, 185, 129, 0.14), transparent 30%),
      linear-gradient(180deg,
        color-mix(in srgb, var(--dashboard-bg) 92%, white 8%),
        var(--dashboard-bg));
    pointer-events: none;
    z-index: 0;
  }

  >* {
    position: relative;
    z-index: 1;
  }

  .mt5-empty {
    border-radius: 14px;
    border: 1px dashed var(--dashboard-line);
  }

  .mt5-instance-card {
    display: grid;
    gap: 14px;
    padding: 16px;
    border-radius: 18px;
    background: linear-gradient(180deg,
        color-mix(in srgb, var(--dashboard-panel) 92%, white 8%),
        var(--dashboard-panel));
    box-shadow: 0 20px 45px -34px rgba(15, 23, 42, 0.42);
  }

  .mt5-instance-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    flex-wrap: wrap;
  }

  .mt5-instance-head-main {
    display: grid;
    gap: 8px;
    min-width: min(100%, 520px);
  }

  .mt5-instance-title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .mt5-instance-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--dashboard-text);
  }

  .mt5-instance-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .mt5-instance-path {
    color: var(--dashboard-text-soft);
    font-size: 0.9rem;
    word-break: break-all;
  }

  .mt5-instance-time {
    margin-top: 0;
    font-size: 0.82rem;
    color: var(--dashboard-text-soft);
  }

  .mt5-instance-actions {
    gap: 8px;
  }

  .mt5-state-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .mt5-state-card {
    border: 1px solid var(--dashboard-line);
    border-radius: 16px;
    padding: 14px;
    display: grid;
    gap: 10px;
    background: color-mix(in srgb, var(--dashboard-panel) 92%, var(--dashboard-bg) 8%);

    p {
      margin: 0;
      color: var(--dashboard-text-soft);
      font-size: 0.88rem;
      line-height: 1.45;
    }

    strong {
      display: block;
      margin-top: 2px;
      font-size: 1rem;
      color: var(--dashboard-text);
    }
  }

  .mt5-state-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;

    span {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--dashboard-text-soft);
    }
  }

  .mt5-state-card-mt5.is-open {
    border-color: color-mix(in srgb, #16a34a 30%, var(--dashboard-line) 70%);
    background: linear-gradient(180deg,
        rgba(22, 163, 74, 0.08),
        color-mix(in srgb, var(--dashboard-panel) 92%, var(--dashboard-bg) 8%));
  }

  .mt5-state-card-py.is-running {
    border-color: color-mix(in srgb, #2563eb 30%, var(--dashboard-line) 70%);
    background: linear-gradient(180deg,
        rgba(37, 99, 235, 0.08),
        color-mix(in srgb, var(--dashboard-panel) 92%, var(--dashboard-bg) 8%));
  }

  .mt5-copy-summary {
    display: grid;
    gap: 4px;

    span {
      color: var(--dashboard-text-soft);
      font-size: 0.85rem;
    }
  }

  .mt5-account-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
  }

  .mt5-metric-card {
    border: 1px solid var(--dashboard-line);
    background: color-mix(in srgb, var(--dashboard-panel) 90%, var(--dashboard-bg) 10%);
    border-radius: 12px;
    padding: 10px;
    display: grid;
    gap: 4px;

    span {
      font-size: 0.75rem;
      color: var(--dashboard-text-soft);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    strong {
      font-size: 1rem;
      line-height: 1.25;
      color: var(--dashboard-text);
    }

    small {
      color: var(--dashboard-text-soft);
    }

    &.positive strong {
      color: #2f855a;
    }

    &.negative strong {
      color: #c53030;
    }
  }

  .mt5-metric-card-highlight {
    background: linear-gradient(180deg,
        rgba(245, 158, 11, 0.08),
        color-mix(in srgb, var(--dashboard-panel) 90%, var(--dashboard-bg) 10%));
  }

  .mt5-process-grid {
    display: grid;
    gap: 10px;
  }

  .mt5-process-card {
    border: 1px solid var(--dashboard-line);
    border-radius: 16px;
    padding: 14px;
    display: grid;
    gap: 12px;
    background: color-mix(in srgb, var(--dashboard-panel) 90%, var(--dashboard-bg) 10%);
  }

  .mt5-process-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;

    span {
      display: block;
      font-size: 0.75rem;
      color: var(--dashboard-text-soft);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    strong {
      display: block;
      margin-top: 2px;
      color: var(--dashboard-text);
      font-size: 1rem;
    }
  }

  .mt5-process-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    div {
      border: 1px solid var(--dashboard-line);
      border-radius: 12px;
      padding: 10px 12px;
      background: color-mix(in srgb, var(--dashboard-panel) 96%, var(--dashboard-bg) 4%);

      span {
        display: block;
        color: var(--dashboard-text-soft);
        font-size: 0.74rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      strong {
        display: block;
        margin-top: 4px;
        color: var(--dashboard-text);
        font-size: 0.98rem;
      }
    }
  }

  .mt5-process-foot {
    color: var(--dashboard-text-soft);
    font-size: 0.85rem;
    word-break: break-all;
  }

  .mt5-position-table-wrap {
    border: 1px solid var(--dashboard-line);
    border-radius: 12px;
    overflow: hidden;
  }

  .mt5-position-head {
    padding: 10px 12px;
    border-bottom: 1px solid var(--dashboard-line);
    background: color-mix(in srgb, var(--dashboard-panel) 85%, var(--dashboard-bg) 15%);
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 0.95rem;
      color: var(--dashboard-text);
    }
  }

  .mt5-position-table {
    min-width: 980px;

    td.positive {
      color: #2f855a;
    }

    td.negative {
      color: #c53030;
    }
  }

  .position-comment {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.mt5-hero {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  .mt5-hero-right {
    display: grid;
    justify-items: end;
    gap: 12px;
  }

  .mt5-hero-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .mt5-hero-status {
    display: grid;
    justify-content: flex-end;
    grid-template-columns: repeat(2, max-content);
    gap: 8px;
  }

  .mt5-hero-subline {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 12px;
    color: var(--dashboard-text-soft);
    font-size: 0.88rem;
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
}

@media (max-width: 1100px) {
  .mt5-instance-view {

    .mt5-state-grid,
    .mt5-account-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .mt5-process-metrics {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 760px) {
  .mt5-hero {
    .mt5-hero-right {
      width: 100%;
      justify-items: start;
    }

    .mt5-hero-status {
      justify-content: flex-start;
    }

    .mt5-hero-subline {
      justify-content: flex-start;
    }
  }

  .mt5-instance-view {

    .mt5-state-grid,
    .mt5-account-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mt5-process-card-head,
    .mt5-instance-title-row {
      flex-direction: column;
    }

    .mt5-process-metrics {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 560px) {
  .mt5-instance-view {

    .mt5-state-grid,
    .mt5-account-grid {
      grid-template-columns: 1fr;
    }

    .mt5-instance-actions,
    .mt5-hero-actions,
    .mt5-hero-status,
    .mt5-hero-subline {
      width: 100%;
      justify-content: flex-start;
    }
  }
}
</style>
