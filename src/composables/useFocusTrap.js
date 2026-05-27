/**
 * Focus trap WAI-ARIA Modal Dialog pattern.
 *
 * Lo que hace:
 *   1. Al abrir el modal: guarda el `document.activeElement` actual, mueve el
 *      foco al primer elemento focusable interno.
 *   2. Mientras el modal está abierto: intercepta Tab y Shift+Tab para
 *      ciclar el foco entre el primero y último focusable (sin escapar al
 *      resto del DOM).
 *   3. Al cerrar: restaura el foco al elemento que tenía el foco antes de
 *      abrir, así el usuario no pierde el punto de referencia.
 *
 * Uso típico:
 *
 *   const myModalRef = ref(null)
 *   const showMyModal = ref(false)
 *   useFocusTrap(showMyModal, myModalRef)
 *
 * Antes esto vivía como `watchModalFocus` adentro de `OnboardingLayout.vue`,
 * sin trapping de Tab. Extraído acá para reutilizar y agregar el trap real.
 */

import { watch, nextTick, onScopeDispose } from 'vue'

// Selector que matchea elementos focusables por teclado, alineado con la spec
// y la lista que usa Headless UI / Radix. Excluye disabled y tabindex="-1".
const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled])',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
  'area[href]',
  'iframe',
].join(',')

function getFocusable(container) {
  if (!container) return []
  // Filtramos por atributos explícitos (aria-hidden, hidden). Antes usábamos
  // `el.offsetParent !== null` como check de visibilidad, pero jsdom no tiene
  // layout engine y siempre devuelve null, lo que rompía los tests. En la app
  // real, los elementos invisibles vienen por v-if (no están en el DOM) o por
  // aria-hidden explícito, así que basta con esos checks.
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) =>
      el.getAttribute('aria-hidden') !== 'true' &&
      !el.hasAttribute('hidden'),
  )
}

/**
 * @param {import('vue').Ref<boolean>} openRef  bandera reactiva que indica si el modal está abierto
 * @param {import('vue').Ref<HTMLElement|null>} containerRef ref al contenedor del modal
 */
export function useFocusTrap(openRef, containerRef) {
  let preFocus = null
  let keydownHandler = null

  function trap(e) {
    if (e.key !== 'Tab') return
    const focusables = getFocusable(containerRef.value)
    if (focusables.length === 0) {
      // No hay nada focusable adentro: no dejamos que el Tab saque el foco,
      // lo absorbemos sin hacer nada (mejor que el lead se vaya al footer).
      e.preventDefault()
      return
    }
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement

    if (e.shiftKey) {
      // Shift+Tab desde el primero → vamos al último.
      if (active === first || !containerRef.value?.contains(active)) {
        e.preventDefault()
        last.focus()
      }
    } else {
      // Tab desde el último → vamos al primero.
      if (active === last || !containerRef.value?.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  // Cleanup defensivo: si el scope (componente/test) se dispone con el modal
  // aún abierto, removemos el listener para no dejar handlers flotantes en
  // `document`. Sin esto, en tests con effectScope los listeners persistían.
  onScopeDispose(() => {
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler, true)
      keydownHandler = null
    }
  })

  watch(openRef, async (open) => {
    if (open) {
      // Guardar quién tenía el foco antes para restaurarlo al cerrar.
      preFocus = document.activeElement
      await nextTick()
      const focusables = getFocusable(containerRef.value)
      // Preferimos focusear inputs/buttons primero (no el botón "Cancelar"),
      // pero como fallback simple agarramos el primer focusable. La lib
      // estándar (Headless) hace lo mismo.
      const target =
        containerRef.value?.querySelector(
          'input:not([disabled]):not([type="hidden"]), [autofocus]',
        ) || focusables[0]
      target?.focus?.()
      // Instalamos el listener global de keydown para cazar Tab cuando el
      // foco se escapó del contenedor (caso borde: clicks fuera).
      keydownHandler = trap
      document.addEventListener('keydown', keydownHandler, true)
    } else {
      if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler, true)
        keydownHandler = null
      }
      // Restaurar el foco al disparador (con un microtask para evitar
      // race con animaciones de leave). Si el disparador desapareció del
      // DOM, ignoramos en silencio (`.focus?.()`).
      preFocus?.focus?.()
      preFocus = null
    }
  })
}
