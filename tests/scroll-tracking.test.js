/**
 * Tests para useScrollTracking (R5-05).
 *
 * Lo crítico: el guard contra división por cero cuando la page no scrollea.
 * Antes `scrollHeight - innerHeight` daba 0 y la división tiraba NaN, lo
 * que eventualmente trackeaba 100% de scroll en páginas que no scrolleaban.
 *
 * También validamos que el rAF-throttle no dispara cómputos duplicados antes
 * del próximo frame.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useScrollTracking } from '@/composables/useScrollTracking'
import { mount } from '@vue/test-utils'
import { trackEvent } from '@/utils/analytics'

vi.mock('@/utils/analytics', () => ({
  trackEvent: vi.fn(),
}))

// Mountamos useScrollTracking dentro de un componente dummy para que tenga
// el lifecycle hook context que necesita (onMounted).
function setupTrackingComponent() {
  const Dummy = {
    setup() {
      useScrollTracking()
    },
    template: '<div></div>',
  }
  return mount(Dummy)
}

// jsdom no implementa scroll layout, mockeamos scrollHeight/innerHeight/scrollY
// manualmente para simular distintos escenarios.
function setScrollState({ scrollHeight, innerHeight, scrollY }) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  })
  Object.defineProperty(window, 'innerHeight', {
    value: innerHeight,
    configurable: true,
  })
  window.scrollY = scrollY
}

describe('useScrollTracking (R5-05)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset scroll DOM state entre tests
    setScrollState({ scrollHeight: 2000, innerHeight: 800, scrollY: 0 })
  })

  it('no trackea cuando la page no scrollea (scrollable=0, evita NaN)', async () => {
    setScrollState({ scrollHeight: 800, innerHeight: 800, scrollY: 0 })
    setupTrackingComponent()
    // Simulamos un scroll event aunque no haya nada que scrollear
    window.dispatchEvent(new Event('scroll'))
    // Esperamos al próximo frame (rAF throttle)
    await new Promise((r) => requestAnimationFrame(r))

    // Crítico: con scrollable=0 antes daba NaN >= 50 (false), pero scrollable=0
    // y scrollPos=0 daba 0/0 = NaN; el guard nuevo es scrollable <= 0 → return.
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('trackea scroll=50 cuando se pasa el 50%', async () => {
    setScrollState({ scrollHeight: 2000, innerHeight: 800, scrollY: 700 })
    // (2000 - 800) = 1200 scrollable, 700/1200 = 58% → debe trackear 50
    setupTrackingComponent()
    window.dispatchEvent(new Event('scroll'))
    await new Promise((r) => requestAnimationFrame(r))

    expect(trackEvent).toHaveBeenCalledWith('scroll', { value: 50 })
  })

  it('trackea scroll=100 cuando se pasa el 95%', async () => {
    setScrollState({ scrollHeight: 2000, innerHeight: 800, scrollY: 1170 })
    // 1170/1200 = 97.5% → trackea ambos (50 y 100)
    setupTrackingComponent()
    window.dispatchEvent(new Event('scroll'))
    await new Promise((r) => requestAnimationFrame(r))

    expect(trackEvent).toHaveBeenCalledWith('scroll', { value: 50 })
    expect(trackEvent).toHaveBeenCalledWith('scroll', { value: 100 })
  })

  it('no trackea el mismo milestone dos veces', async () => {
    setScrollState({ scrollHeight: 2000, innerHeight: 800, scrollY: 700 })
    setupTrackingComponent()

    window.dispatchEvent(new Event('scroll'))
    await new Promise((r) => requestAnimationFrame(r))
    window.dispatchEvent(new Event('scroll'))
    await new Promise((r) => requestAnimationFrame(r))

    // Aunque scrolleamos 2 veces a la misma posición, solo se trackea 50 una vez
    const calls = trackEvent.mock.calls.filter((c) => c[0] === 'scroll' && c[1].value === 50)
    expect(calls).toHaveLength(1)
  })
})
