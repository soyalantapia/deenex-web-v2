import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    '**/playwright-report/**',
    '**/test-results/**',
  ]),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // vite.config.js corre en Node, no en el browser: `process` es global válido.
  // ESLint 10 ya no soporta /* eslint-env node */ inline, así que lo declaramos acá.
  {
    files: ['vite.config.js', '*.config.js', '*.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Tests: vitest expone describe/it/expect/beforeEach/afterEach/vi como
  // globals (config `test.globals: true`). Sin esto ESLint los marca como
  // undefined.
  {
    files: ['tests/**/*.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        test: 'readonly',
      },
    },
  },

  // E2E tests con Playwright: usa `test`/`expect` importados explícitamente
  // desde @playwright/test, así que no hay globals. Pero corren en Node y
  // necesitan el environment de browser-driver. Aceptamos process/console.
  {
    files: ['e2e/**/*.js', 'playwright.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // Los componentes helper internos (Field, Button, Tooltip, etc.) tienen nombres
  // de una sola palabra por diseño — son primitivos del sistema, no hay riesgo de
  // colisión con elementos HTML nativos.
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
])
