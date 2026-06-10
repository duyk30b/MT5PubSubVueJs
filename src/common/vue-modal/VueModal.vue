<script lang="ts" setup>
import type { StyleValue } from 'vue'

const props = withDefaults(
  defineProps<{
    show: boolean
    style?: StyleValue
    modalMaskStyle?: StyleValue
  }>(),
  {
    show: false,
    style: () => ({ width: '800px' }),
  },
)
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'close'): void
}>()

const closeModal = () => {
  emit('update:show', false)
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-mask" :style="modalMaskStyle" @mousedown.self="closeModal">
        <div class="modal-container" :style="style">
          <slot>
            <div style="padding: 20px; background-color: #fff">
              <div>Modal Header</div>
              <div>
                <button @click="closeModal">Close</button>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dashboard-overlay);
  display: flex;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(2px);
}

.modal-container {
  max-width: 96%;
  max-height: 90%;
  overflow-y: auto;
  width: 800px;
  border: 1px solid var(--dashboard-line);
  background: var(--dashboard-panel);
  margin-top: auto;
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
  border-radius: 14px;
  box-shadow: var(--control-dropdown-shadow);
  transition: all 0.2s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(0.92) translateY(8px);
  transform: scale(0.92) translateY(8px);
}
</style>
