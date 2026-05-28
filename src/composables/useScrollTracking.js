import { onMounted, onUnmounted } from 'vue'
import { trackEvent } from '@/utils/analytics'

/**
 * Trackea milestones de scroll (50% y 100%) para GA4. Se monta en cada landing
 * (HomeView, CadenasGastronomicasView) y dispara el evento UNA vez por sesión
 * por milestone.
 *
 * Mejoras vs versión anterior:
 *   - Throttle con requestAnimationFrame (antes corría en CADA scroll event,
 *     que en mobile puede ser 60Hz → 60 cálculos/s).
 *   - Guard contra division-by-zero: si `scrollHeight === innerHeight` (pages
 *     cortas que no scrollean), antes daba NaN o Infinity y eventualmente
 *     trackeaba 100% sin necesidad. Ahora retorna early.
 */
export function useScrollTracking() {
  let tracked50 = false
  let tracked100 = false
  let ticking = false

  const compute = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    // Guard: si la página no scrollea (mobile chico con poco contenido,
    // ó page con todo above-the-fold), nunca trackeamos. Antes daba NaN
    // o Infinity y se trackeaba 100% accidentalmente.
    if (scrollable <= 0) {
      ticking = false
      return
    }
    const scrollPos = window.scrollY
    const scrollPercentage = (scrollPos / scrollable) * 100

    if (!tracked50 && scrollPercentage >= 50) {
      trackEvent('scroll', { value: 50 })
      tracked50 = true
    }

    if (!tracked100 && scrollPercentage >= 95) { // 95% acepta margen del bottom
      trackEvent('scroll', { value: 100 })
      tracked100 = true
    }

    // Cuando ambos milestones están done, podemos desuscribirnos para no
    // gastar CPU en cada scroll futuro (este es el caso común en sesiones
    // largas: el lead llegó al 100% y sigue scrolleando).
    if (tracked50 && tracked100) {
      window.removeEventListener('scroll', handleScroll)
    }

    ticking = false
  }

  const handleScroll = () => {
    // Throttle via rAF: ignora calls hasta que el browser dibuje el próximo
    // frame. En la práctica reduce 60+ events/s a ~60 max-frame-rate.
    if (ticking) return
    ticking = true
    requestAnimationFrame(compute)
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
