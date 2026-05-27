/**
 * Vitest setup global. Corre antes de cada test file.
 *
 * Responsabilidades:
 *   - Stub mínimo de window.gtag para que los componentes con tracking no
 *     exploten (analytics.trackEvent llama a window.gtag).
 *   - Stub de IntersectionObserver (jsdom no lo trae). Lo usan StatsSection,
 *     DemoVideoSection, HomeView para reveals.
 *   - matchMedia stub mínimo (algunos componentes lo consultan para responsive).
 */
import { vi } from 'vitest'

// ── window.gtag noop ────────────────────────────────────────────────────
// Si no lo seteamos, los componentes que llaman trackEvent() lanzan errors
// porque jsdom no tiene gtag y el code-path de fallback (console.debug en dev)
// requiere import.meta.env.DEV.
window.gtag = vi.fn()

// ── IntersectionObserver stub ───────────────────────────────────────────
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}
window.IntersectionObserver = IntersectionObserverStub
globalThis.IntersectionObserver = IntersectionObserverStub

// ── matchMedia stub ─────────────────────────────────────────────────────
// jsdom no soporta matchMedia. Devolvemos un MediaQueryList minimal que no
// matchea nada (mobile-first); los componentes que lo usan deciden bien.
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
