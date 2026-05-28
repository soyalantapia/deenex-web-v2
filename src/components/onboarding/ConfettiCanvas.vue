<template>
  <canvas
    ref="canvasEl"
    class="pointer-events-none fixed inset-0 z-[100]"
    aria-hidden="true"
  ></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const canvasEl = ref(null)
let rafId = null
let cleanupResize = null

const COLORS = ['#4f26db', '#695ede', '#34d399', '#fbbf24', '#fb7185', '#60a5fa']

const props = defineProps({
  duration: { type: Number, default: 3500 },
  particleCount: { type: Number, default: 120 },
})

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return

  // Respetar prefers-reduced-motion (WCAG 2.3.3): los usuarios con OS-level
  // "reduce motion" no quieren animaciones decorativas como confetti. Skip
  // toda la lógica y dejamos el canvas vacío. La conversión sigue intacta
  // — el confetti es pura ornamentación.
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  function resize() {
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    // setTransform RESETEA la matriz antes de aplicar scale. Antes usábamos
    // ctx.scale(dpr, dpr) directo, que es ACUMULATIVO: cada resize multiplicaba
    // la escala por dpr otra vez → después de 2-3 resizes el render quedaba
    // offscreen (escala = dpr², dpr³, etc).
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  const onResize = () => resize()
  window.addEventListener('resize', onResize)
  cleanupResize = () => window.removeEventListener('resize', onResize)

  // Lanzar partículas desde dos puntos (left-bottom y right-bottom) hacia arriba,
  // tipo cañón doble. Cada partícula tiene velocidad, gravedad y rotación.
  const particles = []
  const cw = window.innerWidth
  const ch = window.innerHeight

  function spawnBurst(originX) {
    for (let i = 0; i < props.particleCount / 2; i++) {
      const angle = (Math.random() * Math.PI) / 2 + Math.PI / 4 // upward cone
      const speed = 8 + Math.random() * 14
      const vx = Math.cos(angle) * speed * (originX < cw / 2 ? 1 : -1)
      const vy = -Math.sin(angle) * speed
      particles.push({
        x: originX,
        y: ch - 20,
        vx,
        vy,
        gravity: 0.28 + Math.random() * 0.12,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        life: 1,
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
      })
    }
  }

  // Doble disparo: ahora y a los 250ms para sensación de explosión.
  spawnBurst(cw * 0.15)
  spawnBurst(cw * 0.85)
  const second = setTimeout(() => {
    spawnBurst(cw * 0.5)
  }, 250)

  const startedAt = performance.now()
  function tick(now) {
    const elapsed = now - startedAt
    ctx.clearRect(0, 0, cw, ch)

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += p.gravity
      p.rot += p.rotSpeed
      // Fade out durante el último tercio
      const fadeStart = props.duration * 0.66
      p.life = elapsed < fadeStart ? 1 : Math.max(0, 1 - (elapsed - fadeStart) / (props.duration - fadeStart))

      ctx.save()
      ctx.globalAlpha = p.life
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    if (elapsed < props.duration) {
      rafId = requestAnimationFrame(tick)
    } else {
      ctx.clearRect(0, 0, cw, ch)
    }
  }
  rafId = requestAnimationFrame(tick)

  // Cleanup del segundo timeout
  onUnmounted(() => clearTimeout(second))
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (cleanupResize) cleanupResize()
})
</script>
