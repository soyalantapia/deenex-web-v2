<template>
  <div>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 5 de 6
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      <template v-if="onboarding.greeting.value">{{ onboarding.greeting.value }}, activá<br /></template>
      <template v-else>Activá </template>tu trial.<br />
      <span class="text-primary italic font-light">No cobramos nada hoy.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-6 max-w-md">
      Necesitamos tu método de pago para reservar tu cuenta. El primer cargo
      es <span class="font-bold text-slate-900">el {{ onboarding.firstChargeDateFormatted.value }}</span>,
      y si cancelás antes no te cobramos nunca.
    </p>

    <!-- Bonus aplicado: cuando el lead vino del exit intent y aceptó el bonus
         DEENEX30, el trial se extendió a 30 días. Hacemos VISIBLE ese beneficio
         para que entienda que la promesa se está cumpliendo. -->
    <div
      v-if="onboarding.hasBonus.value"
      class="flex items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4 mb-6"
    >
      <div class="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shrink-0 text-xl">
        🎁
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-slate-900 leading-tight">
          Bonus <code class="font-mono text-amber-700">{{ onboarding.bonusCode.value }}</code> aplicado
        </p>
        <p class="text-xs text-slate-600 mt-0.5 leading-snug">
          Tu trial es de <span class="font-bold text-amber-700">30 días</span> en vez de 15.
          Primer cargo recién el {{ onboarding.firstChargeDateShort.value }}.
        </p>
      </div>
    </div>

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

        <!-- Fidelización Dinámica removida como línea separada — ahora viene
             incluida en el Bundle de entrada (no es add-on opcional). -->

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
        <span class="text-xs text-slate-400">A partir del {{ onboarding.firstChargeDateShort.value }}</span>
        <span class="text-xs font-bold text-slate-500 tabular-nums">
          USD {{ totalMonthly }} / mes
        </span>
      </div>
    </div>

    <!-- Selector método: MP recurrente vs trial sin tarjeta -->
    <div class="mb-6">
      <span class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">
        Cómo activamos tu cuenta
      </span>

      <div class="space-y-2.5">
        <!-- Opción 1: MercadoPago -->
        <button
          type="button"
          @click="paymentChoice = 'mercadopago'"
          class="w-full text-left rounded-2xl border-2 p-5 transition-all"
          :class="paymentChoice === 'mercadopago'
            ? 'border-primary bg-primary/[0.04]'
            : 'border-slate-200 hover:border-slate-300'"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 80 80" class="w-7 h-7" aria-label="MercadoPago">
                <circle cx="40" cy="40" r="36" fill="#009EE3" />
                <path d="M22 44c4-8 12-12 18-12s14 4 18 12c-4 4-10 6-18 6s-14-2-18-6z" fill="#FFD600" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-bold text-slate-900">MercadoPago — Recomendado</p>
                <span class="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Sin interrupciones
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1 leading-snug">
                Tarjeta o dinero en cuenta. El día {{ onboarding.firstChargeDateShort.value }}
                te cobramos USD {{ totalMonthly }} automáticamente. Sin pasos extra.
              </p>
            </div>
            <div
              class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 border-2"
              :class="paymentChoice === 'mercadopago'
                ? 'bg-primary border-primary'
                : 'bg-white border-slate-300'"
            >
              <Check v-if="paymentChoice === 'mercadopago'" class="w-3 h-3 text-white" />
            </div>
          </div>
        </button>

        <!-- Opción "Activar sin tarjeta" removida: forzamos MercadoPago como
             único método para tener cobranza garantizada al día 16 sin
             fricción adicional. -->
      </div>
    </div>

    <!-- Trust badges inline — antes solo en sidebar desktop, ahora también
         visibles en mobile donde el sidebar no aparece. -->
    <div class="lg:hidden grid grid-cols-2 gap-2 mb-6">
      <div
        v-for="badge in mobileTrustBadges"
        :key="badge.title"
        class="rounded-xl border border-slate-200 bg-slate-50/40 p-3 flex items-start gap-2.5"
      >
        <component :is="badge.icon" class="w-4 h-4 shrink-0 mt-0.5" :class="badge.color" />
        <div class="min-w-0">
          <p class="text-[11px] font-bold text-slate-900 leading-tight">{{ badge.title }}</p>
          <p class="text-[10px] text-slate-500 leading-snug mt-0.5">{{ badge.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Garantías inline (ambos viewports) — corregido CUIT/RFC para no
         prometer algo que no preguntamos. Lo capturamos opcional en el
         primer billing cycle. -->
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
        Te pedimos los datos fiscales antes del primer cargo (no ahora).
      </li>
    </ul>

    <button
      @click="onActivate"
      :disabled="loading"
      class="group w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-bold rounded-xl px-6 py-4 text-base transition-all shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
    >
      <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      <template v-else>
        {{ activateButtonLabel }}
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
import { Check, Shield, Clock, FileText, ArrowRight, Lock } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()
const loading = ref(false)

// MercadoPago como único método. El "email_only" fue removido — necesitamos
// método de pago al activar para garantizar cobranza al día 16 sin fricción.
const paymentChoice = ref('mercadopago')

const activateButtonLabel = computed(() => 'Activar mi cuenta con MercadoPago')

// Trust badges mobile — la versión inline que llena el gap del sidebar
// desktop-only. Versión compacta para 390px.
const mobileTrustBadges = [
  { title: 'MercadoPago oficial', desc: 'Partner certificado.', icon: Shield, color: 'text-sky-500' },
  { title: 'Cifrado AES-256', desc: 'Tus datos protegidos.', icon: Lock, color: 'text-emerald-500' },
  { title: 'Garantía 30 días', desc: 'Devolución sin preguntas.', icon: FileText, color: 'text-amber-500' },
  { title: 'Cancelás en 1 click', desc: 'Sin permanencia.', icon: Clock, color: 'text-violet-500' },
]

// Si el lead eligió billing anual, aplicamos 20% off sobre TODOS los conceptos
// (fee mensual + loyalty add-on). Antes el loyalty no descontaba y generaba
// disputa de facturación.
const ANNUAL_DISCOUNT_MULT = 0.8
const isAnnual = computed(() => onboarding.state.plan.billingCycle === 'annual')

const planSummary = computed(() => {
  const key = onboarding.state.plan.key || onboarding.recommendedPlan.value.key
  const tier = onboarding.PLAN_TIERS.find((t) => t.key === key) || onboarding.recommendedPlan.value
  // Devolvemos una copia con el monthlyFee ya descontado si corresponde.
  // El template usa planSummary.monthlyFee directamente, así que mantener
  // el descuento acá es la single source of truth para la card.
  if (isAnnual.value && tier.monthlyFee !== null) {
    return { ...tier, monthlyFee: Math.round(tier.monthlyFee * ANNUAL_DISCOUNT_MULT) }
  }
  return tier
})

// Loyalty viene incluida en el Bundle de entrada — sin costo extra.
const totalMonthly = computed(() => planSummary.value.monthlyFee || 0)

async function onActivate() {
  loading.value = true
  onboarding.track('activation_initiated', {
    plan: onboarding.state.plan.key,
    total: totalMonthly.value,
    method: paymentChoice.value,
  })

  // Si el lead viene del experimento del Hero, registramos la conversión
  // (cuál variante del CTA lo trajo hasta acá). Es la métrica clave.
  try {
    const assignments = JSON.parse(localStorage.getItem('deenex_experiments_v1') || '{}')
    if (assignments.hero_cta_v1) {
      const { trackEvent } = await import('@/utils/analytics')
      trackEvent('experiment_conversion', {
        experiment_id: 'hero_cta_v1',
        variant_id: assignments.hero_cta_v1,
        method: paymentChoice.value,
        plan: onboarding.state.plan.key,
      })
    }
  } catch {
    // tracking failure should never block activation
  }

  /*
   * Integración backend según el método elegido:
   *
   *   paymentChoice === 'mercadopago':
   *     POST /api/onboarding/checkout-preference
   *     body: { planKey, addLoyalty, locations, identity, business }
   *     response: { preferenceId, initPoint }
   *     redirect: window.location.href = initPoint
   *
   *   paymentChoice === 'email_only':
   *     POST /api/onboarding/activate-trial
   *     body: { identity, business, plan, addLoyalty, deferredPayment: true }
   *     response: { tenantId, magicLink }
   *     Email con magic link al lead. Sin redirect.
   *
   * Hoy simulamos local. Cuando esté el backend, reemplazar el setTimeout.
   */
  await new Promise((r) => setTimeout(r, 1400))

  onboarding.markTrialActivated(paymentChoice.value, 'stub_pref_' + Date.now())
  router.push('/comenzar/listo')
}
</script>
