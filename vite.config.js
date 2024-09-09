/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/vue-todo-app/',
  plugins: [vue(), mode === 'development' && vueDevTools()].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    modules: {
      generateScopedName: mode === 'production' ? '[local]_[hash:base64:5]' : '[local]'
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    root: fileURLToPath(new URL('./', import.meta.url)),
    coverage: {
      provider: 'v8',
      include: ['**/*.{js,vue}'],
      reporter: ['text', 'json', 'html']
    }
  }
}))
