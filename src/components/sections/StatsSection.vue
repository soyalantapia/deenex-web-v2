<template>
  <section class="stats-section py-8 overflow-hidden" ref="sectionRef">
    <div class="max-w-6xl mx-auto px-6">
      <div class="stats-grid">
        <div v-for="(stat, i) in stats" :key="i" class="stat-card" :class="{ 'stat-card--active': hasAnimated }">
          <span class="stat-value text-primary">
            <span v-if="stat.prefix" class="stat-prefix">{{ stat.prefix }}</span>
            <span class="stat-number">{{ displayValues[i] }}</span>
            <span v-if="stat.suffix" class="stat-suffix">{{ stat.suffix }}</span>
          </span>
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-sub">{{ stat.sub }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const hasAnimated = ref(false)
const displayValues = reactive([0, 0, 0, 0])

const stats = [
  { prefix: '+', value: 500, suffix: '', label: 'Sucursales activas', sub: 'En toda la red Deenex' },
  { prefix: '+', value: 25, suffix: '%', label: 'Ticket promedio', sub: 'Mayor rentabilidad por pedido' },
  { prefix: '', value: 2, suffix: 'X', label: 'Más fidelización', sub: 'Vs. apps de terceros' },
  { prefix: '+', value: 40, suffix: '%', label: 'Clientes recuperados', sub: 'De Rappi y PedidosYa' },
]

function animateCounter(index, target, duration = 1800) {
  const startTime = performance.now()
  const start = 0

  function step(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Easing: easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    displayValues[index] = Math.round(start + (target - start) * eased)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      displayValues[index] = target
    }
  }

  requestAnimationFrame(step)
}

function startAnimation() {
  if (hasAnimated.value) return
  hasAnimated.value = true
  stats.forEach((stat, i) => {
    const delay = i * 120
    setTimeout(() => animateCounter(i, stat.value), delay)
  })
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        startAnimation()
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.stats-section {
  background: transparent;
}

/* ── Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
  background: white;
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ── Tarjeta ── */
.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1.5rem;
  background: white;
  transition: background 0.3s ease;
  overflow: hidden;
}

/* Separador vertical: línea gradiente que se desvanece arriba y abajo */
.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: linear-gradient(to bottom,
      transparent 0%,
      #dde3ec 25%,
      #dde3ec 75%,
      transparent 100%);
}

.stat-card:last-child::after {
  display: none;
}

/* Mobile: separadores */
@media (max-width: 1023px) {

  /* Separador horizontal entre filas */
  .stat-card::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right,
        transparent 0%,
        #dde3ec 20%,
        #dde3ec 80%,
        transparent 100%);
  }

  /* Solo los dos primeros (primera fila) necesitan borde inferior */
  .stat-card:nth-child(3)::before,
  .stat-card:nth-child(4)::before {
    display: none;
  }

  /* Los de columna derecha no necesitan borde vertical right */
  .stat-card:nth-child(2)::after,
  .stat-card:nth-child(4)::after {
    display: none;
  }
}

.stat-card:hover {
  background: #f8fafc;
}

/* ── Número ── */
.stat-value {
  display: flex;
  align-items: baseline;
  gap: 1px;
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 0.35rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.stat-card--active .stat-value {
  opacity: 1;
  transform: translateY(0);
}

.stat-prefix,
.stat-suffix {
  font-size: 0.65em;
  font-weight: 800;
  opacity: 0.75;
}

.stat-number {
  font-variant-numeric: tabular-nums;
}

/* ── Labels ── */
.stat-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #1e293b;
  line-height: 1.3;
  display: block;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s;
}

.stat-card--active .stat-label {
  opacity: 1;
  transform: translateY(0);
}

.stat-sub {
  font-size: 10px;
  font-weight: 500;
  color: #94a3b8;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.5s ease 0.25s;
}

.stat-card--active .stat-sub {
  opacity: 1;
}
</style>
