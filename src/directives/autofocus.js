/**
 * v-autofocus — pone foco en el primer input/textarea/select del bloque al montar.
 *
 * Uso:
 *   <form v-autofocus>
 *     <input ...>
 *   </form>
 *
 * O directo sobre el input que querés enfocar:
 *   <input v-autofocus>
 *
 * Si el target es un <input>, hace focus directo. Si es un wrapper (form, div),
 * busca el primer input/textarea/select interactuable adentro. Skipea inputs
 * read-only o disabled.
 */

export default {
  mounted(el) {
    // Pequeño delay para que la transición de step termine antes de hacer focus
    // (evita scroll jump si la página todavía no terminó de pintar).
    setTimeout(() => {
      const candidate =
        el.matches('input, textarea, select')
          ? el
          : el.querySelector('input:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly]), select:not([disabled])')
      if (candidate && typeof candidate.focus === 'function') {
        candidate.focus({ preventScroll: false })
      }
    }, 380) // matches step transition duration
  },
}
