/**
 * E2E smoke test de las landings públicas.
 *
 * Verifica que / y /cadenas-gastronomicas cargan, renderizan el contenido
 * crítico (Hero CTA, secciones core, footer legal), y no tienen errores
 * de consola.
 *
 * Si esto falla en CI = la landing está rota. Crítico para conversión.
 */
import { test, expect } from '@playwright/test'
import { setupCleanPage } from './helpers.js'

test.describe('Landing / (home)', () => {
  test.beforeEach(async ({ page }) => {
    await setupCleanPage(page)
  })
  test('carga sin errores y muestra el Hero CTA', async ({ page }) => {
    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto('/')

    // El hero tiene el h1 con "Lanzá tu canal propio"
    await expect(page.getByRole('heading', { level: 1, name: /Lanzá tu canal propio/i })).toBeVisible()

    // CTA primary visible
    await expect(page.getByRole('link', { name: /Empezar 14 días gratis|Probar Deenex|Ver demo/i }).first()).toBeVisible()

    // Footer legal links presentes (Round 2 fix). Usamos `exact: true` para
    // diferenciar "Privacidad" (footer) de "política de privacidad" (legal copy
    // dentro de la home), que matchearían ambos con un regex laxo.
    await expect(page.getByRole('link', { name: 'Términos', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Privacidad', exact: true })).toBeVisible()

    // No debe haber errores de consola, excepto:
    //   - Vue warnings (dev mode noise)
    //   - 401 de GA4/analytics: en test env el measurement ID puede rechazar
    //     requests; eso no es un bug de la landing, es ruido del environment.
    //   - Failed to load resource genéricos para recursos cross-origin
    //     (fuentes Google Fonts pueden fallar en CI sin conectividad amplia).
    const realErrors = consoleErrors.filter((e) =>
      !/\[Vue warn\]/.test(e) &&
      !/Failed to load resource.*401/.test(e) &&
      !/google-analytics|googletagmanager|fonts.googleapis/.test(e),
    )
    expect(realErrors, `Console errors:\n${realErrors.join('\n')}`).toHaveLength(0)
  })

  test('disclaimer de StatsSection visible (R2-05)', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 300))
    await expect(page.getByText(/Promedios observados en clientes Deenex/)).toBeVisible({ timeout: 10_000 })
  })

  test('FAQ se puede abrir y muestra contenido', async ({ page }) => {
    await page.goto('/')
    // FAQ es la 4ta-5ta sección, scroll para que se vea
    const firstFaq = page.getByText('¿Cuánto tarda la implementación?')
    await firstFaq.scrollIntoViewIfNeeded()
    await firstFaq.click()
    // Después del click, la respuesta debe ser visible
    await expect(page.getByText(/El onboarding inicial toma entre 3 y 7/)).toBeVisible()
  })

  test('CTA principal navega al onboarding (no full reload)', async ({ page }) => {
    await page.goto('/')
    // Click en el CTA del navbar (Round 2 fix: usa RouterLink)
    const navbarCta = page.locator('nav').getByRole('link', { name: /Empezar 14 días/i })
    await navbarCta.click()
    await expect(page).toHaveURL(/\/comenzar/)
    // Step 1 visible
    await expect(page.getByRole('heading', { name: /Decinos quién sos/i })).toBeVisible()
  })
})

test.describe('Landing /cadenas-gastronomicas (variante A/B)', () => {
  test('carga y muestra el copy de la variante (R2-01)', async ({ page }) => {
    await page.goto('/cadenas-gastronomicas')

    // Same h1 base (la variante tiene mismo copy de hero en el config)
    await expect(page.getByRole('heading', { level: 1, name: /Lanzá tu canal propio/i })).toBeVisible()

    // FAQ del variant debe estar (mismas preguntas pero el componente ahora ACEPTA el content prop)
    const faqHeading = page.getByRole('heading', { level: 2, name: /Todo lo que necesitás/i })
    await faqHeading.scrollIntoViewIfNeeded()
    await expect(faqHeading).toBeVisible()
  })

  test('tiene meta robots=noindex (no canibaliza SEO de home)', async ({ page }) => {
    await page.goto('/cadenas-gastronomicas')
    // El head se actualiza on mount
    await page.waitForFunction(() =>
      document.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex')
    , { timeout: 5_000 })
    const robotsContent = await page.evaluate(() =>
      document.querySelector('meta[name="robots"]')?.getAttribute('content')
    )
    expect(robotsContent).toMatch(/noindex/)
  })
})

test.describe('Legal pages', () => {
  test('/terminos carga con email de contacto (R2-03 + F-03b)', async ({ page }) => {
    await page.goto('/terminos')
    // El h1 dice "Reglas claras, sin sorpresas." pero hay un eyebrow "Términos y condiciones"
    await expect(page.getByText(/Términos y condiciones/i)).toBeVisible()
    // El email legal@deenex.tech viene de contact.js
    await expect(page.getByText('legal@deenex.tech')).toBeVisible()
  })

  test('/privacidad carga con email de privacidad', async ({ page }) => {
    await page.goto('/privacidad')
    // `getByText(/Política de privacidad/i)` matcheaba el eyebrow de la legal
    // page Y el link "política de privacidad" (minúscula) del consent banner.
    // El eyebrow en la página es uppercase exact match, así filtra solo ese.
    // El h1 de la página dice "Tu data, tu propiedad." (no contiene "Privacidad").
    await expect(page.getByText('Política de privacidad', { exact: true })).toBeVisible()
    await expect(page.getByText('privacidad@deenex.tech')).toBeVisible()
  })
})

test.describe('404 page', () => {
  test('ruta inexistente muestra NotFoundView con email de contacto', async ({ page }) => {
    await page.goto('/esto-no-existe-12345')
    await expect(page.getByText('hola@deenex.tech')).toBeVisible()
  })
})
