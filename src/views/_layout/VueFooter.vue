<script setup lang="ts">
import { VueSwitch } from '@/common/vue-form'
import { CONFIG } from '../../config'
import { computed, ref } from 'vue'
import { ESTimer } from '@/utils'

const footerBuildTime = computed(() =>
  ESTimer.timeToText(CONFIG.BUILD_TIME, 'DD/MM/YY-hh:mm:ss', 7),
)

const modeDevelopment = ref(CONFIG.MODE === 'development')
const handleChangeMode = (value: number | boolean) => {
  if (value) {
    CONFIG.MODE = 'development'
  } else {
    CONFIG.MODE = 'production'
  }
}
</script>

<template>
  <footer class="dashboard-footer">
    <div class="footer-left">
      <strong>MT5PubSub-v1.0</strong>
      <span>©{{ footerBuildTime }}</span>
      <span>
        Hotline:
        <b>0988.456.789</b>
      </span>
    </div>
    <div class="footer-right">
      <span v-if="CONFIG.MODE === 'development'" style="color: violet; font-weight: 500">
        {{ CONFIG.API_BASE_URL }}
      </span>
      <VueSwitch :size="'14px'" v-model:modelValue="modeDevelopment" @change="handleChangeMode" />
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.dashboard-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid var(--dashboard-line);
  background: var(--dashboard-panel);
  color: var(--dashboard-text);
  font-size: 13px;
  .footer-left,
  .footer-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
}

@media (max-width: 991px) {
  .dashboard-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
