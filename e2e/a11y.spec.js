/**
 * E2E de a11y con axe-core.
 *
 * Corre axe contra cada ruta pública y onboarding step, falla el test si
 * hay violations de severidad 'serious' o 'critical'.
 *
 * El gating de niveles de severidad importa: axe reporta muchas cosas como
 * 'moderate' o 'minor' que no queremos romper la build (color contrast en
 * decorativos, landmarks redundantes, etc). Lo que SI bloqueamos:
 *   - serious: nav-by-keyboard imposible, alt missing en imgs significativas
 *   - critical: pages sin lang, buttons sin name, controls sin label
 *
 * Round 4 cerró: aria-invalid, aria-describedby, role=dialog en modales,
 * focus-visible. Round 5: clipboard fallback, prefers-reduced-motion.
 */
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { setupCleanPage, seedOnboardingState } from './helpers.js'

const SERIOUS_AND_CRITICAL = ['serious', 'critical']

// Helper: ejecuta axe y filtra solo violations serias/críticas.
async function checkA11y(page, opts = {}) {
  const builder = new AxeBuilder({ page })
    // Reglas que sabemos están OK pero axe se queja (false positives típicos)
    .disableRules([
      // Tailwind transition-opacity en transitions Vue puede flagear durante el frame
      'color-contrast', // lo verificamos manual; axe en CI da false positives en gradients
    ])
  if (opts.include) builder.include(opts.include)
  const results = await builder.analyze()
  const blocking = results.violations.filter((v) => SERIOUS_AND_CRITICAL.includes(v.impact))
  return blocking
}

test.describe('a11y · landings públicas', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-aceptamos cookie consent para que axe no escanee el banner (que es
    // un dialog visible pero secundario). El consent banner ya tiene su a11y
    // test propio si querés cubrirlo.
    await setupCleanPage(page)
  })

  test('/ sin violations serias/críticas', async ({ page }) => {
    // Antes usábamos `waitUntil: 'networkidle'` pero el Vue3Marquee de Partners/
    // Clients corre animaciones infinitas que mantienen la página "non-idle"
    // forever. Cambiamos a domcontentloaded + wait explícito para el hero.
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Hero animation tiene un setTimeout(2300ms) antes del ready state.
    await page.waitForTimeout(2800)
    const violations = await checkA11y(page)
    expect(
      violations,
      `axe violations:\n${JSON.stringify(violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), null, 2)}`,
    ).toHaveLength(0)
  })

  test('/cadenas-gastronomicas sin violations serias/críticas', async ({ page }) => {
    await page.goto('/cadenas-gastronomicas', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2800)
    const violations = await checkA11y(page)
    expect(violations.map((v) => v.id)).toEqual([])
  })

  test('/terminos sin violations serias/críticas', async ({ page }) => {
    await page.goto('/terminos')
    const violations = await checkA11y(page)
    expect(violations.map((v) => v.id)).toEqual([])
  })

  test('/privacidad sin violations serias/críticas', async ({ page }) => {
    await page.goto('/privacidad')
    const violations = await checkA11y(page)
    expect(violations.map((v) => v.id)).toEqual([])
  })

  test('/404 (NotFoundView) sin violations serias/críticas', async ({ page }) => {
    await page.goto('/no-existe-12345')
    const violations = await checkA11y(page)
    expect(violations.map((v) => v.id)).toEqual([])
  })
})

test.describe('a11y · onboarding steps', () => {
  test.beforeEach(async ({ page }) => {
    await setupCleanPage(page)
  })

  test('StepIdentity sin violations (R4-02 Field a11y)', async ({ page }) => {
    await page.goto('/comenzar')
    const violations = await checkA11y(page)
    expect(violations.map((v) => v.id)).toEqual([])
  })

  test('StepIdentity con error: aria-invalid + aria-describedby correctos', async ({ page }) => {
    await page.goto('/comenzar')
    await page.getByLabel(/Tu email/i).fill('bad')
    await page.getByLabel(/Tu email/i).blur()

    const violations = await checkA11y(page)
    expect(violations.map((v) => v.id)).toEqual([])
  })

  test('StepBusiness con state seeded sin violations', async ({ page }) => {
    await seedOnboardingState(page, {
      identity: { fullName: 'X', firstName: 'X', lastName: '', email: 'x@x.com', whatsapp: '+54 11 1234 5678' },
      meta: { startedAt: new Date().toISOString(), completedSteps: ['identity'] },
    })
    await page.goto('/comenzar/negocio')

    const violations = await checkA11y(page)
    expect(violations.map((v) => v.id)).toEqual([])
  })
})
