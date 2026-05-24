<template>
  <!--
    Banner persistente que aparece en la landing si el lead ya activó su
    trial pero aún no llegó al cargo del día 16. Lo ven al volver a deenex.tech
    para recordarles que tienen una cuenta activa, sin agresividad.

    Lógica:
    - Solo se renderiza si state.meta.completedSteps incluye 'trial'.
    - Solo se renderiza si no estamos en /comenzar (eso ya lo cubre App.vue).
    - Dismiss por sesión via sessionStorage. Si la cierran, no la mostramos
      de nuevo hasta que el navegador cierre la pestaña.
    - Si los días al primer cargo son <= 0 (trial vencido), cambiamos el copy.
  -->
  <Transition name="trial-banner">
    <div
      v-if="show"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] w-[min(640px,calc(100vw-2rem))]"
    >
      <div class="rounded-2xl bg-slate-900 text-white shadow-2xl shadow-slate-900/30 border border-slate-700 px-4 py-3 flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          :class="trialExpired ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'"
        >
          <Sparkles v-if="!trialExpired" class="w-5 h-5" />
          <Clock v-else class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm font-bold leading-tight">
            <template v-if="trialExpired">
              Tu trial venció. <span class="text-amber-300">Activá tu cuenta para no perder los datos.</span>
            </template>
            <template v-else>
              Tu trial está activo.
              <span class="text-emerald-300 tabular-nums">{{ daysLeft }} {{ daysLeft === 1 ? 'día' : 'días' }} restantes</span>
              hasta el primer cargo.
            </template>
          </p>
          <p class="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
            <span class="font-semibold text-slate-300">{{ brand || 'Tu cuenta' }}</span>
            <span v-if="subdomain"> · {{ subdomain }}.deenex.app</span>
          </p>
        </div>
        <a
          :href="dashboardUrl"
          @click="trackDashboard"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary hover:bg-[#3c1fc9] text-white text-xs font-bold transition-colors shrink-0"
        >
          Entrar
          <ArrowRight class="w-3 h-3" />
        </a>
        <button
          type="button"
          @click="dismiss"
          class="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
          aria-label="Ocultar banner"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Sparkles, Clock, ArrowRight, X } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'

const onboarding = useOnboarding()

// Dismiss persiste por sesión. Si quisiéramos un dismiss más duradero
// usaríamos localStorage, pero ese caso lo cubre el botón "Cancelar trial"
// en el dashboard real — acá queremos que el lead que cierra el banner
// igual lo vea en su próxima visita.
const DISMISS_KEY = 'deenex_trial_banner_dismissed'
const dismissed = ref(false)

const dashboardUrl = import.meta.env.VITE_APP_DASHBOARD_URL || 'https://app.deenex.tech'

const brand = computed(() => onboarding.state.business.brand)
const subdomain = computed(() => onboarding.subdomainPreview.value)

const daysLeft = computed(() => {
  const ms = onboarding.firstChargeDate.value.getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
})

const trialExpired = computed(() => daysLeft.value <= 0)

const hasActivated = computed(() =>
  onboarding.state.meta.completedSteps.includes('trial')
)

const show = computed(() => hasActivated.value && !dismissed.value)

function dismiss() {
  dismissed.value = true
  try { sessionStorage.setItem(DISMISS_KEY, '1') } catch {}
  onboarding.track('trial_banner_dismissed', { days_left: daysLeft.value })
}

function trackDashboard() {
  onboarding.track('trial_banner_dashboard_click', { days_left: daysLeft.value })
}

onMounted(() => {
  if (typeof window !== 'undefined' && sessionStorage.getItem(DISMISS_KEY)) {
    dismissed.value = true
  }
  if (show.value) {
    onboarding.track('trial_banner_shown', { days_left: daysLeft.value })
  }
})
</script>

<style scoped>
.trial-banner-enter-active,
.trial-banner-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.trial-banner-enter-from,
.trial-banner-leave-to {
  opacity: 0;
  transform: translate(-50%, 24px);
}
</style>
