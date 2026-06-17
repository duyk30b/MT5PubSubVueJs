<script setup lang="ts">
import VueButton from '@/common/VueButton.vue'
import { AlertStore } from '@/common/vue-alert/vue-alert.store'
import {
  InputNumber,
  InputSelect,
  InputText,
  type InputSelectOption
} from '@/common/vue-form'
import VueModal from '@/common/vue-modal/VueModal.vue'
import { Mt5Account, Mt5AccountApi, Mt5AccountType } from '@/modules/mt5_account'
import { useMt5ProgramStore } from '@/stores/mt5_program.store'
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (e: 'success', value: Mt5Account, type: 'CREATE' | 'UPDATE' | 'DELETE'): void
}>()

const mt5ProgramStore = useMt5ProgramStore()

const mt5AccountOrigin = ref(Mt5Account.blank())
const mt5Account = ref(Mt5Account.blank())
const showModal = ref(false)
const programName = ref('')

const accountTypeOptions: InputSelectOption<any>[] = [
  { label: 'Normal', value: 0 },
  { label: 'Master', value: 1 },
  { label: 'Follower', value: 2 },
]

const copyMasterLoginOptions = computed(() => {
  return mt5ProgramStore.mt5ProgramInfoList
    .filter(
      (program) =>
        program?.mt5_account?.accountLogin &&
        program.mt5_account.accountLogin !== mt5Account.value.accountLogin &&
        program?.mt5_account?.accountType === Mt5AccountType.MASTER,
    )
    .map((program) => ({
      label: `${program.data.account_info.login} - ${program.data.account_info.name}`,
      value: program.data.account_info.login,
    }))
})

const disabledButtonSave = computed(() => {
  if (!mt5AccountOrigin.value.id) return false
  if (Mt5Account.equal(mt5Account.value, mt5AccountOrigin.value)) return true
})

const openModal = async (props: { accountLogin: number; programName: string }) => {
  const { accountLogin } = props
  showModal.value = true
  programName.value = props.programName

  mt5AccountOrigin.value = await Mt5AccountApi.getOne({ filter: { accountLogin } })
  if (!mt5AccountOrigin.value.id) {
    const mt5Program = mt5ProgramStore.mt5ProgramInfoList.find(
      (program) => program.data?.account_info?.login === accountLogin,
    )
    if (mt5Program) {
      mt5AccountOrigin.value.accountLogin = mt5Program.data.account_info.login
      mt5AccountOrigin.value.accountName = mt5Program.data.account_info.name
      mt5AccountOrigin.value.accountServer = mt5Program.data.account_info.server
    }
  }
  mt5Account.value = Mt5Account.from(mt5AccountOrigin.value)
}

const closeModal = () => {
  showModal.value = false
  mt5AccountOrigin.value = Mt5Account.blank()
  mt5Account.value = Mt5Account.blank()
}

const handleSave = async () => {
  try {
    if (!mt5AccountOrigin.value.id) {
      await Mt5AccountApi.createOne({
        mt5Account: mt5Account.value,
        programName: programName.value,
      })
    } else {
      await Mt5AccountApi.updateOne({
        id: mt5AccountOrigin.value.id,
        mt5Account: mt5Account.value,
        programName: programName.value,
      })
    }
    closeModal()
  } catch (error: any) {
    console.log('🚀 ~ handleSave ~ error:', error)
    AlertStore.addError(error.message)
  }
}

defineExpose({ openModal })
</script>

<template>
  <VueModal v-model:show="showModal" :style="{ width: '640px', marginTop: '100px' }">
    <form class="start-copy-modal" @submit.prevent="handleSave">
      <div class="flex gap-2 start-copy-modal-head">
        <span>MT5 Account Setting:</span>
        <span v-if="!mt5AccountOrigin.id">New Account</span>
        <span v-else>Update Account (ID: {{ mt5AccountOrigin.id }})</span>
      </div>

      <div class="start-copy-modal-body flex flex-wrap gap-4">
        <div class="" style="flex: 1 1 40%; min-width: 250px">
          <label>Account Name</label>
          <div>
            <InputText :value="mt5Account.accountName" disabled />
          </div>
        </div>
        <div class="" style="flex: 1 1 40%; min-width: 250px">
          <label>Account Server</label>
          <div>
            <InputText :value="mt5Account.accountServer" disabled />
          </div>
        </div>
        <div class="" style="flex: 1 1 40%; min-width: 250px">
          <label>Account Login</label>
          <div>
            <InputText :value="mt5Account.accountLogin.toString()" disabled />
          </div>
        </div>

        <div class="" style="flex: 1 1 40%; min-width: 250px">
          <label>Account Type</label>
          <div>
            <InputSelect v-model:value="mt5Account.accountType" :options="accountTypeOptions" />
          </div>
        </div>

        <div class="" style="flex: 1 1 100%">
          <label>Description</label>
          <div>
            <InputText v-model:value="mt5Account.description" />
          </div>
        </div>

        <template v-if="mt5Account.accountType === Mt5AccountType.FOLLOWER">
          <div class="" style="flex: 1 1 200px">
            <label>Copy Master Login</label>
            <div>
              <InputSelect v-model:value="mt5Account.copyMasterLogin" :options="copyMasterLoginOptions" />
            </div>
          </div>

          <div class="" style="flex: 1 1 200px">
            <label>Copy Multiplier</label>
            <div>
              <InputNumber v-model:value="mt5Account.copyMultiplier" :step="0.1" :validate="{ '>': 0 }" />
            </div>
          </div>
        </template>
      </div>

      <div class="mt-4 start-copy-modal-footer">
        <VueButton @click="closeModal" type="reset">Cancel</VueButton>
        <VueButton color="blue" :disabled="disabledButtonSave" type="submit">
          Save Account
        </VueButton>
      </div>
    </form>
  </VueModal>
</template>

<style scoped lang="scss">
.start-copy-modal {
  background: var(--dashboard-panel);
  color: var(--dashboard-text);

  .start-copy-modal-head {
    padding: 14px 16px;
    border-bottom: 1px solid var(--dashboard-line);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--dashboard-text-soft);
  }

  .start-copy-modal-body {
    padding: 14px 16px;

    label {
      color: var(--dashboard-text-soft);
      font-weight: 600;
      font-size: 0.92rem;
    }

    .target-instance-label {
      border: 1px solid var(--control-border);
      border-radius: 10px;
      background: var(--control-bg-disabled);
      color: var(--dashboard-text);
      min-height: 34px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
    }
  }

  .start-copy-modal-footer {
    padding: 0 16px 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
