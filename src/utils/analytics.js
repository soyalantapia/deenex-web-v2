/**
 * Analytics utility, Google Analytics 4 + UTM capture + user identity.
 *
 * Mejoras sobre la versión anterior:
 *  - Captura UTMs en el primer landing y los persiste por sesión (sessionStorage).
 *    Cada evento incluye automáticamente `utm_source/medium/campaign/term/content`.
 *  - `identify(email)` setea user_id estable en GA4 (config call) + lo persiste
 *    para que cross-device QR resume mantenga la misma identidad.
 *  - `user_properties` con métricas del lead (plan, locations, country) que GA4
 *    usa para segmentación.
 *  - Fallback console.debug solo en dev (no inunda consola en prod).
 *
 * Falta para producción enterprise-grade (deuda explícita):
 *  - Destino secundario (PostHog/Mixpanel/Segment) si ad blocker bloquea GA.
 *  - sendBeacon en pagehide/abandoned events para no perderlos.
 */

// Mantener el ID en .env (VITE_GA_MEASUREMENT_ID); el fallback cubre dev y
// builds sin env config (GH Pages local). El ID es semi-público pero la práctica
// correcta es leerlo de env para poder rotar sin commits.
export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-E7GPE100LK'

const UTM_KEY = 'deenex_utm_v1'
const USER_ID_KEY = 'deenex_user_id_v1'

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']

let cachedUtms = null
let cachedUserId = null
const sessionProps = {}

function safeSession() {
  if (typeof window === 'undefined') return null
  try { return window.sessionStorage } catch { return null }
}
function safeLocal() {
  if (typeof window === 'undefined') return null
  try { return window.localStorage } catch { return null }
}

/**
 * Captura UTMs del URL actual. Llamar UNA vez al boot de la app.
 * Si la URL no trae UTMs pero ya hay capturados en sessionStorage, los
 * mantenemos (multi-step nav no debe perder el origen).
 */
export function captureUtmsFromUrl() {
  if (typeof window === 'undefined') return {}
  const ss = safeSession()
  // Si ya tenemos UTMs en sesión, los mantenemos.
  if (ss) {
    try {
      const raw = ss.getItem(UTM_KEY)
      if (raw) {
        cachedUtms = JSON.parse(raw)
        return cachedUtms
      }
    } catch { /* ignore */ }
  }
  const params = new URLSearchParams(window.location.search)
  const captured = {}
  UTM_PARAMS.forEach((k) => {
    const v = params.get(k)
    if (v) captured[k] = v
  })
  // Referer como fallback de attribution para tráfico sin UTM.
  if (Object.keys(captured).length === 0 && document.referrer) {
    try {
      const refHost = new URL(document.referrer).hostname
      if (refHost && refHost !== window.location.hostname) {
        captured.utm_source = refHost
        captured.utm_medium = 'referral'
      }
    } catch { /* invalid referer */ }
  }
  cachedUtms = captured
  if (ss && Object.keys(captured).length > 0) {
    try { ss.setItem(UTM_KEY, JSON.stringify(captured)) } catch { /* */ }
  }
  return captured
}

/**
 * Asocia el lead con su email (después de Step Identity). GA4 usa user_id
 * para deduplicar sesiones cross-device y reportar funnels reales.
 */
export function identify(email) {
  if (!email || typeof window === 'undefined') return
  // user_id estable derivado del email (hash simple, no usamos PII directa).
  const userId = simpleHash(email.toLowerCase().trim())
  cachedUserId = userId
  const ls = safeLocal()
  if (ls) {
    try { ls.setItem(USER_ID_KEY, userId) } catch { /* */ }
  }
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, { user_id: userId })
    window.gtag('set', 'user_properties', { ...sessionProps })
  }
}

/**
 * Setea propiedades del usuario para segmentación (plan, country, locations).
 * Persisten para todos los eventos siguientes.
 */
export function setUserProperties(props) {
  Object.assign(sessionProps, props)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', { ...sessionProps })
  }
}

/**
 * Rehidrata user_id persistido (en boot de la app, antes de identify).
 */
export function getStoredUserId() {
  if (cachedUserId) return cachedUserId
  const ls = safeLocal()
  if (!ls) return null
  try {
    cachedUserId = ls.getItem(USER_ID_KEY)
    return cachedUserId
  } catch { return null }
}

// Hash simple FNV-1a, suficiente para user_id estable, no es PII directa.
function simpleHash(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return 'u_' + h.toString(36)
}

/**
 * Send a custom event to GA4. Auto-incluye UTMs + user_id + flow_session.
 */
export const trackEvent = (eventName, params = {}) => {
  const utms = cachedUtms || captureUtmsFromUrl()
  const enriched = {
    ...utms,
    ...(cachedUserId ? { user_id: cachedUserId } : {}),
    ...params,
  }
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, enriched)
  } else if (import.meta.env?.DEV) {
    console.debug(`[GA4] ${eventName}`, enriched)
  }
}

/**
 * Track common CTA clicks (legacy helper, usado por componentes viejos).
 */
export const trackCTA = (label) => {
  if (label.toLowerCase().includes('comenzar')) {
    trackEvent('click_comenzar_ahora')
  } else if (label.toLowerCase().includes('agendar')) {
    trackEvent('click_agendar_demo')
  }
}
