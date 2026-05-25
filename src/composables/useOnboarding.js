/**
 * useOnboarding — estado compartido del flow de auto-onboarding.
 *
 * Persiste en localStorage (clave `deenex_onboarding_v1`) para que el lead pueda
 * cerrar la pestaña y volver sin perder progreso. Expone:
 *   - state (reactivo)
 *   - actions: setIdentity, setBusiness, setPlan, markTrialActivated, reset
 *   - computed: recommendedPlan (basado en N locales), monthlyEstimateUsd,
 *     savingsVsThirdParty, currentStep, isStepUnlocked(stepKey)
 *   - track(event, payload) — wrapper de trackEvent para namespacear los eventos
 *     GA4 del flow con prefijo `onboarding_`.
 */

import { reactive, computed, ref, watch } from 'vue'
import { trackEvent, captureUtmsFromUrl, identify, setUserProperties, getStoredUserId } from '@/utils/analytics'

const STORAGE_KEY = 'deenex_onboarding_v1'

const DEFAULT_STATE = {
  // Step 1
  identity: {
    fullName: '', // un solo campo "Nombre" (antes era firstName + lastName)
    firstName: '', // derivado de fullName.split(' ')[0] — mantenido por compat con greeting
    lastName: '',
    email: '',
    whatsapp: '',
  },
  // Step 2
  business: {
    brand: '',
    locations: 1,
    pos: '', // 'maxirest' | 'odoo' | 'other' | 'none'
    channels: [], // ['salon', 'takeaway', 'delivery_own', 'delivery_third']
    // ROI inputs reales del lead (editados en Step Plan)
    avgTicketUsd: null, // null = usar default por volumen
    ordersPerLocation: null,
    // Override del subdomain — cuando el slug derivado de brand está tomado
    // y el lead acepta la sugerencia (ej. "palta-ar"), guardamos ese override
    // acá. `subdomainPreview` computed lo respeta antes de slugify(brand).
    subdomainOverride: '',
  },
  // Step 3
  plan: {
    key: '', // 'starter' | 'growth' | 'scale' | 'pro' | 'enterprise'
    product: 'comercio', // 'comercio' | 'partners' | 'bundle'
    addLoyalty: false,
    billingCycle: 'monthly', // 'monthly' | 'annual' (annual = -20%)
  },
  // Step 4
  trial: {
    activatedAt: null,
    paymentMethod: '', // 'mercadopago' | ''
    mpPreferenceId: '',
  },
  // Meta
  meta: {
    startedAt: null,
    completedSteps: [], // ['identity', 'business', 'plan', 'trial']
    variant: '', // 'cadenas-gastronomicas' | '' (where the flow was triggered)
    utms: {}, // utm_source/medium/campaign/term/content + gclid/fbclid
  },
}

// Storage helpers SSR-safe + tolerantes a Safari privado, iOS Webview
// in-app browser y quota llena. Estrategia 3-tier:
//   1. localStorage (persiste cross-session)
//   2. sessionStorage (persiste por pestaña)
//   3. Map en memoria (lifetime de la app, mejor que nada)
const memStorage = new Map()

function safeGetItem(key) {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage?.getItem(key)
    if (v != null) return v
  } catch { /* private mode / blocked */ }
  try {
    const v = window.sessionStorage?.getItem(key)
    if (v != null) return v
  } catch { /* sandbox */ }
  return memStorage.get(key) ?? null
}

function safeSetItem(key, val) {
  if (typeof window === 'undefined') return 'memory'
  try {
    window.localStorage?.setItem(key, val)
    return 'local'
  } catch { /* quota / private / blocked */ }
  try {
    window.sessionStorage?.setItem(key, val)
    return 'session'
  } catch { /* sandbox */ }
  memStorage.set(key, val)
  return 'memory'
}

function safeRemoveItem(key) {
  if (typeof window === 'undefined') return
  try { window.localStorage?.removeItem(key) } catch { /* */ }
  try { window.sessionStorage?.removeItem(key) } catch { /* */ }
  memStorage.delete(key)
}

function loadFromStorage() {
  if (typeof window === 'undefined') return structuredClone(DEFAULT_STATE)
  try {
    const raw = safeGetItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    const parsed = JSON.parse(raw)
    // Shallow merge with defaults to handle schema additions
    return {
      identity: { ...DEFAULT_STATE.identity, ...parsed.identity },
      business: { ...DEFAULT_STATE.business, ...parsed.business },
      plan: { ...DEFAULT_STATE.plan, ...parsed.plan },
      trial: { ...DEFAULT_STATE.trial, ...parsed.trial },
      meta: { ...DEFAULT_STATE.meta, ...parsed.meta },
    }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

// Singleton: una sola instancia compartida entre todos los steps.
const state = reactive(loadFromStorage())

// ── Auto-save indicator ────────────────────────────────────────────────
// Estados:
//   'idle'   → nada que mostrar (default + 2s después del último guardado)
//   'saving' → mostrando "Guardando…" (durante el debounce)
//   'saved'  → mostrando "Guardado ✓" (1.5s después de persistir)
//   'error'  → falló localStorage (cuota llena, modo privado de Safari)
//
// Le permite al lead VER que su progreso queda guardado — crítico para
// dar tranquilidad en flows largos.
const saveStatus = ref('idle')
const lastSavedAt = ref(null)
let saveStatusTimer = null

// Persist on every mutation with debounce + status update.
// safeSetItem retorna el tier que persistió ('local'|'session'|'memory'):
// si cae a memory, el progreso se pierde al cerrar la pestaña — surfaceamos
// como 'error' visible para que el ConnectivityBanner avise.
watch(
  state,
  (val) => {
    if (typeof window === 'undefined') return
    saveStatus.value = 'saving'
    if (saveStatusTimer) clearTimeout(saveStatusTimer)
    saveStatusTimer = setTimeout(() => {
      const tier = safeSetItem(STORAGE_KEY, JSON.stringify(val))
      if (tier === 'memory') {
        // memoria volátil — alertamos al lead que su data no persistirá.
        saveStatus.value = 'error'
        return
      }
      saveStatus.value = 'saved'
      lastSavedAt.value = Date.now()
      setTimeout(() => {
        if (saveStatus.value === 'saved') saveStatus.value = 'idle'
      }, 1500)
    }, 300)
  },
  { deep: true }
)

// ── Plan recommendation engine — matches the Pricing 2026 table ─────────
// keyFeatures: 2 features clave que diferencian un plan del anterior. No
// es la lista completa (esa vive en /pricing) — solo el "upgrade" visible
// para que el lead entienda al toque qué le da pagar más.
const PLAN_TIERS = [
  {
    key: 'starter', name: 'Starter', minLocations: 1, maxLocations: 5,
    monthlyFee: 29, commissionPct: 1.5,
    keyFeatures: ['Self-service · 1 admin', 'Soporte por email'],
  },
  {
    key: 'growth', name: 'Growth', minLocations: 6, maxLocations: 25,
    monthlyFee: 119, commissionPct: 1.25,
    keyFeatures: ['CSM compartido · 3 admins', 'Branding propio + dominio'],
  },
  {
    key: 'scale', name: 'Scale', minLocations: 26, maxLocations: 70,
    monthlyFee: 269, commissionPct: 1.0,
    keyFeatures: ['CSM dedicado 4h/mes · 10 admins', 'API pública + webhooks'],
  },
  {
    key: 'pro', name: 'Pro', minLocations: 71, maxLocations: 200,
    monthlyFee: 449, commissionPct: 0.75,
    keyFeatures: ['CSM 24/7 · admins ilimitados', 'Multi-región + SSO'],
  },
  {
    key: 'enterprise', name: 'Enterprise', minLocations: 201, maxLocations: Infinity,
    monthlyFee: null, commissionPct: 0.5,
    keyFeatures: ['SLA 99,9% + soporte L3', 'Integraciones custom + on-prem'],
  },
]

const recommendedPlan = computed(() => {
  const n = Math.max(1, Number(state.business.locations) || 1)
  return PLAN_TIERS.find((t) => n >= t.minLocations && n <= t.maxLocations) || PLAN_TIERS[0]
})

// Descuento por billing anual. Estándar SaaS: 20% off para incentivar
// cobro upfront (mejora cash flow y reduce churn).
const ANNUAL_DISCOUNT = 0.20

const monthlyEstimateUsd = computed(() => {
  const tier = recommendedPlan.value
  // Si el usuario manualmente eligió otro plan, usamos ese
  const chosenTier = state.plan.key ? PLAN_TIERS.find((t) => t.key === state.plan.key) || tier : tier
  const base = chosenTier.monthlyFee || 0
  // Loyalty add-on: USD 15 / local. Modelo conservador.
  const loyalty = state.plan.addLoyalty ? 15 * (Number(state.business.locations) || 1) : 0
  const subtotal = base + loyalty
  // Si anual, descuento 20% sobre el subtotal mensual equivalente.
  return state.plan.billingCycle === 'annual'
    ? Math.round(subtotal * (1 - ANNUAL_DISCOUNT))
    : subtotal
})

// Ahorro anual al pagar anual (en USD) — para mostrar en el toggle.
const annualSavingsUsd = computed(() => {
  const tier = state.plan.key
    ? PLAN_TIERS.find((t) => t.key === state.plan.key) || recommendedPlan.value
    : recommendedPlan.value
  const base = tier.monthlyFee || 0
  const loyalty = state.plan.addLoyalty ? 15 * (Number(state.business.locations) || 1) : 0
  return Math.round((base + loyalty) * 12 * ANNUAL_DISCOUNT)
})

/**
 * Estimación de ahorro vs apps de terceros (PedidosYa, Rappi).
 * Asunción: ticket promedio USD 15, comisión típica de apps de terceros 25%,
 * y un volumen mensual estimado por local según el rango del plan.
 * Esto es una aproximación de marketing — el cálculo real lo hace el equipo
 * comercial. Pero da una idea conservadora.
 */
// Defaults de "ticket promedio" y "pedidos por local-mes" usados cuando el
// lead no editó la calculadora todavía. Conservadores a propósito: queremos
// que el lead vea un número creíble, no un overpromise.
const defaultAvgTicketUsd = 12 // bajado de 15 para ser más conservador
const computeDefaultOrders = (locations) =>
  locations <= 5 ? 280 : locations <= 25 ? 650 : locations <= 70 ? 1200 : 2400

const effectiveTicket = computed(() => {
  const t = Number(state.business.avgTicketUsd)
  return t > 0 ? t : defaultAvgTicketUsd
})

const effectiveOrders = computed(() => {
  const o = Number(state.business.ordersPerLocation)
  return o > 0 ? o : computeDefaultOrders(Math.max(1, Number(state.business.locations) || 1))
})

const monthlyGmvLead = computed(() => {
  const locations = Math.max(1, Number(state.business.locations) || 1)
  return locations * effectiveOrders.value * effectiveTicket.value
})

const thirdPartyMonthlyFee = computed(() => Math.round(monthlyGmvLead.value * 0.25))

const deenexMonthlyCost = computed(() => {
  const tier = recommendedPlan.value
  const fee = tier.monthlyFee || 0
  const commission = monthlyGmvLead.value * (tier.commissionPct / 100)
  return Math.round(fee + commission)
})

const savingsVsThirdParty = computed(() => {
  return Math.max(0, Math.round(thirdPartyMonthlyFee.value - deenexMonthlyCost.value))
})

const hasCustomRoiInputs = computed(() => {
  return Boolean(state.business.avgTicketUsd || state.business.ordersPerLocation)
})

// Break-even simple: ¿en cuántos días recuperás el fee mensual gracias al
// ahorro vs apps de terceros? Si el ahorro mensual > fee fijo, el break-even
// se calcula sobre el costo de Deenex completo en proporción al ahorro.
const breakEvenDays = computed(() => {
  const saving = savingsVsThirdParty.value
  const monthlyCost = monthlyEstimateUsd.value
  if (saving <= 0 || monthlyCost <= 0) return null
  // Días equivalentes al costo mensual sobre el ahorro mensual, prorrateado a 30 días.
  const days = Math.round((monthlyCost / saving) * 30)
  return Math.max(1, Math.min(days, 30)) // capped a 1 mes para visual
})

// ── Fecha del primer cargo (today + trial length) ────────────────────────
// Trial base de 15 días. Si el lead aceptó el bonus del exit intent
// (DEENEX30), se extiende a 30 días.
const TRIAL_DAYS_BASE = 15
const TRIAL_DAYS_WITH_BONUS = 30

// Lee el código de bonus persistido por OnboardingLayout (exit intent flow).
// El watch sobre state ya re-evalua cuando cambia, pero acá leemos lazy desde
// localStorage porque el bonus se setea por fuera del state (sessionStorage
// + localStorage para que sobreviva refresh).
function readBonusCode() {
  if (typeof window === 'undefined') return ''
  try {
    return localStorage.getItem('deenex_bonus_code') || ''
  } catch {
    return ''
  }
}

// Reactive ref que apunta al código. Lo refrescamos manualmente cuando
// OnboardingLayout lo setea via `markBonusApplied`.
const bonusCode = ref(readBonusCode())

function markBonusApplied(code) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('deenex_bonus_code', code)
    bonusCode.value = code
    trackEvent('onboarding_bonus_applied', { code })
  } catch {
    /* ignore quota errors */
  }
}

const hasBonus = computed(() => bonusCode.value === 'DEENEX30')

const TRIAL_DAYS = computed(() => (hasBonus.value ? TRIAL_DAYS_WITH_BONUS : TRIAL_DAYS_BASE))

const firstChargeDate = computed(() => {
  // Si el trial ya está activado, usamos esa fecha como ancla. Si no, calculamos
  // desde hoy para mostrar al lead una proyección.
  const anchor = state.trial.activatedAt ? new Date(state.trial.activatedAt) : new Date()
  const charge = new Date(anchor)
  charge.setDate(charge.getDate() + TRIAL_DAYS.value)
  return charge
})

const firstChargeDateFormatted = computed(() => {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(firstChargeDate.value)
})

const firstChargeDateShort = computed(() => {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long' }).format(
    firstChargeDate.value
  )
})

// ── Personalización ──────────────────────────────────────────────────────
const greeting = computed(() => {
  const name = (state.identity.firstName || '').trim()
  return name ? `${name}` : ''
})

// ── Smart inference helpers ──────────────────────────────────────────────
const GENERIC_EMAIL_DOMAINS = new Set([
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com',
  'live.com', 'me.com', 'protonmail.com', 'aol.com', 'msn.com',
])

/**
 * A partir del email corporativo, infiere un nombre de marca probable.
 * `marcos@palta.com.ar` → 'Palta'
 * `juan@grupocofradia.com` → 'Grupocofradia' (que el usuario podrá corregir)
 * `juan@gmail.com` → '' (no inferimos de dominios genéricos)
 */
function inferBrandFromEmail(email) {
  if (!email || typeof email !== 'string') return ''
  const m = email.trim().toLowerCase().match(/@([^@]+)$/)
  if (!m) return ''
  const domain = m[1]
  if (GENERIC_EMAIL_DOMAINS.has(domain)) return ''
  // Tomar la parte principal del dominio (antes del primer punto).
  const first = domain.split('.')[0] || ''
  if (!first || first.length < 2) return ''
  return first.charAt(0).toUpperCase() + first.slice(1)
}

/**
 * Convierte el nombre de marca a un subdomain seguro.
 * 'La Trattoria' → 'la-trattoria'
 * 'Palta!' → 'palta'
 */
function slugifyBrand(brand) {
  if (!brand) return ''
  return brand
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 30)
}

const subdomainPreview = computed(() => {
  // Si el lead aceptó una sugerencia (slug derivado estaba tomado), usamos
  // ese override en TODO el flow. Si no, slugify del brand.
  const override = (state.business.subdomainOverride || '').trim()
  if (override) return override
  const slug = slugifyBrand(state.business.brand)
  return slug || 'tu-marca'
})

// ── Step gating ──────────────────────────────────────────────────────────
const STEP_ORDER = ['identity', 'business', 'plan', 'preview', 'trial', 'welcome']

function isStepUnlocked(stepKey) {
  if (stepKey === 'identity') return true
  const idx = STEP_ORDER.indexOf(stepKey)
  if (idx <= 0) return true
  // Cada step requiere el anterior completado
  return state.meta.completedSteps.includes(STEP_ORDER[idx - 1])
}

const currentStep = computed(() => {
  for (const step of STEP_ORDER) {
    if (!state.meta.completedSteps.includes(step)) return step
  }
  return 'welcome'
})

// ── Actions ──────────────────────────────────────────────────────────────
function ensureStarted(variant) {
  // Captura UTMs en el primer touch — los siguientes events los heredan.
  const utms = captureUtmsFromUrl()
  // Rehidrata user_id de localStorage si volvió cross-device.
  getStoredUserId()
  if (!state.meta.startedAt) {
    state.meta.startedAt = new Date().toISOString()
    state.meta.variant = variant || ''
    // Persistimos UTMs en meta para reconstruir attribution después.
    state.meta.utms = utms
    trackEvent('onboarding_start', { variant: state.meta.variant, ...utms })
  }
}

function setIdentity(values) {
  Object.assign(state.identity, values)
  // Identify a GA4 con user_id estable derivado del email.
  if (values.email) identify(values.email)
  markStepComplete('identity')
}

function setBusiness(values) {
  Object.assign(state.business, values)
  // Propiedades del usuario para segmentación en GA4: tipo de cuenta,
  // tamaño, canales actuales. Habilita reports por cohort.
  setUserProperties({
    business_locations: values.locations || 0,
    business_pos: values.pos || 'none',
    business_channels: (values.channels || []).join(',') || 'none',
    business_brand_slug: slugifyBrand(values.brand || ''),
  })
  markStepComplete('business')
}

function setPlan(values) {
  Object.assign(state.plan, values)
  setUserProperties({
    plan_key: values.key || '',
    plan_billing_cycle: values.billingCycle || 'monthly',
    plan_loyalty: values.addLoyalty ? 'yes' : 'no',
  })
  markStepComplete('plan')
}

function markTrialActivated(method, mpPreferenceId) {
  state.trial.activatedAt = new Date().toISOString()
  state.trial.paymentMethod = method || 'mercadopago'
  state.trial.mpPreferenceId = mpPreferenceId || ''
  markStepComplete('trial')
  trackEvent('onboarding_trial_activated', {
    plan: state.plan.key,
    locations: state.business.locations,
    method: state.trial.paymentMethod,
  })
}

function markStepComplete(stepKey) {
  if (!state.meta.completedSteps.includes(stepKey)) {
    state.meta.completedSteps.push(stepKey)
    trackEvent(`onboarding_step_${stepKey}_completed`, {
      step_index: STEP_ORDER.indexOf(stepKey) + 1,
    })
  }
}

function reset() {
  Object.assign(state, structuredClone(DEFAULT_STATE))
  if (typeof window !== 'undefined') {
    safeRemoveItem(STORAGE_KEY)
  }
}

function track(event, payload = {}) {
  trackEvent(`onboarding_${event}`, payload)
}

export function useOnboarding() {
  return {
    state,
    PLAN_TIERS,
    STEP_ORDER,
    TRIAL_DAYS,
    bonusCode,
    hasBonus,
    markBonusApplied,
    recommendedPlan,
    monthlyEstimateUsd,
    annualSavingsUsd,
    ANNUAL_DISCOUNT,
    savingsVsThirdParty,
    breakEvenDays,
    defaultAvgTicketUsd,
    computeDefaultOrders,
    effectiveTicket,
    effectiveOrders,
    monthlyGmvLead,
    thirdPartyMonthlyFee,
    deenexMonthlyCost,
    hasCustomRoiInputs,
    firstChargeDate,
    firstChargeDateFormatted,
    firstChargeDateShort,
    greeting,
    inferBrandFromEmail,
    slugifyBrand,
    subdomainPreview,
    currentStep,
    isStepUnlocked,
    ensureStarted,
    setIdentity,
    setBusiness,
    setPlan,
    markTrialActivated,
    reset,
    track,
    // Auto-save UI signals
    saveStatus,
    lastSavedAt,
  }
}
