<template>
  <!--
    Paso 3/5, Ahorro proyectado.

    Antes este contenido vivía en la primera mitad de StepPlan. Lo separamos
    para reducir cognitive load: el lead primero ENTIENDE cuánto ahorra,
    después elige el plan en otro paso. Misma información, dos breaths.
  -->
  <form @submit.prevent="onContinue" novalidate>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 3 de 6
    </p>
    <!-- Sin <br /> entre el greeting y "cuánto ahorrás", el lead lee la
         frase como una sola idea ("Alan, mirá cuánto ahorrás."). El span
         italic primary sigue dando el énfasis visual sin partir la línea. -->
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      <template v-if="onboarding.greeting.value">
        {{ onboarding.greeting.value }}, mirá
        <span class="text-primary italic font-light">cuánto ahorrás.</span>
      </template>
      <template v-else>
        Cuánto vas <span class="text-primary italic font-light">a ahorrar.</span>
      </template>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-6 max-w-md">
      Calculado en base a tus
      <span class="font-bold text-slate-900">{{ onboarding.state.business.locations }} {{ onboarding.state.business.locations === 1 ? 'local' : 'locales' }}</span>.
      Ajustá los números si querés ver tu proyección real.
    </p>

    <!-- Personalización por canal: si trabaja con apps de terceros, mensaje especial -->
    <div
      v-if="usesThirdPartyApps"
      class="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-4 mb-4 flex items-start gap-3"
    >
      <div class="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
        <Zap class="w-5 h-5 text-white" />
      </div>
      <div class="min-w-0">
        <p class="text-sm font-bold text-slate-900 leading-tight mb-1">
          Te ayudamos a migrar de apps de terceros.
        </p>
        <p class="text-xs text-slate-600 leading-snug">
          Nuestro Customer Success te guía para recuperar el margen del 30% que
          hoy le pagás a Rappi, PedidosYa o Uber Eats. La migración promedio
          de las marcas en Deenex demora 14 días.
        </p>
      </div>
    </div>

    <!-- 1️⃣ Calculadora ROI editable. Le pedimos los números reales -->
    <RoiCalculator />

    <!-- 2️⃣ Savings hero proyectado con sus números ──────────── -->
    <div
      v-if="onboarding.savingsVsThirdParty.value > 0"
      class="relative bg-emerald-500 text-white rounded-3xl p-6 mb-4 overflow-hidden"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-700/40 pointer-events-none"></div>
      <div class="relative flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
          <TrendingDown class="w-6 h-6 text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
            Tu ahorro proyectado
            <span v-if="onboarding.hasCustomRoiInputs.value" class="text-emerald-100 ml-1">· con tus números</span>
          </p>
          <p class="text-3xl sm:text-4xl font-black tabular-nums tracking-tighter leading-none">
            USD <AnimatedNumber :value="onboarding.savingsVsThirdParty.value" :duration="1100" />
            <span class="text-base font-bold text-white/80">/ mes</span>
          </p>
          <p class="text-sm text-white/90 mt-2 leading-snug">
            vs lo que te cobrarían PedidosYa, Rappi o Uber Eats por el mismo volumen
            ({{ totalOrdersLabel }} pedidos · ticket USD {{ onboarding.effectiveTicket.value }} · 30% de comisión).
          </p>

          <!-- Break-even visual -->
          <div v-if="onboarding.breakEvenDays.value !== null" class="mt-4 pt-4 border-t border-white/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-widest text-white/70">Break-even del fee</span>
              <span class="text-xs font-bold text-white">
                Día {{ onboarding.breakEvenDays.value }} del mes
              </span>
            </div>
            <div class="h-2 bg-white/20 rounded-full overflow-hidden relative">
              <div
                class="h-full bg-white rounded-full"
                :style="{ width: ((onboarding.breakEvenDays.value / 30) * 100) + '%' }"
              ></div>
              <div class="absolute inset-y-0 right-0 w-px bg-white/50"></div>
            </div>
            <p class="text-[11px] text-white/80 leading-snug mt-2">
              Tu ahorro vs apps cubre el costo de Deenex en
              <span class="tabular-nums">{{ onboarding.breakEvenDays.value }}</span>
              {{ onboarding.breakEvenDays.value === 1 ? 'día' : 'días' }}.
              {{ 30 - onboarding.breakEvenDays.value === 1 ? 'El día' : 'Los días' }}
              <span class="tabular-nums">{{ 30 - onboarding.breakEvenDays.value }}</span>
              restantes del mes son ganancia neta.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Sin Deenex vs Con Deenex ────────────────────────────
         Solo lo mostramos si el ahorro es positivo. Si Deenex sale más caro
         que las apps (caso borde: marca chica con volumen bajo), enseñar la
         comparison rompe la narrativa, mostramos un mensaje alternativo
         enfocado en VALOR (clientes propios) en lugar de costo. -->
    <div v-if="onboarding.savingsVsThirdParty.value > 0" class="grid grid-cols-2 gap-3 mb-8">
      <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/40">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          Sin Deenex
        </p>
        <p class="text-2xl font-black text-slate-400 line-through tabular-nums tracking-tighter mb-1">
          USD <AnimatedNumber :value="thirdPartyMonthly" :duration="1400" />
        </p>
        <p class="text-[11px] text-slate-400 leading-snug">
          Comisión típica de apps de terceros (30% sobre delivery).
        </p>
      </div>
      <div class="rounded-2xl border-2 border-primary bg-primary/[0.04] p-4">
        <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-2">
          Con Deenex
        </p>
        <p class="text-2xl font-black text-primary tabular-nums tracking-tighter mb-1">
          USD <AnimatedNumber :value="deenexMonthly" :duration="1400" />
        </p>
        <p class="text-[11px] text-slate-600 leading-snug">
          Bundle + {{ onboarding.recommendedPlan.value.commissionPct }}% solo en delivery + Marketing AI performance.
        </p>
      </div>
    </div>

    <!-- Fallback honesto: cuando el volumen declarado es tan bajo que Deenex
         sale más caro que apps (marca arrancando, 1 local, pocos pedidos),
         pivoteamos el pitch del "ahorro $" al "ahorro estratégico": tu data,
         tu marca, recurrencia. El lead todavía gana algo aunque el ROI puro
         no esté del lado de la calculadora. -->
    <div
      v-else
      class="rounded-2xl border-2 border-slate-200 bg-slate-50/40 p-5 mb-8 flex items-start gap-4"
    >
      <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Sparkles class="w-5 h-5 text-primary" />
      </div>
      <div class="min-w-0">
        <p class="text-sm font-bold text-slate-900 leading-tight mb-1.5">
          Con tu volumen actual, Deenex no compite contra apps por costo.
        </p>
        <p class="text-xs text-slate-600 leading-relaxed mb-2">
          Te conviene por otro lado: cuando tus clientes piden a tu marca (no a Rappi),
          quedan en tu base. Recompran, los podés activar con campañas y el
          ticket promedio sube en 2-3 meses. El ahorro de comisiones aparece
          después, cuando crezca el volumen.
        </p>
        <p class="text-[11px] text-slate-400 italic leading-snug">
          Probalo 14 días sin cargo y vé el comportamiento real.
        </p>
      </div>
    </div>

    <StepActions
      next-label="Ver mi plan recomendado"
      :disabled="false"
      @back="$router.push('/comenzar/negocio')"
    />

    <p class="mt-6 text-[11px] text-slate-400 leading-relaxed">
      Sin cargo durante 14 días. Cancelás en 1 click. Si no convence, te exportamos los datos y bajamos la cuenta sin preguntas.
    </p>
  </form>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { TrendingDown, Zap, Sparkles } from 'lucide-vue-next'
import AnimatedNumber from '@/components/onboarding/AnimatedNumber.vue'
import RoiCalculator from '@/components/onboarding/RoiCalculator.vue'
import StepActions from '@/components/onboarding/StepActions.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()

// Reutilizamos los computeds del composable, que ya respetan los inputs
// editados por el lead en la calculadora (single source of truth).
const totalOrdersLabel = computed(() => {
  const locations = Math.max(1, Number(onboarding.state.business.locations) || 1)
  return (locations * onboarding.effectiveOrders.value).toLocaleString('es-AR')
})

const thirdPartyMonthly = computed(() => onboarding.thirdPartyMonthlyFee.value)
const deenexMonthly = computed(() => onboarding.deenexMonthlyCost.value)

const usesThirdPartyApps = computed(() => {
  const channels = onboarding.state.business.channels || []
  return channels.includes('delivery_third')
})

function onContinue() {
  onboarding.track('savings_viewed', {
    estimated_savings: onboarding.savingsVsThirdParty.value,
    has_custom_inputs: onboarding.hasCustomRoiInputs.value,
  })
  // Marcamos savings como completado para que el resume modal y el magic link
  // ofrezcan volver desde el paso correcto (plan, no business).
  onboarding.markStepComplete('savings')
  router.push('/comenzar/plan')
}
</script>
