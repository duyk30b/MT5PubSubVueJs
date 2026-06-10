<script setup lang="ts">
import { IconSetting } from '@/common/icon-antd'
import { InputText } from '@/common/vue-form'
import VueButton from '@/common/VueButton.vue'
import { CONFIG } from '@/config'
import { SettingApi } from '@/modules/setting/setting.api'
import {
  Setting,
  SettingKey,
  SettingKeyExampleMap,
  SettingKeyLabelMap,
} from '@/modules/setting/setting.model'
import { ESTypescript } from '@/utils'
import { BugDevelopment } from '@/views/component'
import { computed, onBeforeMount, ref } from 'vue'

const settingMapOld: Partial<Record<SettingKey, Setting>> = {}
const settingMap = ref<Partial<Record<SettingKey, Setting>>>({})
const savingKey = ref<SettingKey | null>(null)

ESTypescript.valuesEnum(SettingKey).forEach((value) => {
  settingMapOld[value] = Setting.blank()
  settingMap.value[value] = Setting.blank()
})

const fetchData = async () => {
  const settingList = await SettingApi.list({})
  settingList.forEach((setting) => {
    settingMapOld[setting.key] = setting
    settingMap.value[setting.key] = Setting.from(setting)
  })
}

onBeforeMount(async () => {
  await fetchData()
})

const isSettingChanged = (settingKey: SettingKey, setting: Setting) => {
  const oldSetting = settingMapOld[settingKey] ?? Setting.blank()
  return !Setting.equal(setting, oldSetting)
}

const totalSettings = computed(() => Object.keys(settingMap.value).length)

const changedCount = computed(() => {
  return ESTypescript.valuesEnum(SettingKey).reduce((count, key) => {
    const setting = settingMap.value[key]
    if (!setting) {
      return count
    }
    return count + (isSettingChanged(key, setting) ? 1 : 0)
  }, 0)
})

const handleUpsertSetting = async (settingKey: SettingKey, setting: Setting) => {
  if (savingKey.value === settingKey) {
    return
  }
  savingKey.value = settingKey
  try {
    await SettingApi.upsert({ key: settingKey, value: setting.value })
    await fetchData()
  } finally {
    savingKey.value = null
  }
}
</script>

<template>
  <div class="system-setting-page">
    <div class="settings-hero">
      <div class="hero-ornament" />
      <div class="hero-icon">
        <IconSetting />
      </div>
      <div class="hero-content">
        <h2>System Settings</h2>
        <p>Quản lý tập trung cấu hình hệ thống với giao diện đồng bộ giữa theme sáng và tối.</p>
      </div>
      <div class="hero-metrics">
        <div class="metric-card">
          <span class="metric-label">Tổng cấu hình</span>
          <strong>{{ totalSettings }}</strong>
        </div>
        <div class="metric-card metric-card-highlight">
          <span class="metric-label">Đang thay đổi</span>
          <strong>{{ changedCount }}</strong>
        </div>
      </div>
    </div>

    <div class="settings-list">
      <article v-for="(setting, key, index) in settingMap" :key="key" class="setting-card">
        <div class="card-head">
          <div class="card-head-main">
            <span class="setting-index">{{ index + 1 }}</span>
            <div>
              <h3>{{ SettingKeyLabelMap[key] }}</h3>
              <p>{{ key }}</p>
            </div>
          </div>
          <div class="card-head-extra">
            <span v-if="isSettingChanged(key, setting!)" class="state-chip is-dirty">Modified</span>
            <span v-else class="state-chip">Synced</span>
            <BugDevelopment v-if="CONFIG.MODE === 'development'" :data="{ key, setting }" />
          </div>
        </div>

        <p class="setting-example">Example: {{ SettingKeyExampleMap[key] }}</p>

        <div class="setting-form-row">
          <InputText v-model:value="setting!.value" class="setting-input" />
        </div>

        <div class="card-actions">
          <VueButton
            color="blue"
            type="button"
            icon="save"
            :loading="savingKey === key"
            :disabled="!isSettingChanged(key, setting!)"
            @click="handleUpsertSetting(key, setting!)"
          >
            Save
          </VueButton>
        </div>
      </article>

      <div v-if="totalSettings === 0" class="empty-state">
        <h3>Chưa có dữ liệu cài đặt</h3>
        <p>Khi hệ thống trả về danh sách setting, các mục cấu hình sẽ hiển thị tại đây.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.system-setting-page {
  --surface: #ffffff;
  --surface-soft: #f6f9ff;
  --surface-strong: #edf2ff;
  --text-primary: #0e1730;
  --text-secondary: #4f5f83;
  --border-color: #d7e0f4;
  --shadow-soft: 0 18px 40px -30px rgba(36, 63, 131, 0.5);
  --accent: #1f5cff;
  --accent-soft: rgba(31, 92, 255, 0.14);
  --accent-strong: #153eba;
  position: relative;
  padding: 16px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 8% 5%, rgba(34, 197, 94, 0.12), transparent 28%),
      radial-gradient(circle at 92% 0%, rgba(59, 130, 246, 0.18), transparent 30%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(247, 250, 255, 0.9));
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .page-topbar {
    margin-bottom: 16px;
  }

  .settings-hero {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 18px;
    padding: 18px;
    border-radius: 20px;
    border: 1px solid var(--border-color);
    background: linear-gradient(150deg, var(--surface), var(--surface-soft));
    box-shadow: var(--shadow-soft);
    overflow: hidden;

    .hero-ornament {
      position: absolute;
      right: -30px;
      bottom: -40px;
      width: 170px;
      height: 170px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.36), rgba(34, 197, 94, 0));
      pointer-events: none;
    }

    .hero-icon {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
      background: var(--accent-soft);
    }

    .hero-content {
      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
      }

      p {
        margin: 6px 0 0;
        color: var(--text-secondary);
        line-height: 1.5;
      }
    }

    .hero-metrics {
      display: flex;
      gap: 10px;

      .metric-card {
        min-width: 112px;
        border-radius: 12px;
        border: 1px solid var(--border-color);
        padding: 10px 12px;
        background: var(--surface);

        .metric-label {
          display: block;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
        }

        strong {
          display: block;
          margin-top: 4px;
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        &.metric-card-highlight {
          border-color: rgba(31, 92, 255, 0.35);
          background: linear-gradient(145deg, rgba(31, 92, 255, 0.12), rgba(31, 92, 255, 0.02));

          strong {
            color: var(--accent-strong);
          }
        }
      }
    }
  }

  .settings-list {
    margin-top: 18px;
    display: grid;
    gap: 14px;

    .setting-card {
      border-radius: 16px;
      border: 1px solid var(--border-color);
      background: linear-gradient(155deg, var(--surface), var(--surface-soft));
      padding: 16px;
      box-shadow: var(--shadow-soft);

      .card-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;

        .card-head-main {
          display: flex;
          align-items: center;
          gap: 12px;

          .setting-index {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            background: var(--accent-soft);
            color: var(--accent-strong);
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          h3 {
            margin: 0;
            font-size: 1rem;
            color: var(--text-primary);
            line-height: 1.25;
          }

          p {
            margin: 2px 0 0;
            font-size: 0.8rem;
            color: var(--text-secondary);
            word-break: break-all;
          }
        }

        .card-head-extra {
          display: flex;
          gap: 8px;
          align-items: center;

          .state-chip {
            padding: 5px 10px;
            border-radius: 999px;
            border: 1px solid var(--border-color);
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--text-secondary);
            background: var(--surface);

            &.is-dirty {
              color: #0b6b4f;
              border-color: rgba(16, 185, 129, 0.45);
              background: rgba(16, 185, 129, 0.16);
            }
          }
        }
      }

      .setting-example {
        margin: 12px 0;
        font-size: 0.86rem;
        color: var(--text-secondary);
        font-style: italic;
      }

      .setting-form-row {
        :deep(.vue-input) {
          width: 100%;
        }
      }

      .card-actions {
        margin-top: 14px;
        display: flex;
        justify-content: flex-end;
      }
    }

    .empty-state {
      border-radius: 16px;
      border: 1px dashed var(--border-color);
      background: var(--surface);
      padding: 22px;
      text-align: center;

      h3 {
        margin: 0;
        color: var(--text-primary);
      }

      p {
        margin: 8px 0 0;
        color: var(--text-secondary);
      }
    }
  }
}

html.theme-dark .system-setting-page {
  --surface: #101a2f;
  --surface-soft: #16223b;
  --surface-strong: #1c2d4a;
  --text-primary: #e7f0ff;
  --text-secondary: #a8bddf;
  --border-color: #2a3d62;
  --shadow-soft: 0 24px 42px -30px rgba(2, 8, 23, 0.95);
  --accent: #8bb4ff;
  --accent-soft: rgba(139, 180, 255, 0.18);
  --accent-strong: #c7dbff;

  &::before {
    background:
      radial-gradient(circle at 12% 0%, rgba(34, 197, 94, 0.16), transparent 28%),
      radial-gradient(circle at 90% 0%, rgba(59, 130, 246, 0.2), transparent 30%),
      linear-gradient(180deg, rgba(16, 26, 47, 0.92), rgba(10, 17, 34, 0.95));
  }

  .settings-list {
    .setting-card {
      .card-head {
        .card-head-extra {
          .state-chip {
            &.is-dirty {
              color: #75f5c1;
              border-color: rgba(52, 211, 153, 0.45);
              background: rgba(16, 185, 129, 0.22);
            }
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .system-setting-page {
    .settings-hero {
      grid-template-columns: auto 1fr;

      .hero-metrics {
        grid-column: 1 / -1;
        width: 100%;

        .metric-card {
          flex: 1;
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .system-setting-page {
    padding: 12px;

    .settings-hero {
      padding: 14px;
      gap: 12px;

      .hero-icon {
        width: 46px;
        height: 46px;
      }

      .hero-content {
        h2 {
          font-size: 1.05rem;
        }

        p {
          font-size: 0.88rem;
        }
      }

      .hero-metrics {
        flex-direction: column;
      }
    }

    .settings-list {
      .setting-card {
        padding: 14px;

        .card-head {
          flex-direction: column;
          align-items: stretch;

          .card-head-main {
            align-items: flex-start;
          }
        }

        .card-actions {
          justify-content: flex-start;
        }
      }
    }
  }
}
</style>
