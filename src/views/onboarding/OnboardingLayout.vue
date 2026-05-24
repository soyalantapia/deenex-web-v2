<template>
  <div class="onboarding-shell min-h-screen bg-white">
    <!-- Top bar -->
    <header class="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-2 shrink-0">
          <img src="@/assets/images/nav-logo.webp" alt="Deenex" class="h-5 w-auto" />
        </RouterLink>

        <!-- Progress segments -->
        <div class="flex-1 max-w-md mx-auto hidden sm:flex items-center gap-1.5">
          <div
            v-for="(step, i) in steps"
            :key="step.key"
            class="h-1 flex-1 rounded-full transition-colors"
            :class="i <= activeStepIndex ? 'bg-primary' : 'bg-slate-200'"
          />
        </div>

        <!-- Step counter (mobile + secondary) -->
        <div class="text-[11px] font-bold text-slate-500 tracking-wider uppercase shrink-0">
          <span class="hidden sm:inline">Paso </span>
          <span class="text-slate-900">{{ activeStepIndex + 1 }}</span>
          <span class="text-slate-400">/{{ steps.length }}</span>
        </div>
      </div>
    </header>

    <!-- Body -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div class="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
        <!-- Main column -->
        <div class="max-w-xl">
          <RouterView v-slot="{ Component }">
            <Transition name="step" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>

        <!-- Side panel: contextual social proof + savings -->
        <aside class="hidden lg:block sticky top-32">
          <div class="bg-slate-50/60 border border-slate-200 rounded-3xl p-7 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent pointer-events-none"></div>
            <div class="relative">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-5">
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Trial 15 días
              </div>
              <h3 class="text-xl font-extrabold tracking-tighter text-slate-900 mb-3 leading-tight">
                Sin cargo hoy.<br />
                <span class="text-primary italic font-light">Cancelás cuando quieras.</span>
              </h3>
              <ul class="space-y-3 text-sm text-slate-600 leading-relaxed">
                <li class="flex items-start gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check class="w-3 h-3 text-primary" />
                  </span>
                  Configurás tu marca, menú y zona de delivery en menos de 30 minutos.
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check class="w-3 h-3 text-primary" />
                  </span>
                  Cobramos con MercadoPago recién al día 16. Antes de eso, no nos pagás nada.
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check class="w-3 h-3 text-primary" />
                  </span>
                  Si no convence, te exportamos los datos y bajamos la cuenta sin preguntas.
                </li>
              </ul>

              <div class="mt-7 pt-6 border-t border-slate-200/70">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Marcas que ya confían
                </p>
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="text-xs font-semibold text-slate-500">Palta</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span class="text-xs font-semibold text-slate-500">Hatsu</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span class="text-xs font-semibold text-slate-500">Coquitos</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span class="text-xs font-semibold text-slate-500">Monti</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span class="text-xs font-semibold text-slate-500">Glorias</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Resume hint if returning -->
          <p v-if="hasProgress" class="mt-5 text-[11px] text-slate-400 leading-relaxed">
            Tu progreso se guarda automáticamente. Podés cerrar la pestaña y volver cuando quieras.
          </p>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { Check } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'

const route = useRoute()
const onboarding = useOnboarding()

const steps = [
  { key: 'identity', label: 'Vos', path: '/comenzar' },
  { key: 'business', label: 'Tu marca', path: '/comenzar/negocio' },
  { key: 'plan', label: 'Plan', path: '/comenzar/plan' },
  { key: 'trial', label: 'Activar', path: '/comenzar/activar' },
  { key: 'welcome', label: 'Listo', path: '/comenzar/listo' },
]

const activeStepIndex = computed(() => {
  const i = steps.findIndex((s) => s.path === route.path)
  return i === -1 ? 0 : i
})

const hasProgress = computed(() => onboarding.state.meta.completedSteps.length > 0)

onMounted(() => {
  // Manejo del <head> de la sección — sin contaminar la home.
  const previousTitle = document.title
  document.title = 'Empezá tu trial gratis | Deenex'

  const robotsTag = document.head.querySelector('meta[name="robots"]')
  const previousRobots = robotsTag?.getAttribute('content')
  if (robotsTag) {
    robotsTag.setAttribute('content', 'noindex, nofollow')
  }

  // Marca el inicio del flow (si todavía no se marcó).
  const variant = route.query.from || ''
  onboarding.ensureStarted(variant)

  // Restore on unmount via beforeRouteLeave en cada step (simplificación: lo
  // dejamos en este lifecycle global porque el layout vive toda la sesión).
  // eslint-disable-next-line no-undef
  window.addEventListener(
    'beforeunload',
    () => {
      document.title = previousTitle
      if (robotsTag && previousRobots != null) {
        robotsTag.setAttribute('content', previousRobots)
      }
    },
    { once: true }
  )
})
</script>

<style scoped>
.onboarding-shell {
  font-feature-settings: 'cv11', 'ss01';
}

/* Step transition: subtle slide-up */
.step-enter-active,
.step-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.step-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
