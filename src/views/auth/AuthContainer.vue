<script setup lang="ts">
import { LOCAL_STORAGE_KEYS } from '@/core/local_storage/local_storage_keys'
import { onMounted, ref } from 'vue'

const themeMode = ref<'light' | 'dark'>('light')

const applyTheme = (mode: 'light' | 'dark') => {
  themeMode.value = mode
  localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, mode)
  document.documentElement.classList.toggle('theme-dark', mode === 'dark')
}

const toggleTheme = () => {
  applyTheme(themeMode.value === 'light' ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light'
  applyTheme(savedTheme)
})
</script>

<template>
  <div class="auth-screen" :class="{ 'is-dark': themeMode === 'dark' }">
    <button class="theme-switch" type="button" @click="toggleTheme">
      <span>{{ themeMode === 'dark' ? 'Dark' : 'Light' }}</span>
      <span class="theme-switch-track">
        <span class="theme-switch-dot" />
      </span>
    </button>

    <div class="ambient ambient-left" />
    <div class="ambient ambient-right" />

    <div class="auth-shell">
      <section class="auth-brand">
        <p class="brand-kicker">MT5 PUBSUB</p>
        <h1>Bảng điều khiển quản trị realtime</h1>
        <p class="brand-description">
          Theo dõi người dùng, vai trò và phân quyền trên một giao diện tập trung, nhanh và trực
          quan.
        </p>

        <div class="brand-highlights">
          <div class="highlight-item">
            <strong>Realtime socket</strong>
            <span>Đồng bộ trạng thái hệ thống gần như tức thì.</span>
          </div>
          <div class="highlight-item">
            <strong>Permission theo role</strong>
            <span>Kiểm soát quyền truy cập rõ ràng cho từng nhóm người dùng.</span>
          </div>
          <div class="highlight-item">
            <strong>Bảo mật đăng nhập</strong>
            <span>Tập trung xác thực và theo dõi phiên truy cập tập trung.</span>
          </div>
        </div>

        <div class="brand-footer">
          <p>Công ty TNHH Công nghệ và TM MEDIAI</p>
          <p>
            HOTLINE:
            <a href="tel:0376899866">0376.899.866</a>
          </p>
        </div>
      </section>

      <section class="auth-panel-wrap">
        <RouterView />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-screen {
  --auth-bg:
    radial-gradient(circle at 12% 12%, #f6f2df 0%, transparent 46%),
    radial-gradient(circle at 86% 20%, #c8e8ff 0%, transparent 42%),
    linear-gradient(135deg, #f4f8ff 0%, #e7eefb 48%, #edf3ff 100%);
  --shell-bg: rgba(255, 255, 255, 0.74);
  --shell-border: rgba(17, 24, 39, 0.08);
  --brand-bg: linear-gradient(160deg, #0f4c81 0%, #0c3a64 44%, #082745 100%);
  --brand-text: #e5f1ff;
  --panel-text: #10213b;
  --panel-text-soft: #516278;
  --field-label: #22324c;
  --highlight-bg: rgba(219, 234, 254, 0.14);
  --highlight-border: rgba(219, 234, 254, 0.22);
  --ambient-left: rgba(243, 201, 105, 0.32);
  --ambient-right: rgba(82, 164, 255, 0.3);
  --focus-ring: rgba(37, 99, 235, 0.28);

  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--auth-bg);
  transition: background 0.35s ease;

  &.is-dark {
    --auth-bg:
      radial-gradient(circle at 14% 18%, #1f283f 0%, transparent 52%),
      radial-gradient(circle at 88% 16%, #213c57 0%, transparent 46%),
      linear-gradient(140deg, #070b16 0%, #0b1220 46%, #0a1326 100%);
    --shell-bg: rgba(8, 13, 24, 0.74);
    --shell-border: rgba(174, 205, 255, 0.22);
    --brand-bg: linear-gradient(160deg, #4b8ccc 0%, #32679b 50%, #22496f 100%);
    --brand-text: #eff7ff;
    --panel-text: #dde8fb;
    --panel-text-soft: #9eb0cc;
    --field-label: #bed0ea;
    --highlight-bg: rgba(219, 234, 254, 0.11);
    --highlight-border: rgba(219, 234, 254, 0.24);
    --ambient-left: rgba(84, 88, 167, 0.34);
    --ambient-right: rgba(52, 167, 255, 0.24);
    --focus-ring: rgba(88, 148, 255, 0.36);
  }
}

.theme-switch {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 3;
  border: 1px solid color-mix(in srgb, var(--shell-border) 65%, transparent);
  background: color-mix(in srgb, var(--shell-bg) 95%, transparent);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 6px 14px;
  color: var(--panel-text);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--focus-ring) 85%, white 15%);
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px var(--focus-ring);
  }

  .theme-switch-track {
    width: 42px;
    height: 24px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--panel-text) 16%, transparent);
    padding: 3px;
    display: flex;
  }

  .theme-switch-dot {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: var(--panel-text);
    transform: translateX(0);
    transition: transform 0.2s ease;
  }
}

.auth-screen.is-dark .theme-switch .theme-switch-dot {
  transform: translateX(18px);
}

.ambient {
  position: absolute;
  width: clamp(220px, 30vw, 460px);
  height: clamp(220px, 30vw, 460px);
  border-radius: 999px;
  filter: blur(14px);
  pointer-events: none;
}

.ambient-left {
  left: -90px;
  bottom: -80px;
  background: var(--ambient-left);
}

.ambient-right {
  right: -100px;
  top: -70px;
  background: var(--ambient-right);
}

.auth-shell {
  width: min(980px, 100%);
  min-height: 620px;
  border-radius: 28px;
  border: 1px solid var(--shell-border);
  background: var(--shell-bg);
  backdrop-filter: blur(18px);
  box-shadow:
    0 22px 58px rgba(10, 22, 42, 0.2),
    0 2px 0 rgba(255, 255, 255, 0.3) inset;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.auth-brand {
  background: var(--brand-bg);
  color: var(--brand-text);
  padding: 40px 34px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  .brand-kicker {
    margin: 0;
    letter-spacing: 0.18em;
    font-size: 12px;
    text-transform: uppercase;
    opacity: 0.8;
  }

  h1 {
    margin: 0;
    font-size: clamp(28px, 3.2vw, 38px);
    line-height: 1.1;
    max-width: 9.8em;
  }

  .brand-description {
    margin: 0;
    color: color-mix(in srgb, var(--brand-text) 86%, black 14%);
    max-width: 32ch;
    line-height: 1.55;
  }

  .brand-highlights {
    margin-top: 6px;
    display: grid;
    gap: 10px;
  }

  .highlight-item {
    border-radius: 14px;
    border: 1px solid var(--highlight-border);
    background: var(--highlight-bg);
    padding: 12px 14px;
    display: grid;
    gap: 4px;

    strong {
      font-size: 14px;
    }

    span {
      font-size: 13px;
      line-height: 1.4;
      color: color-mix(in srgb, var(--brand-text) 82%, black 18%);
    }
  }

  .brand-footer {
    margin-top: auto;
    font-size: 12px;
    line-height: 1.45;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--brand-text) 88%, black 12%);

    p {
      margin: 0;
    }

    a {
      text-decoration: underline;
      text-underline-offset: 3px;
      font-weight: 700;
    }
  }
}

.auth-panel-wrap {
  padding: clamp(26px, 4vw, 42px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--panel-text);
}

:deep(.auth-panel) {
  display: flex;
  flex-direction: column;

  .panel-kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 12px;
    color: var(--panel-text-soft);
  }

  h2 {
    margin: 10px 0 8px;
    font-size: clamp(24px, 3vw, 34px);
    line-height: 1.14;
  }

  .panel-description {
    margin: 0;
    color: var(--panel-text-soft);
    font-size: 14px;
    line-height: 1.5;
  }

  .panel-note {
    margin: 16px 0 0;
    font-size: 12px;
    color: color-mix(in srgb, var(--panel-text-soft) 90%, transparent);
  }
}

:deep(.auth-form) {
  display: grid;
  gap: 12px;
  margin-top: 24px;

  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--field-label);
  }

  .auth-link {
    justify-self: end;
    padding: 0;
    border: 0;
    background: transparent;
    color: color-mix(in srgb, var(--panel-text) 74%, #2f6de6 26%);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  .submit-btn {
    width: 100%;
    margin-top: 2px;
  }
}

@media (max-width: 980px) {
  .auth-screen {
    padding: 64px 16px 18px;
  }

  .auth-shell {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .auth-brand {
    padding: 28px 24px;

    h1 {
      max-width: none;
    }
  }

  .auth-panel-wrap {
    padding: 28px 24px;
  }

  .theme-switch {
    top: 14px;
    right: 14px;
  }
}

@media (max-width: 560px) {
  .auth-brand {
    .brand-highlights {
      gap: 8px;
    }

    .highlight-item {
      padding: 10px 12px;
    }
  }
}
</style>
