<template>
  <form @submit.prevent="onSubmit" novalidate>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 3 de 6
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      <template v-if="onboarding.greeting.value">{{ onboarding.greeting.value }}, este es<br /></template>
      <template v-else>Tu plan recomendado.<br /></template>
      <span class="text-primary italic font-light">tu plan recomendado.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-6 max-w-md">
      Calculado en base a tus
      <span class="font-bold text-slate-900">{{ onboarding.state.business.locations }} {{ onboarding.state.business.locations === 1 ? 'local' : 'locales' }}</span>.
      Activás gratis hoy y pagás solo si te convence al día 16.
    </p>

    <!-- Personalización por canal: si trabaja con apps de terceros, mensaje especial -->
    <div
      v-if="usesThirdPartyApps && !isEnterprise"
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
          Nuestro Customer Success te guía para recuperar el margen del 25% que
          hoy le pagás a Rappi, PedidosYa o Uber Eats. La migración promedio
          de las marcas en Deenex demora 14 días.
        </p>
      </div>
    </div>

    <!-- HERO: ahorro destacado (lead magnet #1) ──────────────────────── -->
    <div
      v-if="onboarding.savingsVsThirdParty.value > 0 && !isEnterprise"
      class="relative bg-emerald-500 text-white rounded-3xl p-6 mb-4 overflow-hidden"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-700/40 pointer-events-none"></div>
      <div class="relative flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
          <TrendingDown class="w-6 h-6 text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">
            Tu ahorro estimado
          </p>
          <p class="text-3xl sm:text-4xl font-black tabular-nums tracking-tighter leading-none">
            USD <AnimatedNumber :value="onboarding.savingsVsThirdParty.value" :duration="1400" />
            <span class="text-base font-bold text-white/80">/ mes</span>
          </p>
          <p class="text-sm text-white/90 mt-2 leading-snug">
            vs lo que te cobrarían PedidosYa, Rappi o Uber Eats por el mismo volumen
            ({{ assumedOrdersPerMonth.toLocaleString('es-AR') }} pedidos · 25% de comisión).
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
              Tu ahorro vs apps cubre el costo de Deenex en {{ onboarding.breakEvenDays.value }} días.
              Los {{ 30 - onboarding.breakEvenDays.value }} restantes del mes son ganancia neta.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Sin Deenex vs Con Deenex ──────────────────────────── -->
    <div
      v-if="!isEnterprise"
      class="grid grid-cols-2 gap-3 mb-8"
    >
      <div class="rounded-2xl border border-slate-200 p-4 bg-slate-50/40">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
          Sin Deenex
        </p>
        <p class="text-2xl font-black text-slate-400 line-through tabular-nums tracking-tighter mb-1">
          USD <AnimatedNumber :value="thirdPartyMonthly" :duration="1400" />
        </p>
        <p class="text-[11px] text-slate-400 leading-snug">
          Comisión típica de apps de terceros (25% sobre GMV).
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
          Fee fijo + {{ recommendedPlan.commissionPct }}% por venta procesada.
        </p>
      </div>
    </div>

    <!-- Plan recomendado: card grande con hero claro ─────────────────── -->
    <div
      v-if="!isEnterprise"
      class="relative bg-primary text-white rounded-3xl p-7 mb-5 overflow-hidden"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
      <div class="relative">
        <div class="flex items-start justify-between gap-4 mb-5">
          <div>
            <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">
              Plan recomendado
            </p>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tighter">
              {{ recommendedPlan.name }}
            </h2>
          </div>
          <span class="bg-emerald-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap">
            15 días gratis
          </span>
        </div>

        <div class="flex items-baseline gap-2 mb-3">
          <span class="text-5xl font-black tabular-nums tracking-tighter">USD {{ recommendedPlan.monthlyFee }}</span>
          <span class="text-sm text-white/70">/ mes</span>
        </div>
        <p class="text-white/80 text-sm leading-relaxed mb-1">
          + <span class="font-bold">{{ recommendedPlan.commissionPct }}%</span>
          por venta procesada.
        </p>
        <p class="text-white/60 text-xs leading-relaxed">
          Primer cargo el <span class="font-bold text-white">{{ onboarding.firstChargeDateShort.value }}</span>.
          Antes no te cobramos nada.
        </p>

        <!-- Toggle add-on Loyalty -->
        <label
          class="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-white/10 cursor-pointer hover:bg-white/[0.15] transition-colors"
        >
          <input type="checkbox" v-model="form.addLoyalty" class="sr-only" />
          <div
            class="w-10 h-6 rounded-full p-0.5 shrink-0 transition-colors mt-0.5"
            :class="form.addLoyalty ? 'bg-emerald-400' : 'bg-white/20'"
          >
            <div
              class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
              :class="form.addLoyalty ? 'translate-x-4' : 'translate-x-0'"
            ></div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold leading-tight">Sumar Fidelización Dinámica</p>
            <p class="text-xs text-white/70 mt-1 leading-snug">
              Puntos, niveles VIP, cupones. +USD 15 / local — incluido en el trial.
            </p>
          </div>
        </label>
      </div>
    </div>

    <!-- Caso Enterprise: precio a medida -->
    <div
      v-else
      class="relative bg-slate-900 text-white rounded-3xl p-7 mb-6 overflow-hidden"
    >
      <div class="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none"></div>
      <div class="relative">
        <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">
          Volumen Enterprise
        </p>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tighter mb-3">
          Precio a medida
        </h2>
        <p class="text-white/70 text-sm leading-relaxed mb-4">
          Más de 200 locales requieren un acuerdo comercial dedicado.
          Te asignamos un CSM que arma tu plan en menos de 24h.
        </p>
        <p class="text-xs text-white/50">
          Comisión desde 0,5% · onboarding white-glove · API privada.
        </p>
      </div>
    </div>

    <!-- Testimonial inline: refuerza el savings con voz real ──────────-->
    <figure
      v-if="!isEnterprise"
      class="relative rounded-2xl border border-slate-200 bg-white p-5 mb-8 overflow-hidden"
    >
      <div class="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary"></div>
      <blockquote class="text-sm text-slate-600 leading-relaxed italic pl-3">
        "Recuperamos clientes que compraban por apps de terceros y los volvimos a
        fidelizar en nuestro propio ámbito. En 60 días el ROI ya era positivo."
      </blockquote>
      <figcaption class="mt-3 pl-3 flex items-center justify-between gap-2">
        <span class="text-[11px] font-bold text-slate-500 tracking-wide uppercase">
          — Marcos Aldazábal, Socio y Fundador
        </span>
        <span class="text-[10px] font-black text-primary/60 tracking-wider uppercase">
          Palta
        </span>
      </figcaption>
    </figure>

    <!-- Comparison de TODOS los planes (visible, no escondido) ─────────-->
    <div v-if="!isEnterprise" class="mb-8">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
        ¿Querés otro plan? Compará al toque
      </p>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          v-for="tier in selectablePlans"
          :key="tier.key"
          type="button"
          @click="form.planKey = tier.key"
          class="text-left rounded-2xl border-2 p-4 transition-all relative"
          :class="effectivePlanKey === tier.key
            ? 'border-primary bg-primary/[0.04]'
            : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <p class="text-sm font-bold text-slate-900 mb-0.5">{{ tier.name }}</p>
          <p class="text-[10px] text-slate-400 font-medium mb-3 leading-snug">
            {{ planVolumeLabel(tier) }}
          </p>
          <p class="text-base font-black text-slate-900 tabular-nums leading-none">
            <template v-if="tier.monthlyFee !== null">USD {{ tier.monthlyFee }}</template>
            <template v-else>A medida</template>
          </p>
          <p v-if="tier.monthlyFee !== null" class="text-[10px] text-slate-500 mt-1">
            / mes + {{ tier.commissionPct }}%
          </p>
          <span
            v-if="tier.key === recommendedPlan.key"
            class="absolute -top-2 left-3 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
          >
            Recomendado
          </span>
        </button>
      </div>
    </div>

    <StepActions
      :next-label="isEnterprise ? 'Hablar con ventas' : 'Activar trial gratis'"
      :disabled="false"
      @back="$router.push('/comenzar/negocio')"
    />

    <p class="mt-6 text-[11px] text-slate-400 leading-relaxed">
      Sin cargo durante 15 días. Cancelás en 1 click. Si no convence, te exportamos los datos y bajamos la cuenta sin preguntas.
    </p>
  </form>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { TrendingDown, Zap } from 'lucide-vue-next'
import AnimatedNumber from '@/components/onboarding/AnimatedNumber.vue'
import StepActions from '@/components/onboarding/StepActions.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()

const form = reactive({
  planKey: onboarding.state.plan.key || '',
  addLoyalty: onboarding.state.plan.addLoyalty,
})

const recommendedPlan = computed(() => onboarding.recommendedPlan.value)

const effectivePlanKey = computed(() => form.planKey || recommendedPlan.value.key)

const isEnterprise = computed(() => effectivePlanKey.value === 'enterprise')

const selectablePlans = computed(() => onboarding.PLAN_TIERS)

const formattedSavings = computed(() => onboarding.savingsVsThirdParty.value.toLocaleString('es-AR'))

// ── Comparison math: necesario para mostrar Sin Deenex vs Con Deenex ──
const assumedOrdersPerMonth = computed(() => {
  const locations = Math.max(1, Number(onboarding.state.business.locations) || 1)
  const perLocation = locations <= 5 ? 300 : locations <= 25 ? 800 : locations <= 70 ? 1500 : 3000
  return locations * perLocation
})

const monthlyGmv = computed(() => assumedOrdersPerMonth.value * 15) // ticket promedio USD 15

const thirdPartyMonthly = computed(() => Math.round(monthlyGmv.value * 0.25))

const deenexMonthly = computed(() => {
  const tier = recommendedPlan.value
  const fee = tier.monthlyFee || 0
  const commission = monthlyGmv.value * (tier.commissionPct / 100)
  return Math.round(fee + commission)
})

// Si el lead seleccionó apps de terceros como canal actual, ofrecemos un
// mensaje de migración asistida que aumenta la conversión en ese segmento.
const usesThirdPartyApps = computed(() => {
  const channels = onboarding.state.business.channels || []
  return channels.includes('delivery_third') || channels.includes('glovo')
})

function planVolumeLabel(tier) {
  if (tier.key === 'enterprise') return '200+ locales'
  if (tier.minLocations === tier.maxLocations) return `${tier.minLocations} local`
  return `${tier.minLocations}–${tier.maxLocations} locales`
}

function onSubmit() {
  onboarding.setPlan({
    key: effectivePlanKey.value,
    product: 'comercio',
    addLoyalty: form.addLoyalty,
  })
  if (isEnterprise.value) {
    router.push('/comenzar/listo?enterprise=1')
  } else {
    router.push('/comenzar/preview')
  }
}
</script>
