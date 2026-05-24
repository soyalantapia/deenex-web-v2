<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 mb-4">
    <div class="flex items-center justify-between gap-3 mb-4">
      <div>
        <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
          Calculadora personalizada
        </p>
        <h3 class="text-base font-bold text-slate-900 leading-tight">
          Ajustá los números con tus reales
        </h3>
      </div>
      <button
        type="button"
        @click="resetToDefaults"
        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap"
        v-if="hasUserEdits"
      >
        Volver a defaults
      </button>
    </div>

    <!-- Inputs -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <label class="block">
        <span class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Ticket promedio
        </span>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">USD</span>
          <input
            v-model.number="form.ticket"
            type="number"
            min="5"
            max="200"
            step="1"
            @blur="onInputBlur('ticket')"
            class="w-full pl-11 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:border-primary focus:bg-white transition-colors no-spinner"
            aria-label="Ticket promedio en USD"
          />
        </div>
      </label>
      <label class="block">
        <span class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          Pedidos / local · mes
        </span>
        <input
          v-model.number="form.ordersPerLocation"
          type="number"
          min="50"
          max="5000"
          step="50"
          @blur="onInputBlur('ordersPerLocation')"
          class="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:border-primary focus:bg-white transition-colors no-spinner"
          aria-label="Pedidos por local por mes"
        />
      </label>
    </div>

    <!-- Output: GMV + savings -->
    <div class="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">GMV mensual</p>
        <p class="text-sm font-black text-slate-900 tabular-nums">
          USD <AnimatedNumber :value="customGmv" :duration="700" />
        </p>
      </div>
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">3rd parties</p>
        <p class="text-sm font-black text-rose-500 tabular-nums">
          -USD <AnimatedNumber :value="customThirdPartyFee" :duration="700" />
        </p>
      </div>
      <div>
        <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Ahorro Deenex</p>
        <p class="text-sm font-black text-emerald-600 tabular-nums">
          +USD <AnimatedNumber :value="customSavings" :duration="700" />
        </p>
      </div>
    </div>

    <p class="text-[10px] text-slate-400 leading-snug mt-3 italic">
      Cálculo basado en tus {{ onboarding.state.business.locations }} {{ onboarding.state.business.locations === 1 ? 'local' : 'locales' }} ·
      plan {{ recommendedPlan.name }} ({{ recommendedPlan.commissionPct }}% comisión).
      Comparado contra el 25% promedio de apps de terceros.
    </p>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import AnimatedNumber from '@/components/onboarding/AnimatedNumber.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const onboarding = useOnboarding()

// Defaults: derivados del state (mismas asunciones que el cálculo "estimado")
const defaultOrdersPerLocation = computed(() => {
  const l = Math.max(1, Number(onboarding.state.business.locations) || 1)
  return l <= 5 ? 300 : l <= 25 ? 800 : l <= 70 ? 1500 : 3000
})

const form = reactive({
  ticket: 15,
  ordersPerLocation: defaultOrdersPerLocation.value,
})

const hasUserEdits = computed(() => {
  return form.ticket !== 15 || form.ordersPerLocation !== defaultOrdersPerLocation.value
})

// Si cambian las ubicaciones afuera (volver al step 2), resincronizamos el
// default de pedidos — pero solo si el usuario no editó manualmente.
watch(defaultOrdersPerLocation, (next) => {
  if (!hasUserEdits.value) {
    form.ordersPerLocation = next
  }
})

function onInputBlur(field) {
  // Normalizamos a rangos seguros para que no haya valores absurdos.
  if (field === 'ticket') {
    form.ticket = Math.max(5, Math.min(200, Number(form.ticket) || 15))
  } else if (field === 'ordersPerLocation') {
    form.ordersPerLocation = Math.max(50, Math.min(5000, Math.round(Number(form.ordersPerLocation) || 300)))
  }
  onboarding.track('roi_calculator_edited', { field, value: form[field] })
}

function resetToDefaults() {
  form.ticket = 15
  form.ordersPerLocation = defaultOrdersPerLocation.value
  onboarding.track('roi_calculator_reset')
}

// ── Cálculos derivados ───────────────────────────────────────────────────
const recommendedPlan = computed(() => onboarding.recommendedPlan.value)

const customGmv = computed(() => {
  const locations = Math.max(1, Number(onboarding.state.business.locations) || 1)
  return Math.round(locations * form.ordersPerLocation * form.ticket)
})

const customThirdPartyFee = computed(() => Math.round(customGmv.value * 0.25))

const customDeenexFee = computed(() => {
  const tier = recommendedPlan.value
  const fee = tier.monthlyFee || 0
  const commission = customGmv.value * (tier.commissionPct / 100)
  return Math.round(fee + commission)
})

const customSavings = computed(() => Math.max(0, customThirdPartyFee.value - customDeenexFee.value))
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
