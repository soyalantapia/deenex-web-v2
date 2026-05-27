/**
 * Tests para useFocusTrap (R3-03).
 *
 * Validamos el contrato WAI-ARIA Modal Dialog:
 *   - Al abrir: guarda foco previo + mueve foco al primer focusable del modal.
 *   - Al cerrar: restaura foco al elemento que tenía el foco antes de abrir.
 *   - Mientras está abierto: Tab desde el último focusable cicla al primero,
 *     Shift+Tab desde el primero cicla al último.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, effectScope } from 'vue'
import { useFocusTrap } from '@/composables/useFocusTrap'

// Helper: arma un modal con buttons + un trigger button afuera para
// verificar el focus restore.
function setupModalDOM() {
  document.body.innerHTML = `
    <button id="trigger" type="button">Abrir modal</button>
    <div id="modal" style="display:none">
      <button id="first" type="button">First</button>
      <input id="middle" type="text" />
      <button id="last" type="button">Last</button>
    </div>
  `
  return {
    trigger: document.getElementById('trigger'),
    modal: document.getElementById('modal'),
    first: document.getElementById('first'),
    middle: document.getElementById('middle'),
    last: document.getElementById('last'),
  }
}

describe('useFocusTrap', () => {
  let dom
  let scope

  beforeEach(() => {
    dom = setupModalDOM()
    // Aislamos cada test en su propio effectScope para que los watchers no
    // sobrevivan entre tests (si no, los listeners de keydown de tests previos
    // contaminan a los siguientes).
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
    document.body.innerHTML = ''
  })

  // Helper: instala useFocusTrap dentro del scope para que se dispose con afterEach.
  function setupTrap(openRef, containerRef) {
    scope.run(() => useFocusTrap(openRef, containerRef))
  }

  it('al abrir: mueve foco al primer focusable del modal (preferencia: input)', async () => {
    const open = ref(false)
    const containerRef = ref(dom.modal)
    setupTrap(open, containerRef)

    // Trigger tiene el foco antes de abrir
    dom.trigger.focus()
    expect(document.activeElement).toBe(dom.trigger)

    dom.modal.style.display = 'block'
    open.value = true
    await nextTick()
    // Esperamos a que el watcher async corra (nextTick + focus)
    await nextTick()

    // Preferencia del composable: input ANTES que button. El selector
    // preferente es 'input:not([disabled]):not([type="hidden"]), [autofocus]'.
    expect(document.activeElement).toBe(dom.middle)
  })

  it('al cerrar: restaura foco al disparador previo', async () => {
    const open = ref(false)
    const containerRef = ref(dom.modal)
    setupTrap(open, containerRef)

    dom.trigger.focus()
    dom.modal.style.display = 'block'
    open.value = true
    await nextTick()
    await nextTick()

    expect(document.activeElement).toBe(dom.middle) // foco en modal

    open.value = false
    await nextTick()

    expect(document.activeElement).toBe(dom.trigger) // restaurado
  })

  it('Shift+Tab desde el primer focusable cicla al último', async () => {
    const open = ref(false)
    const containerRef = ref(dom.modal)
    setupTrap(open, containerRef)

    dom.modal.style.display = 'block'
    open.value = true
    await nextTick()
    await nextTick()

    // Posicionamos foco en el primer focusable (button "First")
    dom.first.focus()
    expect(document.activeElement).toBe(dom.first)

    // Disparamos Shift+Tab; el trap debe prevenir el comportamiento default
    // y mover foco al último.
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(dom.last)
  })

  it('Tab desde el último focusable cicla al primero', async () => {
    const open = ref(false)
    const containerRef = ref(dom.modal)
    setupTrap(open, containerRef)

    dom.modal.style.display = 'block'
    open.value = true
    await nextTick()
    await nextTick()

    dom.last.focus()
    expect(document.activeElement).toBe(dom.last)

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: false,
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(dom.first)
  })

  it('Tab fuera del modal igual cicla al primero (caso borde: foco escapado)', async () => {
    const open = ref(false)
    const containerRef = ref(dom.modal)
    setupTrap(open, containerRef)

    dom.modal.style.display = 'block'
    open.value = true
    await nextTick()
    await nextTick()

    // Simulamos que el foco se escapó al trigger (fuera del modal).
    dom.trigger.focus()
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)

    // El trap debería traerlo de vuelta al primer focusable del modal.
    expect(document.activeElement).toBe(dom.first)
  })

  it('al cerrar desinstala el listener de keydown (no dispara más trap)', async () => {
    const open = ref(false)
    const containerRef = ref(dom.modal)
    setupTrap(open, containerRef)

    dom.modal.style.display = 'block'
    open.value = true
    await nextTick()
    await nextTick()

    open.value = false
    await nextTick()

    // Después de cerrar, foco vuelve al trigger. Si tabbeamos, NO debería
    // ciclar al primer focusable del modal (porque el listener ya no está).
    dom.trigger.focus()
    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    })
    document.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
  })
})
