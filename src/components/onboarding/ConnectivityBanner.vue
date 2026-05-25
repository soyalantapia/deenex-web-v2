<template>
  <!--
    Banner que aparece arriba del onboarding shell cuando:
    1. El navegador está offline.
    2. localStorage falló (modo privado de Safari, quota llena).
    3. Hubo un error en alguna acción crítica (save & exit, etc).

    Self-healing: cuando vuelve la conexión o el storage está OK, se oculta.
  -->
  <Transition name="connectivity-banner">
    <div
      v-if="visible"
      class="sticky top-0 z-[60] flex items-center justify-center gap-3 px-4 py-2 text-xs font-semibold"
      :class="severityClass"
      role="status"
      aria-live="polite"
    >
      <component :is="icon" class="w-3.5 h-3.5 shrink-0" />
      <span class="text-center leading-snug">{{ message }}</span>
      <button
        v-if="retryable"
        type="button"
        @click="onRetry"
        class="ml-1 underline-offset-2 hover:underline font-bold uppercase tracking-wider text-[10px] shrink-0"
      >
        Reintentar
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { WifiOff, AlertTriangle, Check } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'

const onboarding = useOnboarding()

const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
const recovered = ref(false) // mostramos "Conexión recuperada" por 2s
let recoveredTimer = null

function onOnline() {
  if (!isOnline.value) {
    recovered.value = true
    if (recoveredTimer) clearTimeout(recoveredTimer)
    recoveredTimer = setTimeout(() => { recovered.value = false }, 2500)
  }
  isOnline.value = true
  onboarding.track('connectivity_online')
}
function onOffline() {
  isOnline.value = false
  onboarding.track('connectivity_offline')
}

onMounted(() => {
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
})
onUnmounted(() => {
  window.removeEventListener('online', onOnline)
  window.removeEventListener('offline', onOffline)
  if (recoveredTimer) clearTimeout(recoveredTimer)
})

// Si hay save error, mostramos el banner aunque esté online. Saved-error y
// offline pueden coexistir; priorizamos offline porque es más informativo.
const saveErrored = computed(() => onboarding.saveStatus.value === 'error')

const visible = computed(() => !isOnline.value || saveErrored.value || recovered.value)

const severityClass = computed(() => {
  if (!isOnline.value) return 'bg-rose-600 text-white'
  if (saveErrored.value) return 'bg-amber-500 text-white'
  return 'bg-emerald-500 text-white'
})

const icon = computed(() => {
  if (!isOnline.value) return WifiOff
  if (saveErrored.value) return AlertTriangle
  return Check
})

const message = computed(() => {
  if (!isOnline.value) {
    return 'Estás sin conexión. Tu progreso se guarda local y se sincroniza cuando volvés online.'
  }
  if (saveErrored.value) {
    return 'No pudimos guardar tu progreso. Si estás en modo privado, los datos no van a persistir.'
  }
  return 'Conexión recuperada. Tu progreso está al día.'
})

const retryable = computed(() => saveErrored.value)

function onRetry() {
  // Forzamos un re-save tocando un timestamp en meta.
  onboarding.state.meta.startedAt = onboarding.state.meta.startedAt || new Date().toISOString()
  onboarding.track('connectivity_retry')
}
</script>

<style scoped>
.connectivity-banner-enter-active,
.connectivity-banner-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.connectivity-banner-enter-from,
.connectivity-banner-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
