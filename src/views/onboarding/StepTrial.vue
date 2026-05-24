<template>
  <div>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 4 de 5
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      Activá tu trial.<br />
      <span class="text-primary italic font-light">No cobramos nada hoy.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-8 max-w-md">
      Necesitamos tu método de pago para reservar tu cuenta. El primer cargo
      es <span class="font-bold text-slate-900">el día 16</span>, y si cancelás antes no te cobramos nunca.
    </p>

    <!-- Resumen del plan -->
    <div class="border border-slate-200 rounded-2xl p-6 mb-6 bg-slate-50/40">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tu plan</p>

      <div class="space-y-3 mb-5">
        <div class="flex justify-between items-baseline">
          <span class="text-sm text-slate-600">
            Plan {{ planSummary.name }}
            <span class="text-xs text-slate-400">· {{ onboarding.state.business.locations }} {{ onboarding.state.business.locations === 1 ? 'local' : 'locales' }}</span>
          </span>
          <span class="text-sm font-bold text-slate-900 tabular-nums">
            USD {{ planSummary.monthlyFee }}
            <span class="text-xs font-normal text-slate-400">/ mes</span>
          </span>
        </div>

        <div v-if="onboarding.state.plan.addLoyalty" class="flex justify-between items-baseline">
          <span class="text-sm text-slate-600">
            Fidelización Dinámica
            <span class="text-xs text-slate-400">· {{ onboarding.state.business.locations }} × USD 15</span>
          </span>
          <span class="text-sm font-bold text-slate-900 tabular-nums">
            USD {{ loyaltyCost }}
            <span class="text-xs font-normal text-slate-400">/ mes</span>
          </span>
        </div>

        <div class="flex justify-between items-baseline">
          <span class="text-sm text-slate-600">Comisión por venta</span>
          <span class="text-sm font-bold text-primary tabular-nums">{{ planSummary.commissionPct }}%</span>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-200/70 flex justify-between items-baseline">
        <span class="text-sm font-bold text-slate-900">Hoy pagás</span>
        <span class="text-xl font-black text-emerald-600 tabular-nums">USD 0,00</span>
      </div>
      <div class="mt-2 flex justify-between items-baseline">
        <span class="text-xs text-slate-400">A partir del día 16</span>
        <span class="text-xs font-bold text-slate-500 tabular-nums">
          USD {{ totalMonthly }} / mes
        </span>
      </div>
    </div>

    <!-- Selector método de pago: MP único por ahora -->
    <div class="mb-6">
      <span class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">
        Método de pago
      </span>
      <div class="border-2 border-primary bg-primary/[0.04] rounded-2xl p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <!-- Logo MP simplificado -->
          <svg viewBox="0 0 80 80" class="w-7 h-7" aria-label="MercadoPago">
            <circle cx="40" cy="40" r="36" fill="#009EE3" />
            <path d="M22 44c4-8 12-12 18-12s14 4 18 12c-4 4-10 6-18 6s-14-2-18-6z" fill="#FFD600" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900">MercadoPago</p>
          <p class="text-xs text-slate-500 mt-0.5 leading-snug">
            Tarjeta de crédito o dinero en cuenta. Procesamos por Argentina y México.
          </p>
        </div>
        <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Check class="w-3 h-3 text-white" />
        </div>
      </div>
    </div>

    <!-- Garantías -->
    <ul class="space-y-2 mb-8">
      <li class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
        <Shield class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        Datos cifrados end-to-end. Nunca vemos tu tarjeta.
      </li>
      <li class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
        <Clock class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        Cancelás en 1 click. Sin permanencia, sin penalidades.
      </li>
      <li class="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
        <FileText class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        Factura mensual automática a tu CUIT/RFC.
      </li>
    </ul>

    <button
      @click="onActivate"
      :disabled="loading"
      class="group w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold rounded-xl px-6 py-4 text-base transition-all shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
    >
      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      <template v-else>
        Activar mi cuenta con MercadoPago
        <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </template>
    </button>

    <button
      type="button"
      @click="$router.push('/comenzar/plan')"
      class="mt-4 w-full text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors text-center"
    >
      ← Cambiar de plan
    </button>

    <p class="mt-6 text-[11px] text-slate-400 leading-relaxed text-center">
      Al activar tu cuenta aceptás el cobro recurrente desde el día 16.
      Te avisamos por email 48h antes del primer cargo.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Shield, Clock, FileText, ArrowRight } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()
const loading = ref(false)

const planSummary = computed(() => {
  const key = onboarding.state.plan.key || onboarding.recommendedPlan.value.key
  return onboarding.PLAN_TIERS.find((t) => t.key === key) || onboarding.recommendedPlan.value
})

const loyaltyCost = computed(() => {
  return onboarding.state.plan.addLoyalty
    ? Number(onboarding.state.business.locations) * 15
    : 0
})

const totalMonthly = computed(() => {
  return (planSummary.value.monthlyFee || 0) + loyaltyCost.value
})

async function onActivate() {
  loading.value = true
  onboarding.track('mp_checkout_initiated', {
    plan: onboarding.state.plan.key,
    total: totalMonthly.value,
  })

  /*
   * Punto de integración con MercadoPago:
   *   POST /api/onboarding/checkout-preference
   *   body: { planKey, addLoyalty, locations, identity, business }
   *   response: { preferenceId, initPoint }
   *   redirect: window.location.href = initPoint
   *
   * Por ahora, simulamos la activación local. Cuando el backend esté listo,
   * reemplazar el setTimeout por la llamada al API + redirect a MP Checkout.
   */
  await new Promise((r) => setTimeout(r, 1400))

  onboarding.markTrialActivated('mercadopago', 'stub_pref_' + Date.now())
  router.push('/comenzar/listo')
}
</script>
