<template>
  <section id="demo" class="py-24 px-6 sm:px-12 bg-white overflow-hidden" ref="sectionRef">
    <div class="max-w-6xl mx-auto">

      <!-- Header, mismo patrón editorial de las otras secciones -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
          La plataforma completa,<br />
          <span class="text-primary italic font-light">en seis minutos.</span>
        </h2>
        <div class="hidden lg:block max-w-[300px] text-right relative lg:ml-auto">
          <div class="absolute -left-10 top-0 bottom-0 w-px bg-slate-200/60"></div>
          <p class="text-slate-400 text-sm leading-relaxed pr-2">
            "Así se ve la experiencia para tu cliente y el control que tenés desde el dashboard."
          </p>
        </div>
      </div>

      <!-- Video container -->
      <div class="demo-wrapper" :class="{ 'demo-wrapper--visible': visible }">
        <div class="demo-video">
          <div class="demo-ratio">
            <iframe
              :src="`https://player.vimeo.com/video/${VIMEO_ID}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&color=4f26db`"
              frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowfullscreen class="demo-iframe" title="Deenex Platform Demo"></iframe>
          </div>
        </div>
      </div>

      <!-- CTA, trial self-serve. RouterLink para evitar full reload al navegar
           al onboarding (era #agendar anchor hardcoded). -->
      <div class="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <RouterLink :to="{ path: '/comenzar', query: { from: 'demo_video' } }"
          @click="trackEvent('click_trial_start', { source: 'demo_video' })"
          class="demo-link-primary">
          Empezar 14 días gratis
        </RouterLink>
        <a href="#infraestructura" class="demo-link-ghost">Ver toda la infraestructura</a>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { trackEvent } from '@/utils/analytics'

// ← reemplazá con tu ID de Vimeo real
const VIMEO_ID = '1183253994'

const sectionRef = ref(null)
const visible = ref(false)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.12 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)

  // Vimeo Tracking
  const iframe = document.querySelector('.demo-iframe')
  if (iframe && window.Vimeo) {
    const player = new window.Vimeo.Player(iframe)
    
    player.on('play', () => {
      trackEvent('video_play')
    })

    player.on('ended', () => {
      trackEvent('video_completado')
    })
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* ── Wrapper con transición de entrada ── */
.demo-wrapper {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.75s ease, transform 0.75s ease;
}

.demo-wrapper--visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Video container ── */
.demo-video {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 12px 48px rgba(15, 23, 42, 0.1);
}

/* ── Ratio 16/9 ── */
.demo-ratio {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #000;
}

.demo-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* ── CTAs texto, mismo estilo del resto del sitio ── */
.demo-link-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary, #4f26db);
  text-decoration: none;
  border-bottom: 1.5px solid currentColor;
  padding-bottom: 1px;
  transition: opacity 0.2s ease;
}

.demo-link-primary:hover {
  opacity: 0.7;
}

.demo-link-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.demo-link-ghost:hover {
  color: #0f172a;
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .demo-video {
    border-radius: 10px;
  }
}
</style>
