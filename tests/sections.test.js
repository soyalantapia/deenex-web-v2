/**
 * Tests de las secciones de landing con prop `:content` (variante A/B).
 *
 * Por qué importan: en Round 2 conectamos `defineProps({ content })` a 10
 * secciones. Sin tests, un refactor futuro puede romper silenciosamente la
 * variante /cadenas-gastronomicas (los sections renderizarían los defaults
 * en vez del copy de la variante).
 *
 * Cubrimos:
 *   - Sin content prop → renderiza copy default de la home.
 *   - Con content prop → renderiza el copy de la variante.
 *   - El fallback de cada campo es independiente: si el variante define solo
 *     `headlineLine1`, los demás campos caen al default sin romper.
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Stub global para @/composables/useExperiment (HeroSection lo usa, no
// queremos randomness en tests). El stub matchea la shape esperada.
import { vi } from 'vitest'
vi.mock('@/composables/useExperiment', () => ({
  useExperiment: () => ({
    variant: {
      value: {
        id: 'control',
        payload: { label: 'Empezar 14 días gratis', target: '/comenzar' },
      },
    },
  }),
}))

// Mock de analytics.trackEvent para que onMounted no falle.
vi.mock('@/utils/analytics', () => ({
  trackEvent: vi.fn(),
  trackCTA: vi.fn(),
  identify: vi.fn(),
  setUserProperties: vi.fn(),
  captureUtmsFromUrl: vi.fn(() => ({})),
  getStoredUserId: vi.fn(() => null),
  GA_MEASUREMENT_ID: 'G-TEST',
}))

// vue-router stub para que RouterLink no rompa.
const routerLinkStub = {
  template: '<a><slot /></a>',
  props: ['to'],
}
const globalStubs = { RouterLink: routerLinkStub, Teleport: false }

// ── FAQSection ───────────────────────────────────────────────────────────
import FAQSection from '@/components/sections/FAQSection.vue'

describe('FAQSection', () => {
  it('sin :content renderiza copy default ("Preguntas Frecuentes", "Todo lo que necesitás")', () => {
    const wrapper = mount(FAQSection, { global: { stubs: globalStubs } })
    expect(wrapper.text()).toContain('Preguntas Frecuentes')
    expect(wrapper.text()).toContain('Todo lo que necesitás')
    expect(wrapper.text()).toContain('saber antes de arrancar.')
    // El FAQ default tiene 6 preguntas
    expect(wrapper.findAll('[class*="cursor-pointer"]').length).toBeGreaterThanOrEqual(6)
  })

  it('con :content custom renderiza esos strings en vez de los defaults', () => {
    const content = {
      eyebrow: 'FAQ Cadenas',
      headlineLine1: 'Preguntas de cadenas',
      headlineLine2: 'que se repiten siempre.',
      sidequote: '"Comprometidos."',
      ctaText: '¿Más preguntas?',
      ctaLabel: 'Hablemos',
      whatsappTemplate: 'Hola desde cadenas',
      items: [
        { q: 'Pregunta variante 1?', a: 'Respuesta variante 1.' },
      ],
    }
    const wrapper = mount(FAQSection, {
      props: { content },
      global: { stubs: globalStubs },
    })
    expect(wrapper.text()).toContain('FAQ Cadenas')
    expect(wrapper.text()).toContain('Preguntas de cadenas')
    expect(wrapper.text()).toContain('Pregunta variante 1?')
    expect(wrapper.text()).toContain('Hablemos')
    expect(wrapper.text()).not.toContain('Todo lo que necesitás') // default fuera
  })

  it('fallback parcial: si solo paso headlineLine1, los otros campos caen al default', () => {
    const wrapper = mount(FAQSection, {
      props: { content: { headlineLine1: 'Custom solo este' } },
      global: { stubs: globalStubs },
    })
    expect(wrapper.text()).toContain('Custom solo este')
    expect(wrapper.text()).toContain('saber antes de arrancar.') // default
    expect(wrapper.text()).toContain('Preguntas Frecuentes') // default eyebrow
  })
})

// ── CalendarSection ─────────────────────────────────────────────────────
import CalendarSection from '@/components/sections/CalendarSection.vue'

describe('CalendarSection', () => {
  it('sin :content renderiza "Elegí el día y hora"', () => {
    const wrapper = mount(CalendarSection, { global: { stubs: globalStubs } })
    expect(wrapper.text()).toContain('Elegí el día y hora')
    expect(wrapper.text()).toContain('que mejor te quede.')
  })

  it('con :content renderiza el headline custom', () => {
    const wrapper = mount(CalendarSection, {
      props: {
        content: {
          headlineLine1: 'Elegí cuándo charlamos',
          headlineLine2: 'sin compromiso.',
          subtitle: 'Reunión flexible.',
        },
      },
      global: { stubs: globalStubs },
    })
    expect(wrapper.text()).toContain('Elegí cuándo charlamos')
    expect(wrapper.text()).toContain('Reunión flexible.')
    expect(wrapper.text()).not.toContain('Elegí el día y hora')
  })
})

// ── StatsSection ─────────────────────────────────────────────────────────
import StatsSection from '@/components/sections/StatsSection.vue'

describe('StatsSection', () => {
  it('sin :content renderiza los 4 labels default', () => {
    const wrapper = mount(StatsSection, { global: { stubs: globalStubs } })
    expect(wrapper.text()).toContain('Sucursales activas')
    expect(wrapper.text()).toContain('Ticket promedio')
    expect(wrapper.text()).toContain('Más fidelización')
    expect(wrapper.text()).toContain('Clientes recuperados')
  })

  it('renderiza el disclaimer asterisco (R2-05)', () => {
    const wrapper = mount(StatsSection, { global: { stubs: globalStubs } })
    expect(wrapper.text()).toContain('Promedios observados en clientes Deenex')
  })

  it('con :content array custom renderiza las stats nuevas', () => {
    const content = [
      { prefix: '+', value: 100, suffix: '', label: 'Stat A', sub: 'sub a' },
      { prefix: '+', value: 200, suffix: '%', label: 'Stat B', sub: 'sub b' },
      { prefix: '+', value: 300, suffix: 'X', label: 'Stat C', sub: 'sub c' },
    ]
    const wrapper = mount(StatsSection, {
      props: { content },
      global: { stubs: globalStubs },
    })
    expect(wrapper.text()).toContain('Stat A')
    expect(wrapper.text()).toContain('Stat C') // 3rd stat (R3-01: dinámico, no hardcoded a 4)
    expect(wrapper.text()).not.toContain('Sucursales activas')
  })
})

// ── LoyaltySection ──────────────────────────────────────────────────────
import LoyaltySection from '@/components/sections/LoyaltySection.vue'

describe('LoyaltySection', () => {
  it('sin :content muestra el headline default', () => {
    const wrapper = mount(LoyaltySection, { global: { stubs: globalStubs } })
    expect(wrapper.text()).toContain('Tu propia máquina de')
    expect(wrapper.text()).toContain('recurrencia y lealtad.')
  })

  it('content.leftFeatures custom overrides los defaults', () => {
    const wrapper = mount(LoyaltySection, {
      props: {
        content: {
          leftFeatures: [
            { label: 'X', title: 'Feature Custom', desc: 'desc custom' },
          ],
        },
      },
      global: { stubs: globalStubs },
    })
    expect(wrapper.text()).toContain('Feature Custom')
    expect(wrapper.text()).not.toContain('Puntos y Cupones')
  })
})
