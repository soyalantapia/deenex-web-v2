<template>
  <Teleport to="body">
    <Transition name="resume-overlay">
      <div v-if="show" class="fixed inset-0 z-[9998] bg-slate-900/50 backdrop-blur-sm" @click="onDecline" aria-hidden="true"></div>
    </Transition>
    <Transition name="resume-modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          ref="modalRef"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 pointer-events-auto"
        >
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Sparkles class="w-6 h-6 text-primary" />
          </div>
          <h3 id="resume-modal-title" class="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
            ¡Te reconocemos!
          </h3>
          <p class="text-sm text-slate-500 leading-relaxed mb-2">
            Encontramos un onboarding a medio terminar para
            <span class="font-bold text-slate-900">{{ progressSummary.email }}</span>.
          </p>
          <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 mb-5 text-sm">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tu progreso</span>
              <span class="text-[10px] font-bold text-emerald-600">
                {{ progressSummary.completedSteps }}/{{ totalSteps }} completados
              </span>
            </div>
            <p class="text-slate-700 font-semibold">
              {{ progressSummary.brand || 'Tu marca' }}
              <span class="text-slate-400 font-normal mx-1">·</span>
              <span class="text-slate-500 font-normal">
                {{ progressSummary.locations }} {{ progressSummary.locations === 1 ? 'local' : 'locales' }}
              </span>
            </p>
            <p class="text-xs text-slate-500 mt-1">
              Última actividad: {{ progressSummary.lastActivity }}
            </p>
          </div>
          <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
            <button
              type="button"
              @click="onStartOver"
              class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Empezar de cero
            </button>
            <button
              type="button"
              @click="onResume"
              class="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-[#3c1fc9] transition-colors"
            >
              Continuar donde dejé →
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, toRef, onMounted, onUnmounted } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import { useFocusTrap } from '@/composables/useFocusTrap'

const props = defineProps({
  show: { type: Boolean, default: false },
  progressSummary: {
    type: Object,
    default: () => ({
      email: '',
      brand: '',
      locations: 1,
      completedSteps: 0,
      lastActivity: '',
    }),
  },
  totalSteps: { type: Number, default: 6 },
})

const emit = defineEmits(['resume', 'startOver', 'decline'])

// Ref al contenedor del modal para que useFocusTrap pueda buscar focusables.
const modalRef = ref(null)

// useFocusTrap espera un Ref<boolean>, convertimos `show` (prop, ya reactivo)
// con toRef. Esto garantiza: foco-on-open, restore-on-close, Tab cycling +
// Esc → close (Esc lo manejamos abajo manualmente porque el composable solo
// hace trap de Tab; queremos cerrar el modal con Esc).
useFocusTrap(toRef(props, 'show'), modalRef)

function onResume() {
  emit('resume')
}
function onStartOver() {
  emit('startOver')
}
function onDecline() {
  emit('decline')
}

// ESC cierra el modal, accesibilidad básica.
function onKeyDown(e) {
  if (e.key === 'Escape' && props.show) onDecline()
}
onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
.resume-overlay-enter-active,
.resume-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.resume-overlay-enter-from,
.resume-overlay-leave-to {
  opacity: 0;
}
.resume-modal-enter-active,
.resume-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.resume-modal-enter-from,
.resume-modal-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
