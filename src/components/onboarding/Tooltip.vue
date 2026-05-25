<template>
  <!--
    Tooltip de ayuda contextual. Iconito ? que al hover / focus muestra texto
    explicativo. Usado en campos del onboarding que pueden generar dudas
    (POS, canales, comisión, fee, billing).
  -->
  <span class="inline-flex items-center relative" @mouseenter="open = true" @mouseleave="open = false">
    <button
      type="button"
      :aria-label="`Ayuda: ${label}`"
      @click.stop="open = !open"
      @focus="open = true"
      @blur="open = false"
      class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors"
    >
      ?
    </button>
    <Transition name="tooltip">
      <span
        v-if="open"
        :class="[
          'absolute z-50 w-56 sm:w-64 p-3 rounded-xl text-[11px] font-normal leading-snug shadow-lg shadow-slate-900/15 pointer-events-none',
          variant === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200',
          placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          align === 'right' ? 'right-0' : (align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'),
        ]"
        role="tooltip"
      >
        <slot>{{ text }}</slot>
      </span>
    </Transition>
  </span>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  // Texto del tooltip (alternativa al slot).
  text: { type: String, default: '' },
  // Label semántico para accesibilidad (aria-label).
  label: { type: String, default: 'Información adicional' },
  // 'dark' o 'light'. Dark se usa para tooltips contextuales rápidos;
  // light para tooltips dentro de cards oscuras.
  variant: { type: String, default: 'dark' },
  placement: { type: String, default: 'top' }, // 'top' | 'bottom'
  align: { type: String, default: 'center' }, // 'left' | 'center' | 'right'
})

const open = ref(false)
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.15s ease;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(2px);
}
</style>
