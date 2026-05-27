<template>
  <section id="hero" :class="{ 'hero-ready': ready }"
    class="hero-section relative flex h-[100svh] min-h-[800px] sm:min-h-[850px] flex-col overflow-hidden pt-24 sm:pt-32 lg:pt-24">

    <!-- Background -->
    <div class="pointer-events-none absolute inset-0 z-0">
      <!-- Dot grid -->
      <div class="hero-dot-grid absolute inset-0 z-0"></div>
      <!-- Gradient mesh orbs (animated) -->
      <div class="orb orb-1 absolute rounded-full bg-primary/10 blur-[120px]"></div>
      <div class="orb orb-2 absolute rounded-full bg-violet-400/8 blur-[140px]"></div>
      <div class="orb orb-3 absolute rounded-full bg-indigo-300/6 blur-[100px]"></div>
    </div>

    <div class="relative z-10 mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-4 text-center sm:px-6 lg:px-8">

      <!-- Pill Badge (Eyebrow) -->
      <div :class="{ 'animate-rise': ready, 'opacity-0': !ready }" class="mb-8 flex justify-center"
        style="animation-delay:0.05s">
        <span
          class="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 text-primary rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide">
          Ventas · Fidelización · Marketing
        </span>
      </div>

      <!-- Headline -->
      <h1 :class="{ 'animate-rise': ready, 'opacity-0': !ready }"
        class="font-heading text-[clamp(2.4rem,5.8vw,4.2rem)] leading-[1.05] tracking-tighter text-slate-900"
        style="animation-delay:0.15s">
        <span class="block font-extrabold">Lanzá tu canal propio</span>
        <span
          class="relative flex items-center justify-center font-extrabold flex-wrap gap-x-[0.25em] sm:gap-x-[0.3em] mt-1">
          <span class="text-slate-900">sin</span>
          <!-- Container del wheel — aria-hidden porque la animación CSS
               muestra todas las palabras al SR. La palabra "viva" se anuncia
               por separado con <span aria-live> abajo. -->
          <span
            class="relative block h-[1.3em] overflow-hidden italic text-primary text-left min-w-[200px] sm:min-w-[340px]"
            aria-hidden="true">
            <div class="wheel-container">
              <div v-for="(word, i) in displayWords" :key="i" class="wheel-word h-[1.3em] flex items-center">{{ word }}.
              </div>
            </div>
          </span>
          <!-- Fallback accesible: lee solo la primera palabra como representativa
               (es lo más limpio para SR — no leer las 4 palabras seguidas). -->
          <span class="sr-only">{{ words[0] }}.</span>
        </span>
      </h1>

      <!-- Subtitle -->
      <p :class="{ 'animate-rise': ready, 'opacity-0': !ready }"
        class="mx-auto mt-8 max-w-[540px] text-[1.05rem] font-medium leading-[1.7] text-slate-500"
        style="animation-delay:0.28s">
        Tus clientes se registran en tu propia app y vos los reactivás
        con campañas por <span class="font-semibold text-slate-800">WhatsApp y Push Notifications</span>.
      </p>

      <!-- CTAs, primary: self-serve trial · secondary: scroll to product details.
           Mobile: stack vertical (cabe holgado, no aprieta). Desktop: side-by-side. -->
      <div :class="{ 'animate-rise': ready, 'opacity-0': !ready }"
        class="mt-9 mb-5 sm:mb-0 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4" style="animation-delay:0.4s">
        <RouterLink :to="ctaTarget"
          @click="onCtaClick"
          :data-experiment="heroCta.variant.value.id"
          class="btn-primary group inline-flex items-center gap-2 bg-primary text-white font-semibold rounded-xl px-4 py-2.5 sm:px-6 sm:py-3.5 text-[0.82rem] sm:text-[0.9rem] transition-all hover:bg-[#3c1fc9] shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 relative overflow-hidden">
          <span class="btn-shimmer"></span>
          {{ heroCta.variant.value.payload.label }}
          <span
            class="inline-flex items-center justify-center w-5 h-5 rounded-lg bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
            <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>
        </RouterLink>

        <a href="#infraestructura"
          class="group inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3.5 text-[0.82rem] sm:text-[0.9rem] font-semibold text-slate-600 hover:text-primary transition-colors">
          Ver cómo funciona
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none"
            class="transition-transform duration-300 group-hover:translate-x-0.5">
            <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </a>
      </div>

      <!-- Trust line debajo del CTA -->
      <p :class="{ 'animate-rise': ready, 'opacity-0': !ready }"
        class="mt-3 text-[11px] text-slate-400 font-medium"
        style="animation-delay:0.45s">
        Sin cargo durante 14 días · Cancelás en 1 click · Setup en menos de 30 min
      </p>

      <!-- Social Proof -->
      <div :class="{ 'animate-rise': ready, 'opacity-0': !ready }"
        class="mt-3 sm:mt-10 flex items-center justify-center gap-3" style="animation-delay:0.5s">
        <div class="flex -space-x-2">
          <div v-for="badge in badges" :key="badge.tag" :title="badge.label || badge.tag"
            :class="['w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center text-[0.62rem] sm:text-[0.68rem] font-bold shadow-sm', badge.color]">
            {{ badge.tag }}
          </div>
        </div>
        <span class="text-[0.82rem] sm:text-[0.88rem] text-slate-500 font-medium">
          <span class="font-bold text-slate-900">+500 sucursales</span> ya operan con Deenex
        </span>
      </div>

      <!-- Mockup stage -->
      <div class="relative flex-1 overflow-visible min-h-[450px]">

        <!-- Float cards desktop -->
        <div v-for="(pos, i) in floatPositions" :key="i" v-show="floatImages[i]" :class="['float-card-container hidden sm:block absolute z-20 transition-all duration-1000 ease-out',
          pos.class,
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
          :style="{ transitionDelay: (1.2 + i * 0.2) + 's' }">
          <div class="glass-morph float-card-inner rounded-2xl shadow-xl overflow-hidden">
            <img :src="floatImages[i]" alt="" class="w-full" />
          </div>
        </div>

        <!-- Float cards mobile -->
        <div v-if="floatImages[0]" :class="['absolute left-[1%] top-[20%] z-30 block w-[35vw] max-w-[140px] sm:hidden transition-all duration-1000',
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4']" style="transition-delay: 1.5s">
          <div class="glass-morph float-card-inner rounded-lg shadow-xl overflow-hidden anim-f1">
            <img :src="floatImages[0]" class="w-full" />
          </div>
        </div>
        <div v-if="floatImages[1]" :class="['absolute right-[2%] top-[35%] z-30 block w-[32vw] max-w-[130px] sm:hidden transition-all duration-1000',
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4']" style="transition-delay: 1.7s">
          <div class="glass-morph float-card-inner rounded-lg shadow-xl overflow-hidden anim-f2">
            <img :src="floatImages[1]" class="w-full" />
          </div>
        </div>

        <!-- MacBook -->
        <div
          class="absolute inset-x-0 bottom-[30%] z-10 flex justify-center px-4 sm:bottom-[-10%] md:bottom-[-15%] lg:bottom-[-20%]">
          <div class="relative z-10 w-full max-w-[120%] sm:max-w-[100%] lg:max-w-[1300px] xl:max-w-[800px]">
            <!-- Radial glow under mockup -->
            <div
              class="mockup-glow absolute bottom-[15%] left-1/2 -translate-x-1/2 z-0 h-[200px] w-[80%] max-w-3xl rounded-full bg-primary/20 blur-[80px]">
            </div>
            <img src="@/assets/images/hero.webp" alt="Deenex Dashboard"
              class="mockup-img relative z-10 block h-auto w-full" />
          </div>
        </div>


        <div class="fade-overlay pointer-events-none absolute inset-x-0 bottom-0 z-40 h-1/2"></div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { trackEvent } from '@/utils/analytics'
import { useExperiment } from '@/composables/useExperiment'

// A/B/C test del CTA primario del Hero. Cada variante mantiene la misma
// promesa pero con framing distinto. La conversión se mide cuando el lead
// completa el step 4 (StepTrial), ahí firamos experiment_conversion.
//
// `target` controla a dónde lleva el click: la variante "see_demo" entra al
// sandbox público (/demo) primero, las demás van directo al onboarding form.
// Cuando el lead activa el trial desde /demo, lo sumamos como la misma
// conversion del experimento, el tracking lo hace StepTrial igual.
const heroCta = useExperiment('hero_cta_v1', [
  { id: 'control', weight: 1, payload: { label: 'Empezar 14 días gratis', target: '/comenzar' } },
  { id: 'no_card', weight: 1, payload: { label: 'Probar Deenex sin tarjeta', target: '/comenzar' } },
  { id: 'see_demo', weight: 1, payload: { label: 'Ver demo del dashboard', target: '/demo' } },
])

const ctaTarget = computed(() => ({
  path: heroCta.variant.value.payload.target || '/comenzar',
  query: { from: 'home', exp: heroCta.variant.value.id },
}))

function onCtaClick() {
  trackEvent('click_trial_start', {
    source: 'hero',
    variant: heroCta.variant.value.id,
    target: heroCta.variant.value.payload.target || '/comenzar',
  })
}
const ready = ref(false)

// Carga dinámica de imágenes de floats
const floatImages = Object.values(
  import.meta.glob('/src/assets/images/floats/*.webp', { eager: true, import: 'default' })
)

onMounted(() => {
  // Esperamos a que el LoadingScreen.vue termine su secuencia
  setTimeout(() => {
    ready.value = true
  }, 2300)
})


const words = ['intermediarios', 'complicaciones', 'interferencias']
const displayWords = [...words, words[0]]

// Iniciales basadas en clientes reales (Palta, Hatsu, Glorias, Monti) — más
// social proof que iniciales abstractas. Coordina con los logos de Clients.vue.
const badges = [
  { tag: 'PA', label: 'Palta', color: 'bg-emerald-100 text-emerald-700' },
  { tag: 'HA', label: 'Hatsu', color: 'bg-rose-100 text-rose-600' },
  { tag: 'GL', label: 'Glorias', color: 'bg-amber-100 text-amber-700' },
  { tag: 'MO', label: 'Monti', color: 'bg-violet-100 text-violet-600' },
]

const floatPositions = [
  { class: 'left-[2%] top-[5%] sm:w-[22vw] sm:max-w-[240px] lg:left-[5%] lg:w-[18vw] lg:max-w-[220px] anim-f1' },
  { class: 'left-[15%] top-[50%] sm:w-[26vw] sm:max-w-[280px] lg:top-[45%] lg:w-[22vw] lg:max-w-[260px] anim-f2' },
  { class: 'right-[12%] top-[10%] sm:w-[20vw] sm:max-w-[220px] lg:w-[16vw] lg:max-w-[280px] anim-f3' },
  { class: 'right-[1%] top-[60%] sm:w-[24vw] sm:max-w-[260px] lg:right-[3%] lg:w-[20vw] lg:max-w-[240px] anim-f4' },
]
</script>

<style scoped>
.hero-section {
  background: #f8f9fb;
}

/* Dot grid background */
.hero-dot-grid {
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
}

/* Orbs */
.orb {
  position: absolute;
}

.orb-1 {
  width: 600px;
  height: 600px;
  left: -8%;
  top: -5%;
  animation: orbDrift 20s ease-in-out infinite alternate;
}

.orb-2 {
  width: 700px;
  height: 700px;
  right: -12%;
  top: 20%;
  animation: orbDrift 25s ease-in-out 3s infinite alternate-reverse;
}

.orb-3 {
  width: 400px;
  height: 400px;
  left: 30%;
  bottom: 10%;
  animation: orbDrift 18s ease-in-out 5s infinite alternate;
}

@keyframes orbDrift {
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(30px, -20px) scale(1.05);
  }
}

/* Glass morphism on floats */
.glass-morph {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.85);
}

/* Entry animation */
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
    filter: blur(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

.animate-rise {
  animation: rise 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* MacBook entry */
.mockup-img {
  opacity: 0;
}

.hero-ready .mockup-img {
  animation: entryMac 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

@keyframes entryMac {
  from {
    opacity: 0;
    transform: translateY(80px) scale(0.92);
    filter: blur(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

/* Mockup glow pulse */
.mockup-glow {
  animation: glowPulse 4s ease-in-out infinite alternate;
}

@keyframes glowPulse {
  from {
    opacity: 0.6;
    transform: translateX(-50%) scaleX(0.9);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) scaleX(1.05);
  }
}


/* Floating cards - Infinite Loop (applied to inner to avoid conflict with entrance) */
.anim-f1 {
  animation: floatY 10s ease-in-out infinite;
}

.anim-f2 {
  animation: floatY 9s ease-in-out 1s infinite;
}

.anim-f3 {
  animation: floatY 11s ease-in-out 0.5s infinite;
}

.anim-f4 {
  animation: floatY 9.5s ease-in-out 1.5s infinite;
}

@keyframes floatY {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

.float-card-inner {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.float-card-container:hover .float-card-inner {
  transform: translateY(-12px) scale(1.04);
  z-index: 50;
}


/* Word wheel */
.wheel-container {
  display: flex;
  flex-direction: column;
  animation: wheelScroll 10s cubic-bezier(0.76, 0, 0.24, 1) infinite;
}

@keyframes wheelScroll {

  0%,
  25% {
    transform: translateY(0);
  }

  30%,
  55% {
    transform: translateY(-25%);
  }

  60%,
  85% {
    transform: translateY(-50%);
  }

  90%,
  100% {
    transform: translateY(-75%);
  }
}

/* CTA shimmer */
.btn-primary {
  isolation: isolate;
}

.btn-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.18) 50%, transparent 60%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* Fade overlay bottom */
.fade-overlay {
  background: linear-gradient(to bottom,
      transparent 0%,
      rgba(248, 249, 251, 0) 10%,
      rgba(248, 249, 251, 0.9) 70%,
      rgba(248, 249, 251, 1) 100%);
}

@media (max-width: 639px) {
  .fade-overlay {
    height: 70% !important;
    background: linear-gradient(to bottom,
        transparent 0%,
        rgba(248, 249, 251, 0) 5%,
        rgba(248, 249, 251, 0.95) 50%,
        rgba(248, 249, 251, 1) 100%);
  }
}
</style>