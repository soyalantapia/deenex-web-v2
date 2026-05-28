/**
 * E2E del onboarding happy path completo (Identity → Welcome).
 *
 * Cubre el flujo end-to-end que NINGÚN unit test puede cubrir:
 *   1. Lead llega al CTA del navbar → /comenzar
 *   2. Llena Identity (fullName, email, whatsapp) → valid → Continuar
 *   3. Llena Business (brand, locations, pos, channels) → valid → Continuar
 *   4. Ve StepSavings, ajusta ROI calc, sigue
 *   5. Ve StepPlan con tier recomendado, click Continuar
 *   6. StepTrial, click Activar
 *   7. ActivationOverlay corre → Welcome
 *
 * Si esto falla = el onboarding self-serve está roto. El producto entero
 * depende de esto funcionando.
 */
import { test, expect } from '@playwright/test'
import { setupCleanPage, seedOnboardingState } from './helpers.js'

test.describe('Onboarding happy path', () => {
  test.beforeEach(async ({ page }) => {
    // setupCleanPage: clear storage + dismiss cookie consent. El consent banner
    // tiene role="dialog" y bloquea pointer events si no lo dismisseamos antes.
    await setupCleanPage(page)
  })

  test('home → onboarding entry: navbar CTA navega a /comenzar', async ({ page }) => {
    await page.goto('/')
    // Esperar a que el hero termine el setTimeout(2300) ready state — antes de
    // eso el LoadingScreen puede estar visible y bloquear el click.
    await page.waitForTimeout(2500)
    const navbarCta = page.locator('nav').getByRole('link', { name: /Empezar 14 días/i })
    await expect(navbarCta).toBeVisible()
    // Click + waitForURL en paralelo: dispara la nav y espera URL match.
    await Promise.all([page.waitForURL(/\/comenzar/, { timeout: 10_000 }), navbarCta.click()])
    await expect(page.getByRole('heading', { name: /Decinos quién sos/i })).toBeVisible()
  })

  test('Plan → /listo: ActivationOverlay corre automático sin tarjeta → Welcome wow moment', async ({ page }) => {
    // Wow-moment-first: el step de tarjeta (/activar) salió del flow. El lead
    // pasa de Plan directo a /listo, donde el ActivationOverlay corre al mount
    // SIN pedir tarjeta. Cuando termina, muestra el welcome con la URL viva.
    // Lo crítico de E2E acá:
    //   1. /listo renderiza con ActivationOverlay visible inmediatamente
    //   2. El overlay corre y emite @complete
    //   3. Welcome muestra el subdomain live + URL de la marca
    //   4. No hay mención de "Primer cargo USD X" (sacamos el paywall)
    await seedOnboardingState(page, {
      identity: {
        fullName: 'Marcos Test',
        firstName: 'Marcos',
        lastName: 'Test',
        email: 'marcos@palta.com.ar',
        whatsapp: '+54 11 5555 4444',
      },
      business: {
        brand: 'Marca Test',
        locations: 5,
        pos: 'fudo',
        posOther: '',
        channels: ['delivery_propio'],
        subdomainOverride: '',
        avgTicketUsd: 15,
        ordersPerLocation: 300,
      },
      plan: { key: 'crecimiento', billingCycle: 'monthly' },
      trial: { activatedAt: null, paymentChoice: null },
      meta: { startedAt: new Date().toISOString(), completedSteps: ['identity', 'business', 'savings', 'plan'] },
    })

    await page.goto('/comenzar/listo')

    // ActivationOverlay aparece inmediatamente (no hace falta click).
    await expect(page.getByRole('dialog', { name: /Procesando|Activando|Conectando|Todo listo|Cuenta lista/i }))
      .toBeVisible({ timeout: 5_000 })

    // Esperar a que el overlay termine (corre ~13s en sim). Cuando termina, el
    // welcome se revela con el subdomain prominente.
    await expect(page.getByRole('heading', { name: /ya está viva|Marca Test/i }))
      .toBeVisible({ timeout: 25_000 })

    // Wow moment central: la URL de la marca está visible como link.
    await expect(page.locator('code', { hasText: /\.deenex\.app/ }).first()).toBeVisible()

    // Que NO aparezca el copy viejo del paywall — eso se movió al dashboard.
    await expect(page.getByText(/Primer cargo/i)).not.toBeVisible()
  })

  test('Identity bloquea Continuar con email inválido (validación)', async ({ page }) => {
    await page.goto('/comenzar')
    await page.getByLabel(/Tu nombre/i).fill('Test')
    await page.getByLabel(/Tu email/i).fill('no-es-email')
    await page.getByLabel('WhatsApp', { exact: false }).fill('11 1234 5678')

    // Disparar blur
    await page.getByLabel(/Tu email/i).blur()
    // Error visible (R4-02: role=alert, aria-live)
    await expect(page.getByRole('alert').filter({ hasText: /Necesitamos un email válido/i })).toBeVisible()

    // Botón Continuar disabled
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled()
  })

  test('Identity: email descartable bloqueado (mailinator)', async ({ page }) => {
    await page.goto('/comenzar')
    await page.getByLabel(/Tu nombre/i).fill('Test User')
    await page.getByLabel(/Tu email/i).fill('hello@mailinator.com')
    await page.getByLabel(/Tu email/i).blur()

    await expect(page.getByText(/email permanente/i)).toBeVisible()
  })
})
