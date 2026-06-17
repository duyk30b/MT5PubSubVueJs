<template>
  <div class="tab-menu-item" :class="tabSelect == tabKey ? 'active' : ''" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue'

const emit = defineEmits<{ (e: 'active', value: string | number): void }>()

const handleTabMenuChange = inject<(value: string | number) => void>('eventTabMenuChange')
const tabSelect = inject<Ref<string | number>>('tabSelect')

const props = defineProps<{
  tabKey: string | number
}>()

const handleClick = (e: Event) => {
  if (handleTabMenuChange) {
    handleTabMenuChange(props.tabKey)
    emit('active', props.tabKey)
  }
}
</script>

<style lang="scss" scoped>
.tab-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  border: 1px solid var(--dashboard-line);
  border-top: 4px solid color-mix(in srgb, var(--dashboard-line) 65%, transparent);
  margin-bottom: -1px;
  white-space: nowrap;
  background-color: color-mix(in srgb, var(--dashboard-panel) 84%, var(--dashboard-bg) 16%);
  color: var(--dashboard-text-soft);
  opacity: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: var(--dashboard-primary-700);
    border-color: color-mix(in srgb, var(--dashboard-primary-500) 42%, var(--dashboard-line));
  }

  &.active {
    border-top-color: var(--dashboard-primary-600);
    color: var(--dashboard-primary-600);
    border-bottom: 0;
    font-weight: 700;
    opacity: 1;
    background-color: var(--dashboard-panel);
  }
}
</style>
