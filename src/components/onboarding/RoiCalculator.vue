<template>
  <div class="rounded-2xl border-2 border-primary/20 bg-primary/[0.02] p-5 mb-4">
    <div class="flex items-center justify-between gap-3 mb-1">
      <div class="flex items-center gap-2">
        <Calculator class="w-4 h-4 text-primary" />
        <p class="text-[10px] font-black text-primary uppercase tracking-widest">
          Antes de ver el ahorro, ajustá los números
        </p>
      </div>
      <button
        type="button"
        @click="resetToDefaults"
        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap"
        v-if="onboarding.hasCustomRoiInputs.value"
      >
        Volver a defaults
      </button>
    </div>
    <h3 class="text-base font-bold text-slate-900 leading-tight mb-4">
      Tus números reales hacen mejor la proyección
    </h3>

    <!-- Inputs -->
    <div class="grid grid-cols-2 gap-3">
      <label class="block">
        <span class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Ticket promedio
        </span>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">USD</span>
          <input
            v-model.number="form.ticket"
            type="number"
            min="3"
            max="200"
            step="1"
            @blur="onInputBlur('ticket')"
            class="w-full pl-11 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:border-primary transition-colors no-spinner"
            aria-label="Ticket promedio en USD"
          />
        </div>
      </label>
      <label class="block">
        <span class="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">
          Pedidos / local · mes ★
        </span>
        <input
          v-model.number="form.ordersPerLocation"
          type="number"
          min="20"
          max="10000"
          step="50"
          @blur="onInputBlur('ordersPerLocation')"
          class="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-primary/30 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:border-primary transition-colors no-spinner"
          aria-label="Pedidos por local por mes"
        />
      </label>
    </div>

    <p class="text-[10px] text-slate-400 leading-snug mt-3 italic">
      ★ Tus pedidos/mes determinan el plan recomendado. Default conservador
      <span class="font-bold text-slate-600">300 pedidos/local</span>;
      si tu volumen es mayor, ajustá para ver tu plan real.
    </p>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import { Calculator } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'

const onboarding = useOnboarding()

// El pricing 2026 se calcula por VOLUMEN TOTAL de pedidos (locales ×
// pedidos/local). Default: 300 pedidos/local, sirve como punto de partida
// honesto para marcas nuevas. El lead lo ajusta acá en vivo y la tier
// recomendada se actualiza al toque (es reactiva al state).
const form = reactive({
  ticket: onboarding.state.business.avgTicketUsd || onboarding.defaultAvgTicketUsd,
  ordersPerLocation:
    onboarding.state.business.ordersPerLocation ||
    onboarding.computeDefaultOrders(),
})

// Sincronizamos en vivo hacia el state global, el hero del Step 3 reactivo
// al cambio porque depende de los mismos computeds.
watch(
  () => [form.ticket, form.ordersPerLocation],
  ([t, o]) => {
    onboarding.state.business.avgTicketUsd = Number(t) || null
    onboarding.state.business.ordersPerLocation = Number(o) || null
  },
  { deep: true }
)

function onInputBlur(field) {
  if (field === 'ticket') {
    form.ticket = Math.max(3, Math.min(200, Number(form.ticket) || onboarding.defaultAvgTicketUsd))
  } else if (field === 'ordersPerLocation') {
    form.ordersPerLocation = Math.max(20, Math.min(10000, Math.round(Number(form.ordersPerLocation) || 280)))
  }
  onboarding.track('roi_calculator_edited', { field, value: form[field] })
}

function resetToDefaults() {
  form.ticket = onboarding.defaultAvgTicketUsd
  form.ordersPerLocation = onboarding.computeDefaultOrders()
  onboarding.track('roi_calculator_reset')
}

onMounted(() => {
  // Sincronizar al mount con los defaults globales (sin parametrizar por
  // locales, ahora el default es 300 fijo, el lead lo ajusta a su realidad).
  if (!onboarding.state.business.avgTicketUsd) {
    form.ticket = onboarding.defaultAvgTicketUsd
  }
  if (!onboarding.state.business.ordersPerLocation) {
    form.ordersPerLocation = onboarding.computeDefaultOrders()
  }
})
</script>

<style scoped>
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinner {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
