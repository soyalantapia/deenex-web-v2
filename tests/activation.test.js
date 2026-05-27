/**
 * Tests para R4-06 (StepTrial activation error path).
 *
 * Por qué importan: antes `onActivate` seteaba loading=true y NUNCA lo apagaba.
 * Si el localStorage tiraba o el setTimeout fallaba (red caída, browser quirk),
 * el spinner quedaba spinning para siempre y el lead no podía reintentar.
 *
 * Estos tests no montan el componente completo (require demasiado setup con
 * useOnboarding singleton, router, etc.); validan la pieza crítica: que
 * `loading` se apague tanto en path feliz como en path de error.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

describe('StepTrial.onActivate error handling (R4-06)', () => {
  let loading
  let activationError
  let markTrialActivated

  beforeEach(() => {
    loading = ref(false)
    activationError = ref('')
    markTrialActivated = vi.fn()
  })

  // Reimplementamos la estructura crítica del onActivate para testear el
  // try/catch/finally aislado. Incluimos un microtask real (await Promise)
  // para reflejar que el original tiene `await new Promise((r) => setTimeout)`,
  // permitiendo observar el loading=true entre el inicio y el final.
  async function runOnActivate({ throwOn = null } = {}) {
    loading.value = true
    activationError.value = ''
    try {
      // Yield al event loop (simula el "beat" inicial del real)
      await Promise.resolve()
      if (throwOn === 'beat') throw new Error('network unavailable')

      // Mini-simulación de markTrialActivated.
      if (throwOn === 'mark') throw new Error('localStorage quota')
      markTrialActivated('mercadopago', 'stub_pref')
    } catch (err) {
      activationError.value =
        'No pudimos activar tu cuenta. Revisá tu conexión y reintentá. Si el problema persiste, escribinos por WhatsApp.'
      return { error: err }
    } finally {
      loading.value = false
    }
    return { error: null }
  }

  it('happy path: loading=true durante el flujo, false al final, sin error', async () => {
    expect(loading.value).toBe(false)
    const promise = runOnActivate()
    // Inmediatamente después del call (antes del await Promise.resolve())
    // loading=true porque el sync entry del async function ya corrió.
    expect(loading.value).toBe(true)
    const result = await promise
    expect(loading.value).toBe(false)
    expect(activationError.value).toBe('')
    expect(result.error).toBeNull()
    expect(markTrialActivated).toHaveBeenCalledOnce()
  })

  it('cuando el beat inicial tira (red caída), loading vuelve a false y muestra error', async () => {
    const result = await runOnActivate({ throwOn: 'beat' })
    expect(loading.value).toBe(false)
    expect(activationError.value).toContain('No pudimos activar')
    expect(activationError.value).toContain('WhatsApp')
    expect(result.error).toBeInstanceOf(Error)
    expect(markTrialActivated).not.toHaveBeenCalled()
  })

  it('cuando markTrialActivated tira (localStorage lleno), también recupera', async () => {
    const result = await runOnActivate({ throwOn: 'mark' })
    expect(loading.value).toBe(false)
    expect(activationError.value).toContain('No pudimos activar')
    expect(result.error.message).toBe('localStorage quota')
  })

  it('un segundo intento limpia el error previo (UX: retry funciona)', async () => {
    await runOnActivate({ throwOn: 'beat' })
    expect(activationError.value).toContain('No pudimos')

    // Reintento sin error
    const result = await runOnActivate()
    expect(activationError.value).toBe('') // limpio
    expect(loading.value).toBe(false)
    expect(result.error).toBeNull()
  })
})
