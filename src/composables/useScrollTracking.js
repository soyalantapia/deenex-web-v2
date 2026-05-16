import { onMounted, onUnmounted } from 'vue'
import { trackEvent } from '@/utils/analytics'

export function useScrollTracking() {
  let tracked50 = false
  let tracked100 = false

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPos = window.scrollY
    const scrollPercentage = (scrollPos / scrollHeight) * 100

    if (!tracked50 && scrollPercentage >= 50) {
      trackEvent('scroll', { value: 50 })
      tracked50 = true
    }

    if (!tracked100 && scrollPercentage >= 95) { // 95% to account for small margins
      trackEvent('scroll', { value: 100 })
      tracked100 = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}
