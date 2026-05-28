<template>
  <div class="mt-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-slate-100">
    <button
      v-if="showBack"
      type="button"
      @click="$emit('back')"
      class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
    >
      <ArrowLeft class="w-3.5 h-3.5" />
      {{ backLabel }}
    </button>
    <span v-else></span>

    <button
      type="submit"
      :disabled="disabled || loading"
      :aria-busy="loading"
      class="group inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-xl px-6 py-3.5 text-sm transition-all shadow-md shadow-primary/25 hover:bg-[#3c1fc9] hover:shadow-primary/40 hover:-translate-y-0.5 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-slate-300"
    >
      <!-- aria-hidden en el spinner para que el SR no lo lea como contenido.
           El texto del botón ya cambia a loadingLabel, eso es lo que se
           anuncia + aria-busy=true informa el estado. -->
      <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></span>
      {{ loading ? loadingLabel : nextLabel }}
      <ArrowRight v-if="!loading" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup>
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

defineProps({
  showBack: { type: Boolean, default: true },
  backLabel: { type: String, default: 'Volver' },
  nextLabel: { type: String, default: 'Continuar' },
  loadingLabel: { type: String, default: 'Procesando…' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

defineEmits(['back'])
</script>
