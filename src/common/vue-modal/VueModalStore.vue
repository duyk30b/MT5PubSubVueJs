<script lang="ts" setup>
import { ref } from 'vue'
import VueButton from '../VueButton.vue'
import { IconClose, IconExclamationCircle, IconQuestionCircle } from '../icon-antd'
import VueModal from './VueModal.vue'
import { ModalStore } from './vue-modal.store'

const saveLoading = ref(false)

const handleUpdateShowModal = (show: boolean, key: string) => {
  if (!show) {
    ModalStore.remove(key)
  }
}

const handleOk = async (func: () => Promise<void>, key: string) => {
  saveLoading.value = true
  try {
    await func()
    ModalStore.remove(key)
  } catch (error) {
    console.log('🚀 ~ file: VueModalStore.vue:23 ~ handleOk ~ error:', error)
  } finally {
    saveLoading.value = false
  }
}

const handleCancel = async (func: () => Promise<void>, key: string) => {
  await func()
  ModalStore.remove(key)
}
</script>

<template>
  <template v-for="(modal, key) in ModalStore.data" :key="key">
    <VueModal
      v-model:show="modal.show"
      :style="modal.style"
      :modalMaskStyle="modal.modalMaskStyle"
      @update:show="(v) => handleUpdateShowModal(v, key)"
    >
      <div class="modal-store-card">
        <div class="modal-store-head">
          <div class="modal-store-head-left">
            <span v-if="modal.type === 'confirm'" class="modal-store-icon confirm">
              <IconQuestionCircle />
            </span>
            <span v-if="modal.type === 'alert'" class="modal-store-icon alert">
              <IconExclamationCircle />
            </span>
            <span class="modal-store-title">{{ modal.title }}</span>
          </div>
          <button type="button" class="modal-store-close" @click="ModalStore.remove(key)">
            <IconClose />
          </button>
        </div>
        <div v-if="modal.contentType === 'text'" class="modal-store-content">
          <template v-if="Array.isArray(modal.content)">
            <p v-for="(content, index) in modal.content" :key="index">{{ content }}</p>
          </template>
          <template v-if="typeof modal.content === 'string'">
            <p>{{ modal.content }}</p>
          </template>
        </div>
        <div
          v-if="modal.contentType === 'html' && typeof modal.content === 'string'"
          class="modal-store-content"
          v-html="modal.content"
        ></div>
        <div class="modal-store-footer">
          <div class="modal-store-actions">
            <VueButton
              v-if="modal.cancelText"
              type="reset"
              class="ml-auto"
              @click="handleCancel(modal.onCancel, key)"
            >
              {{ modal.cancelText }}
            </VueButton>
            <VueButton
              v-if="modal.okText && modal.type === 'confirm'"
              color="blue"
              :loading="saveLoading"
              @click="handleOk(modal.onOk, key)"
            >
              {{ modal.okText }}
            </VueButton>
          </div>
        </div>
      </div>
    </VueModal>
  </template>
</template>

<style lang="scss" scoped>
.modal-store-card {
  background: var(--dashboard-panel);
  color: var(--dashboard-text);
}

.modal-store-head {
  padding: 12px 16px;
  border-bottom: 1px solid var(--dashboard-line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: color-mix(in srgb, var(--dashboard-panel) 88%, var(--dashboard-primary-500) 12%);
}

.modal-store-head-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-store-icon {
  line-height: 0;
  font-size: 18px;

  &.confirm {
    color: #f97316;
  }

  &.alert {
    color: #ef4444;
  }
}

.modal-store-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--dashboard-text);
}

.modal-store-close {
  width: 32px;
  height: 32px;
  border: 1px solid var(--control-border);
  border-radius: 8px;
  background: var(--control-bg);
  color: var(--control-text);
  cursor: pointer;
  display: grid;
  place-items: center;
}

.modal-store-content {
  padding: 14px 16px;
  color: var(--dashboard-text);
}

.modal-store-content p {
  margin: 0 0 8px;
}

.modal-store-footer {
  padding: 12px 16px 16px;
}

.modal-store-actions {
  display: flex;
  gap: 10px;
}
</style>
