<script setup lang="ts">
import {
  IconClose,
  IconDelete,
  IconDollar,
  IconDownload,
  IconPlus,
  IconPrint,
  IconSave,
  IconSend,
  IconUpload,
} from './icon-antd'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    color?: 'default' | 'green' | 'blue' | 'red' | 'cyan' | 'purple' | 'orange'
    size?: 'small' | 'default' | 'large' | 'text'
    type?: 'reset' | 'submit' | 'button'
    icon?:
    | Object
    | ''
    | 'save'
    | 'print'
    | 'plus'
    | 'close'
    | 'trash'
    | 'dollar'
    | 'send'
    | 'upload'
    | 'download'
  }>(),
  {
    loading: false,
    disabled: false,
    color: 'default',
    size: 'default',
    type: 'button',
    icon: '',
  },
)
</script>

<template>
  <button :disabled="disabled || loading" :type="type"
    :class="`vue-btn vue-btn-${color} vue-btn-size-${size} ${loading ? 'vue-btn-loading' : ''}`">
    <span v-if="loading">
      <svg class="icon-spin" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="0 0 1024 1024">
        <path
          d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z">
        </path>
      </svg>
    </span>
    <span v-else-if="typeof icon === 'object'">
      <component :is="icon" />
    </span>
    <span v-else-if="icon === 'close'" class="icon-close">
      <IconClose />
    </span>
    <span v-else-if="icon === 'save'" class="icon-save">
      <IconSave />
    </span>
    <span v-else-if="icon === 'print'" class="icon-print">
      <IconPrint />
    </span>
    <span v-else-if="icon === 'plus'" class="icon-plus">
      <IconPlus />
    </span>
    <span v-else-if="icon === 'trash'" class="icon-trash">
      <IconDelete />
    </span>
    <span v-else-if="icon === 'dollar'" class="icon-dollar">
      <IconDollar />
    </span>
    <span v-else-if="icon === 'send'" class="icon-send">
      <IconSend />
    </span>
    <span v-else-if="icon === 'upload'" class="icon-upload">
      <IconUpload />
    </span>
    <span v-else-if="icon === 'download'" class="icon-download">
      <IconDownload />
    </span>
    <slot v-else name="icon"></slot>
    <slot></slot>
  </button>
</template>

<style lang="scss">
.vue-btn {
  --btn-bg: var(--control-bg);
  --btn-bg-hover: var(--control-bg-hover);
  --btn-bg-active: color-mix(in srgb, var(--control-bg) 74%, var(--dashboard-primary-500) 26%);
  --btn-border: var(--control-border);
  --btn-border-hover: var(--control-border-hover);
  --btn-text: var(--control-text);
  --btn-ring: var(--control-focus-ring);

  position: relative;
  appearance: none;
  -webkit-appearance: none;
  padding: 6px 16px;
  min-height: 36px;
  cursor: pointer;
  outline: 0;
  border-radius: 10px;
  white-space: nowrap;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--btn-text);
  line-height: 1;

  svg {
    line-height: 0;
  }

  span {
    display: inline-flex;
    align-items: center;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--btn-ring);
  }

  &:hover {
    border-color: var(--btn-border-hover);
    background: var(--btn-bg-hover);
  }

  &:active {
    transform: translateY(1px);
    background: var(--btn-bg-active);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 1;
    background: color-mix(in srgb, var(--control-bg-disabled) 90%, #ffffff 10%);
    border-color: color-mix(in srgb, var(--control-border) 84%, var(--control-text) 16%);
    color: color-mix(in srgb, var(--control-placeholder) 70%, var(--control-text) 30%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45) !important;
    transform: none !important;
  }

  &:disabled:not(.vue-btn-loading) {
    --btn-bg: color-mix(in srgb, var(--control-bg-disabled) 90%, #ffffff 10%);
    --btn-bg-hover: color-mix(in srgb, var(--control-bg-disabled) 90%, #ffffff 10%);
    --btn-bg-active: color-mix(in srgb, var(--control-bg-disabled) 90%, #ffffff 10%);
    --btn-border: color-mix(in srgb, var(--control-border) 84%, var(--control-text) 16%);
    --btn-border-hover: color-mix(in srgb, var(--control-border) 84%, var(--control-text) 16%);
    --btn-text: color-mix(in srgb, var(--control-placeholder) 70%, var(--control-text) 30%);
  }

  &.vue-btn-loading:disabled {
    opacity: 0.86;
    color: var(--btn-text);
    border-color: var(--btn-border);
    background: var(--btn-bg);
  }

  &.vue-btn-size-text {
    min-height: auto;
    padding: 2px 6px;
    border: none;
    background: transparent !important;
    color: var(--dashboard-primary-600);

    &:hover {
      color: var(--dashboard-primary-700);
    }
  }

  &.vue-btn-size-small {
    min-height: 30px;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 8px;
    &:disabled {
      min-height: 31px; // tăng chiều cao để nhìn cân đối hơn
    }
    &.vue-btn-default {
      min-height: 31px; // tăng chiều cao để nhìn cân đối hơn
    }
  }

  &.vue-btn-size-large {
    min-height: 42px;
    padding: 8px 24px;
    font-size: 15px;
  }

  &.vue-btn-blue {
    --btn-bg: #2563eb;
    --btn-bg-hover: #3b82f6;
    --btn-bg-active: #1d4ed8;
    --btn-border: #2563eb;
    --btn-border-hover: #3b82f6;
    --btn-text: #ffffff;
  }

  &.vue-btn-green {
    --btn-bg: #2f855a;
    --btn-bg-hover: #38a169;
    --btn-bg-active: #276749;
    --btn-border: #2f855a;
    --btn-border-hover: #38a169;
    --btn-text: #ffffff;
  }

  &.vue-btn-cyan {
    --btn-bg: #0f766e;
    --btn-bg-hover: #0d9488;
    --btn-bg-active: #115e59;
    --btn-border: #0f766e;
    --btn-border-hover: #0d9488;
    --btn-text: #ffffff;
  }

  &.vue-btn-purple {
    --btn-bg: #7c3aed;
    --btn-bg-hover: #8b5cf6;
    --btn-bg-active: #6d28d9;
    --btn-border: #7c3aed;
    --btn-border-hover: #8b5cf6;
    --btn-text: #ffffff;
  }

  &.vue-btn-red {
    --btn-bg: #dc2626;
    --btn-bg-hover: #ef4444;
    --btn-bg-active: #b91c1c;
    --btn-border: #dc2626;
    --btn-border-hover: #ef4444;
    --btn-text: #ffffff;
  }

  &.vue-btn-orange {
    --btn-bg: #ea580c;
    --btn-bg-hover: #f97316;
    --btn-bg-active: #c2410c;
    --btn-border: #ea580c;
    --btn-border-hover: #f97316;
    --btn-text: #ffffff;
  }

  &.vue-btn-default {
    --btn-bg: color-mix(in srgb, var(--control-bg) 94%, #ffffff 6%);
    --btn-bg-hover: color-mix(in srgb, var(--control-bg-hover) 92%, #ffffff 8%);
    --btn-bg-active: color-mix(in srgb, var(--control-bg) 82%, var(--dashboard-primary-500) 18%);
    --btn-border: color-mix(in srgb, var(--control-border) 85%, var(--control-text) 15%);
    --btn-border-hover: color-mix(in srgb, var(--control-border-hover) 84%, var(--control-text) 16%);
    --btn-text: var(--control-text);
  }

  &.vue-btn-size-text:disabled {
    background: transparent !important;
    color: var(--control-placeholder);
    border: none;
  }

  &:not(:disabled)::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    border-radius: 12px;
    border: 3px solid transparent;
    transform: translate(-50%, -50%);
    transition:
      transform 0.25s,
      opacity 0.25s,
      border-color 0.25s;
    pointer-events: none;
  }

  &:not(:disabled):active::after {
    border-color: rgba(30, 102, 195, 0.36);
    opacity: 0;
  }
}
</style>
