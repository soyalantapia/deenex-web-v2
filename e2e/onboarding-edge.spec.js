/**
 * E2E de cases edge del onboarding: Enterprise branch, Resume, Exit modal.
 *
 * Cubre los forks del happy path que ningún unit test puede verificar end-to-end.
 */
import { test, expect } from '@playwright/test'
import { setupCleanPage, seedOnboardingState } from './helpers.js'

test.describe('Onboarding · Enterprise branch (F-01)', () => {
  test.beforeEach(async ({ page }) => {
    await setupCleanPage(page)
  })

  test('Enterprise welcome muestra CTAs WhatsApp + Calendar con datos del lead (R4-01)', async ({ page }) => {
    // E2E pragmático: seed state completo con Enterprise plan + welcome reached.
    // No testamos el form filling del onboarding completo acá (cubierto en
    // happy path + unit tests); validamos lo crítico del fix R4-01: que el
    // welcome Enterprise tiene los 2 CTAs con datos pre-rellenados correctos.
    await seedOnboardingState(page, {
      identity: {
        fullName: 'Mariano Enterprise',
        firstName: 'Mariano',
        lastName: 'Enterprise',
        email: 'mariano@cadena-grande.com',
        whatsapp: '+54 11 5555 0000',
      },
      business: {
        brand: 'Cadena Grande',
        locations: 150,
        pos: 'fudo',
        posOther: '',
        channels: ['delivery_propio'],
        subdomainOverride: '',
      },
      plan: { key: 'enterprise', billingCycle: 'monthly' },
      trial: { activatedAt: null, paymentChoice: null },
      meta: { startedAt: new Date().toISOString(), completedSteps: ['identity', 'business', 'savings', 'plan'] },
    })

    // Llegamos directo al welcome con flag enterprise=1
    await page.goto('/comenzar/listo?enterprise=1')

    // El heading Enterprise distinto al de trial activado
    await expect(page.getByRole('heading', { level: 1, name: /solicitud Enterprise|ya está en revisión/i })).toBeVisible()

    // R4-01 fix: los DOS CTAs presentes
    await expect(page.getByRole('link', { name: /Agendar reunión/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Chatear por WhatsApp/i })).toBeVisible()

    // El href de WhatsApp incluye datos del lead (verificación del template)
    const waLink = await page.getByRole('link', { name: /Chatear por WhatsApp/i }).getAttribute('href')
    expect(waLink).toContain('wa.me/')
    expect(waLink).toContain('text=')
    const decodedText = decodeURIComponent(waLink)
    expect(decodedText).toContain('Cadena Grande')
    expect(decodedText).toContain('150 locales')
    expect(decodedText).toContain('mariano@cadena-grande.com')
  })
})

test.describe('Onboarding · Resume flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupCleanPage(page)
  })

  test('lead con progreso parcial ve ResumeModal en /comenzar', async ({ page }) => {
    // Setup: simulamos un lead que llegó a step business y se fue
    await seedOnboardingState(page, {
      identity: {
        fullName: 'Sofía Resume',
        firstName: 'Sofía',
        lastName: 'Resume',
        email: 'sofia@marca.com',
        whatsapp: '+54 11 9999 8888',
      },
      business: { brand: 'Marca Sofía', locations: 3, pos: 'fudo', posOther: '', channels: ['delivery_propio'] },
      meta: {
        startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h atrás
        completedSteps: ['identity', 'business'],
      },
    })

    await page.goto('/comenzar')

    // ResumeModal aparece con role=dialog (R4-04)
    await expect(page.getByRole('dialog', { name: /Te reconocemos/i })).toBeVisible()
    await expect(page.getByText(/sofia@marca.com/)).toBeVisible()
    await expect(page.getByText(/Marca Sofía/)).toBeVisible()
  })

  test('click "Continuar donde dejé" lleva al primer step incompleto (savings)', async ({ page }) => {
    await seedOnboardingState(page, {
      identity: { fullName: 'Sofía', firstName: 'Sofía', lastName: '', email: 'sofia@m.com', whatsapp: '+54 11 9999 8888' },
      business: { brand: 'M', locations: 2, pos: 'fudo', posOther: '', channels: ['delivery_propio'] },
      meta: { startedAt: new Date().toISOString(), completedSteps: ['identity', 'business'] },
    })
    await page.goto('/comenzar')
    await page.getByRole('button', { name: /Continuar donde dejé/i }).click()
    // Después de business, el siguiente step pendiente es savings
    await expect(page).toHaveURL(/\/comenzar\/ahorro/)
  })

  test('click "Empezar de cero" resetea state y queda en step 1', async ({ page }) => {
    await seedOnboardingState(page, {
      identity: { fullName: 'X', firstName: 'X', lastName: '', email: 'x@x.com', whatsapp: '+54 11 1234 5678' },
      business: { brand: 'X', locations: 1, pos: 'fudo', posOther: '', channels: [] },
      meta: { startedAt: new Date().toISOString(), completedSteps: ['identity'] },
    })
    await page.goto('/comenzar')
    await page.getByRole('button', { name: /Empezar de cero/i }).click()

    // El form de identity debe quedar vacío
    await expect(page.getByLabel(/Tu nombre/i)).toHaveValue('')
    await expect(page.getByLabel(/Tu email/i)).toHaveValue('')
  })
})

test.describe('Onboarding · keyboard a11y', () => {
  test.beforeEach(async ({ page }) => {
    await setupCleanPage(page)
  })

  test('Tab navega entre fields de StepIdentity sin escapar al footer', async ({ page }) => {
    await page.goto('/comenzar')

    // El primer focusable principal debería ser el nombre input. v-autofocus
    // ya lo focusea on mount; igual lo aseguramos.
    await page.getByLabel(/Tu nombre/i).focus()

    // Tab → email field
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/Tu email/i)).toBeFocused()

    // Tab → siguiente focusable. Acepta cualquiera de los siguientes:
    //   - PhoneField country picker (button con aria-label "País: ...")
    //   - PhoneField tel input (sin aria-label, con label[for])
    //   - StepActions buttons
    // Lo crítico es que el foco quede DENTRO del form, no escape al footer/legal links.
    await page.keyboard.press('Tab')

    const focusInfo = await page.evaluate(() => {
      const el = document.activeElement
      if (!el) return null
      return {
        tag: el.tagName,
        type: el.getAttribute('type'),
        ariaLabel: el.getAttribute('aria-label') || '',
        id: el.id || '',
        // ¿está dentro del form principal del step?
        insideForm: !!el.closest('form'),
      }
    })

    expect(focusInfo, 'Active element debería existir tras Tab').not.toBeNull()
    expect(focusInfo.insideForm, 'Foco debe quedar dentro del form, no escapar').toBe(true)
    // El próximo focusable debe ser button (country picker) o input tel
    expect(['BUTTON', 'INPUT']).toContain(focusInfo.tag)
  })

  test('error en email tiene aria-invalid + aria-describedby (R4-02)', async ({ page }) => {
    await page.goto('/comenzar')
    const emailInput = page.getByLabel(/Tu email/i)
    await emailInput.fill('bad-email')
    await emailInput.blur()

    await expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    const describedBy = await emailInput.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    // El elemento referenciado debe existir y contener el mensaje de error
    const errorEl = page.locator(`#${describedBy}`)
    await expect(errorEl).toContainText(/email válido/i)
  })
})
