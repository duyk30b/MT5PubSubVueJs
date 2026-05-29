import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    base: './',
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      outDir: 'docs',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/tinymce')) {
              return 'vendor_tinymce'
            }
            if (id.includes('node_modules/monaco-editor')) {
              return 'vendor_monaco_editor'
            }
            if (id.includes('node_modules/ant-design-vue')) {
              return 'vendor_ant_design_vue'
            }
            if (id.includes('node_modules/lodash')) {
              return 'vendor_lodash'
            }
            if (id.includes('node_modules')) {
              return 'vendor_node_modules'
            }
            if (id.includes('src/modules')) {
              // return 'src_modules'
            }
            if (id.includes('src/common')) {
              return 'src_common'
            }
          },
        },
      },
    },
  }
})
