<script setup lang="ts">
import {
  IconCalendar,
  IconCheckCircle,
  IconClockCircle,
  IconCloseCircle,
  IconDollar,
  IconExclamationCircle,
  IconForm,
  IconMinusCircle,
  IconRollback,
  IconSend,
  IconSpin,
  IconStop,
} from './icon-antd'

const props = withDefaults(
  defineProps<{
    color?: 'default' | 'green' | 'blue' | 'cyan' | 'orange' | 'red' | 'purple'
    bgColor?: string
    size?: 'small' | 'default' | 'large' | 'text'
    icon?:
      | Object
      | ''
      | 'calendar'
      | 'close'
      | 'check'
      | 'clock'
      | 'dollar'
      | 'exclamation'
      | 'form'
      | 'minus'
      | 'rollback'
      | 'send'
      | 'spin'
      | 'stop'
  }>(),
  {
    color: 'default',
    bgColor: '',
    size: 'default',
    icon: '',
  },
)
</script>

<template>
  <div
    :class="`vue-tag vue-tag-${color} vue-tag-size-${size}`"
    :style="bgColor ? `background-color: ${bgColor}; color: white` : ''"
  >
    <div>
      <span v-if="typeof icon === 'object'">
        <component :is="icon" />
      </span>
      <span v-else-if="icon === 'close'" class="icon-close"><IconCloseCircle /></span>
      <span v-else-if="icon === 'calendar'" class="icon-calendar"><IconCalendar /></span>
      <span v-else-if="icon === 'check'" class="icon-check"><IconCheckCircle /></span>
      <span v-else-if="icon === 'clock'" class="icon-clock"><IconClockCircle /></span>
      <span v-else-if="icon === 'dollar'" class="icon-dollar"><IconDollar /></span>
      <span v-else-if="icon === 'exclamation'" class="icon-exclamation">
        <IconExclamationCircle />
      </span>
      <span v-else-if="icon === 'form'" class="icon-form"><IconForm /></span>
      <span v-else-if="icon === 'minus'" class="icon-minus"><IconMinusCircle /></span>
      <span v-else-if="icon === 'send'" class="icon-send"><IconSend /></span>
      <span v-else-if="icon === 'rollback'" class="icon-rollback"><IconRollback /></span>
      <span v-else-if="icon === 'stop'" class="icon-stop"><IconStop /></span>
      <span v-else-if="icon === 'spin'" class="icon-stop"><IconSpin /></span>
      <slot v-else name="icon"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vue-tag {
  position: relative;
  display: inline-block;
  padding: 0 8px;
  outline: 0;
  white-space: nowrap;
  border: 1px solid var(--control-border);
  border-radius: 999px;
  background-color: var(--control-bg);
  color: var(--control-text);
  line-height: 24px;

  div {
    display: flex;
    gap: 0.45em;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    span {
      line-height: 0;
    }
  }

  &.vue-tag-green {
    color: #2f855a;
    background-color: #edfdf3;
    border-color: #9fe4b5;
  }

  &.vue-tag-blue {
    color: #1d4f9c;
    background-color: #eaf3ff;
    border-color: #9fc4f7;
  }

  &.vue-tag-cyan {
    color: #0f7a82;
    background-color: #e8fbfc;
    border-color: #93dde2;
  }

  &.vue-tag-orange {
    color: #b45309;
    background-color: #fff8e8;
    border-color: #f6d092;
  }

  &.vue-tag-red {
    color: #c53030;
    background-color: #fff1f2;
    border-color: #f9b3b8;
  }

  &.vue-tag-purple {
    color: #6b46c1;
    background-color: #f6f0ff;
    border-color: #d9c2fb;
  }

  &.vue-tag-size-text {
    padding: 0 8px;
    border: none;
    color: var(--dashboard-primary-600);
    background-color: inherit !important;

    &.vue-tag-blue {
      color: var(--dashboard-primary-600);
      &:hover {
        color: var(--dashboard-primary-700);
      }
    }
  }

  &.vue-tag-size-small {
    font-size: 13px;
    padding: 0 12px;
  }

  &.vue-tag-size-large {
    padding: 4px 14px;
    font-size: 16px;
    line-height: 30px;
  }
}

html.theme-dark .vue-tag {
  &.vue-tag-green {
    color: #9de7b5;
    background-color: rgba(46, 143, 84, 0.2);
    border-color: rgba(46, 143, 84, 0.45);
  }

  &.vue-tag-blue {
    color: #b9d4ff;
    background-color: rgba(30, 102, 195, 0.22);
    border-color: rgba(110, 164, 239, 0.52);
  }

  &.vue-tag-cyan {
    color: #a5eef2;
    background-color: rgba(15, 142, 155, 0.24);
    border-color: rgba(83, 190, 199, 0.5);
  }

  &.vue-tag-orange {
    color: #ffd39b;
    background-color: rgba(180, 83, 9, 0.23);
    border-color: rgba(245, 158, 11, 0.5);
  }

  &.vue-tag-red {
    color: #fecaca;
    background-color: rgba(197, 48, 48, 0.22);
    border-color: rgba(248, 113, 113, 0.5);
  }

  &.vue-tag-purple {
    color: #e1d3ff;
    background-color: rgba(107, 70, 193, 0.24);
    border-color: rgba(167, 139, 250, 0.5);
  }
}
</style>
