/**
 * Tests para la lógica de savings en useOnboarding (F-02/F-06).
 *
 * Por qué importan: arreglamos el caso borde donde Deenex sale más caro que
 * apps de terceros (marca chica, volumen bajo). El composable clampa savings
 * a 0 con Math.max(0, ...); StepSavings.vue esconde la comparison cuando
 * savings === 0 y muestra fallback honesto. Sin test, un refactor podría
 * romper esa garantía sin avisar.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useOnboarding } from '@/composables/useOnboarding'

// useOnboarding es un singleton (module-level state). Para aislar entre
// tests, reseteamos el state manualmente con resetState() expuesto.
let onboarding

beforeEach(() => {
  onboarding = useOnboarding()
  // Limpiar lo que hayan tocado tests previos: vaciamos los campos clave.
  onboarding.state.business.locations = 1
  onboarding.state.business.avgTicketUsd = null
  onboarding.state.business.ordersPerLocation = null
  onboarding.state.business.channels = []
  onboarding.state.business.brand = ''
  onboarding.state.identity.email = ''
})

describe('savingsVsThirdParty', () => {
  it('savings nunca es negativo (clampea a 0 con Math.max)', () => {
    // Caso de mínimo absoluto: 1 local, 20 pedidos/mes, ticket 3 USD.
    // Apps cobra muy poco; Deenex tiene fee fijo USD 29 + POS USD 20 → más caro.
    onboarding.state.business.locations = 1
    onboarding.state.business.avgTicketUsd = 3
    onboarding.state.business.ordersPerLocation = 20

    const savings = onboarding.savingsVsThirdParty.value
    expect(savings).toBeGreaterThanOrEqual(0)
    // En este caso real Deenex sale más caro → debe ser exactamente 0.
    expect(savings).toBe(0)
  })

  it('breakEvenDays es null cuando savings es 0 (no dividimos por 0)', () => {
    onboarding.state.business.locations = 1
    onboarding.state.business.avgTicketUsd = 3
    onboarding.state.business.ordersPerLocation = 20

    expect(onboarding.savingsVsThirdParty.value).toBe(0)
    expect(onboarding.breakEvenDays.value).toBeNull()
  })

  it('savings es positivo cuando el volumen es razonable (5 locales × 300 ped)', () => {
    onboarding.state.business.locations = 5
    onboarding.state.business.avgTicketUsd = 15
    onboarding.state.business.ordersPerLocation = 300

    const savings = onboarding.savingsVsThirdParty.value
    expect(savings).toBeGreaterThan(0)
    // Con este volumen el break-even existe y está entre 1 y 30 días
    expect(onboarding.breakEvenDays.value).not.toBeNull()
    expect(onboarding.breakEvenDays.value).toBeGreaterThanOrEqual(1)
    expect(onboarding.breakEvenDays.value).toBeLessThanOrEqual(30)
  })

  it('locations=0 o null no rompe el cálculo (se clampea a 1)', () => {
    onboarding.state.business.locations = 0
    onboarding.state.business.avgTicketUsd = 15

    // No debería tirar NaN ni Infinity
    expect(Number.isFinite(onboarding.savingsVsThirdParty.value)).toBe(true)
    expect(Number.isFinite(onboarding.monthlyGmvLead.value)).toBe(true)
  })

  it('effectiveOrders cae al default cuando ordersPerLocation es 0/null', () => {
    onboarding.state.business.ordersPerLocation = null
    expect(onboarding.effectiveOrders.value).toBe(onboarding.computeDefaultOrders())

    onboarding.state.business.ordersPerLocation = 0
    expect(onboarding.effectiveOrders.value).toBe(onboarding.computeDefaultOrders())

    onboarding.state.business.ordersPerLocation = 500
    expect(onboarding.effectiveOrders.value).toBe(500)
  })

  it('effectiveTicket cae al default cuando avgTicketUsd es 0/null', () => {
    onboarding.state.business.avgTicketUsd = null
    expect(onboarding.effectiveTicket.value).toBe(onboarding.defaultAvgTicketUsd)

    onboarding.state.business.avgTicketUsd = 0
    expect(onboarding.effectiveTicket.value).toBe(onboarding.defaultAvgTicketUsd)

    onboarding.state.business.avgTicketUsd = 25
    expect(onboarding.effectiveTicket.value).toBe(25)
  })
})
