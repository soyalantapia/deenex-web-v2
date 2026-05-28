import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E config para deenex-web-v2.
 *
 * Diferencia importante vs vitest:
 *   - vitest corre tests UNIT/COMPONENT en jsdom (rápido, sin browser real).
 *   - Playwright corre tests E2E en Chromium real (lento, valida flow real).
 *
 * Auto-start del dev server: `webServer` levanta Vite antes de los tests y lo
 * mata al terminar. Si ya hay un server corriendo en :5173, lo reusamos.
 */
export default defineConfig({
  testDir: './e2e',
  // Cada test no debería tardar más de 30s; si lo hace, algo está mal.
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // En CI fallamos al primer error para no esperar suite completa; en dev
  // dejamos que corran todos para ver el panorama.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // workers=1 también en local: el dev server compartido entre workers genera
  // flakiness en paralelo (analytics 401, localStorage colisiones cross-test).
  // El trade-off de velocidad es chico (~30s extra) vs estabilidad.
  workers: 1,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // El sitio es mobile-first; testeamos en desktop default pero algunos
    // tests específicos sobreescriben el viewport.
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // `npm run dev` levanta Vite con --host (necesario para que Playwright lo
    // alcance desde Chromium). Reuse existente si ya está corriendo.
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
