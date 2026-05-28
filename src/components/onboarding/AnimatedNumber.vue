<template>
  <span>{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 1200 },
  locale: { type: String, default: 'es-AR' },
  // Si querés un prefijo/sufijo dentro del span (ej. "USD ") usalo afuera
})

const displayValue = ref('0')
let rafId = null
let startedAt = 0
let fromValue = 0

function format(v) {
  return Math.round(v).toLocaleString(props.locale)
}

function animate(toValue) {
  cancelAnimationFrame(rafId)
  startedAt = performance.now()
  const startValue = fromValue
  const delta = toValue - startValue

  function tick(now) {
    const elapsed = now - startedAt
    const t = Math.min(1, elapsed / props.duration)
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3)
    const current = startValue + delta * eased
    displayValue.value = format(current)
    if (t < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      fromValue = toValue
    }
  }

  // Si el browser no soporta rAF (SSR-like), set value directly.
  if (typeof requestAnimationFrame !== 'function') {
    displayValue.value = format(toValue)
    fromValue = toValue
    return
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => animate(props.value))

watch(
  () => props.value,
  (next) => animate(next),
)

// Cancelamos el rAF activo cuando el componente se desmonta. Sin esto, si el
// lead navega mid-animation (ej. cambia de step) el callback sigue ejecutándose
// y muta displayValue.value de un componente ya destruido — Vue lo absorbe
// pero ensucia el call stack y a veces emite warnings en strict mode.
onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>
