/**
 * Helpers compartidos para los E2E tests.
 *
 * dismissCookieConsent: el CookieConsentBanner aparece bottom-fixed con
 * `role="dialog"` y bloquea cualquier click overlapping. En tests queremos
 * pre-aceptar el consent para no perder tiempo dismissing manualmente y para
 * que GA4 reciba eventos como en producción real.
 */

export async function dismissCookieConsent(page) {
  await page.evaluate(() => {
    try {
      localStorage.setItem('deenex_consent_v1', 'all')
      localStorage.setItem(
        'deenex_consent_granular_v1',
        JSON.stringify({ analytics: true, marketing: true }),
      )
    } catch {
      // private mode, banner igual aparece — los tests que dependen de UI
      // específica del banner deberían chequear con isVisible() antes.
    }
  })
}

/**
 * Helper para setear el state del onboarding directamente via localStorage.
 * Útil para empezar tests desde un step específico sin tener que recorrer
 * todos los pasos previos (más rápido + menos flaky que UI interaction).
 *
 * @param {import('@playwright/test').Page} page
 * @param {object} overrides - Campos a sobreescribir del state default.
 */
export async function seedOnboardingState(page, overrides = {}) {
  const defaultState = {
    identity: {
      fullName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@deenex-e2e.com',
      whatsapp: '+54 11 5555 4444',
    },
    business: { brand: '', locations: 1, pos: '', posOther: '', channels: [], subdomainOverride: '' },
    plan: { key: null, billingCycle: 'monthly' },
    trial: { activatedAt: null, paymentChoice: null },
    meta: { startedAt: new Date().toISOString(), completedSteps: [] },
  }
  // Merge shallow — para escenarios más complejos, pasar el state completo.
  const state = { ...defaultState, ...overrides }
  state.identity = { ...defaultState.identity, ...(overrides.identity || {}) }
  state.business = { ...defaultState.business, ...(overrides.business || {}) }
  state.plan = { ...defaultState.plan, ...(overrides.plan || {}) }
  state.trial = { ...defaultState.trial, ...(overrides.trial || {}) }
  state.meta = { ...defaultState.meta, ...(overrides.meta || {}) }

  await page.evaluate((s) => {
    localStorage.setItem('deenex_onboarding_v1', JSON.stringify(s))
  }, state)
}

/**
 * Wrapper completo del setup standard: clear storage, dismiss consent,
 * seed onboarding state (opcional). Idempotente, llamalo en cada beforeEach.
 */
export async function setupCleanPage(page, options = {}) {
  await page.goto('/')
  await page.evaluate(() => {
    try { localStorage.clear() } catch { /* */ }
    try { sessionStorage.clear() } catch { /* */ }
  })
  await dismissCookieConsent(page)
  if (options.onboarding) await seedOnboardingState(page, options.onboarding)
}

/**
 * Submit el primer <form> de la página vía form.requestSubmit().
 *
 * Playwright .click() en buttons type="submit" puede ser flaky con Vue
 * cuando hay v-models complejos que no se han propagado (especialmente
 * PhoneField con su composeValue child→parent). requestSubmit() dispara un
 * submit event nativo en el form que fuerza @submit.prevent handler a correr.
 *
 * Cuidado: no usa esto si necesitás validar que un button específico (no el
 * submit) se clickea. Para flow happy path donde sabemos que el form es
 * válido, es más confiable.
 */
export async function submitForm(page) {
  await page.evaluate(() => {
    const form = document.querySelector('form')
    if (form && typeof form.requestSubmit === 'function') {
      form.requestSubmit()
    } else if (form) {
      form.submit()
    }
  })
}
