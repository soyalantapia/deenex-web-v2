<template>
  <div class="onboarding-shell min-h-screen bg-white">
    <!-- Top bar -->
    <header class="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <button type="button" @click="onExit" class="flex items-center gap-2 shrink-0 group">
          <img src="@/assets/images/nav-logo.webp" alt="Deenex" class="h-5 w-auto" />
        </button>

        <!-- Progress segments -->
        <div class="flex-1 max-w-md mx-auto hidden sm:flex items-center gap-1.5">
          <div
            v-for="(step, i) in steps"
            :key="step.key"
            class="h-1 flex-1 rounded-full transition-colors"
            :class="i <= activeStepIndex ? 'bg-primary' : 'bg-slate-200'"
          />
        </div>

        <!-- Step counter + completion -->
        <div class="text-[11px] font-bold text-slate-500 tracking-wider uppercase shrink-0 flex items-center gap-2">
          <span class="hidden sm:inline">{{ completionPct }}%</span>
          <span class="hidden sm:inline-block w-px h-3 bg-slate-200"></span>
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

    <!-- Exit confirmation modal -->
    <Teleport to="body">
      <Transition name="exit-overlay">
        <div
          v-if="showExitModal"
          class="fixed inset-0 z-[9998] bg-slate-900/50 backdrop-blur-sm"
          @click="showExitModal = false"
        ></div>
      </Transition>
      <Transition name="exit-modal">
        <div
          v-if="showExitModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 pointer-events-auto">
            <h3 class="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
              ¿Salir del trial?
            </h3>
            <p class="text-sm text-slate-500 leading-relaxed mb-6">
              Tu progreso queda guardado. Cuando vuelvas, retomás donde lo dejaste.
            </p>
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                @click="showExitModal = false"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Quedarme acá
              </button>
              <RouterLink
                to="/"
                @click="onConfirmExit"
                class="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors text-center"
              >
                Salir al inicio
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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

const completionPct = computed(() => {
  return Math.round(((activeStepIndex.value + 1) / steps.length) * 100)
})

const hasProgress = computed(() => onboarding.state.meta.completedSteps.length > 0)

const showExitModal = ref(false)
function onExit() {
  // Si está en Welcome (último paso), no abrimos modal — solo navegamos.
  if (route.path === '/comenzar/listo') {
    window.location.href = '/'
    return
  }
  showExitModal.value = true
  onboarding.track('exit_modal_shown', { from_step: steps[activeStepIndex.value]?.key })
}
function onConfirmExit() {
  onboarding.track('exit_confirmed', { from_step: steps[activeStepIndex.value]?.key })
  showExitModal.value = false
}

// ── <head> dinámico: title, robots, canonical ──────────────────────────
const previousMeta = {
  title: '',
  robots: '',
}

function applyStepHead() {
  const stepInfo = steps[activeStepIndex.value]
  const stepName = stepInfo?.key === 'identity' ? 'Tus datos'
    : stepInfo?.key === 'business' ? 'Tu marca'
    : stepInfo?.key === 'plan' ? 'Elegir plan'
    : stepInfo?.key === 'trial' ? 'Activar trial'
    : 'Listo'
  document.title = `Paso ${activeStepIndex.value + 1}/${steps.length} · ${stepName} · Deenex`
}

watch(() => route.path, applyStepHead)

onMounted(() => {
  previousMeta.title = document.title
  const robotsTag = document.head.querySelector('meta[name="robots"]')
  previousMeta.robots = robotsTag?.getAttribute('content') || ''
  if (robotsTag) robotsTag.setAttribute('content', 'noindex, nofollow')

  applyStepHead()

  const variant = route.query.from || ''
  onboarding.ensureStarted(variant)

  // Warning al cerrar la pestaña con progreso a medias
  window.addEventListener('beforeunload', onBeforeUnload)
})

function onBeforeUnload(e) {
  const completed = onboarding.state.meta.completedSteps.length
  if (completed > 0 && completed < 4 && route.path !== '/comenzar/listo') {
    e.preventDefault()
    // Chrome ignora el mensaje custom pero el dialog igual aparece.
    e.returnValue = 'Tu progreso queda guardado pero estás por salir del onboarding.'
    return e.returnValue
  }
}

onUnmounted(() => {
  // Restauramos title + robots para que el resto de la app no quede contaminada.
  document.title = previousMeta.title || 'Deenex | Tu canal propio'
  const robotsTag = document.head.querySelector('meta[name="robots"]')
  if (robotsTag && previousMeta.robots) {
    robotsTag.setAttribute('content', previousMeta.robots)
  }
  window.removeEventListener('beforeunload', onBeforeUnload)
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

/* Exit modal transitions */
.exit-overlay-enter-active,
.exit-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.exit-overlay-enter-from,
.exit-overlay-leave-to {
  opacity: 0;
}
.exit-modal-enter-active,
.exit-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.exit-modal-enter-from,
.exit-modal-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>
