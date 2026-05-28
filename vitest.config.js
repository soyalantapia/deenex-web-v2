import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Config separada de vite.config.js para no contaminar el build de producción
// con dependencias de testing (jsdom, @vue/test-utils). Vitest las usa solo en
// el modo test; el bundle de producción queda igual.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // jsdom para que document/window estén disponibles (los composables y
    // componentes acceden a window.localStorage, document.activeElement, etc.).
    environment: 'jsdom',
    globals: true,
    // Excluimos dist/ y node_modules/ para no testear builds o deps.
    // e2e/ tiene specs de Playwright (test.describe distinto al de vitest) —
    // los corre `npm run test:e2e`, no vitest.
    exclude: ['node_modules', 'dist', '.git', 'e2e/**'],
    // Setup global que stubea import.meta.env y otras cosas que no son fáciles
    // de mockear por test.
    setupFiles: ['./tests/setup.js'],
  },
})
