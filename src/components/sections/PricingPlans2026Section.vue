<template>
  <!--
    Pricing Plans 2026, sección de la landing que muestra los mismos planes
    que el onboarding usa para recomendar (Starter / Growth / Scale / Pro /
    Enterprise) como single source of truth desde useOnboarding.PLAN_TIERS.

    Esto reemplaza visualmente al PricingSection viejo (por-local USD 25)
    con el modelo nuevo basado en volumen de locales + commission por venta.
  -->
  <section id="precios" class="py-24 px-6 bg-white relative">
    <div class="max-w-6xl mx-auto">
      <!-- Header con toggle anual/mensual ──────────────────────────── -->
      <div class="text-center mb-12">
        <p class="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-3">
          Pricing 2026
        </p>
        <h2 class="text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
          Un plan por cada<br />
          <span class="text-primary italic font-light">tamaño de operación.</span>
        </h2>
        <p class="text-base text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
          Fee fijo según volumen de locales + comisión por venta procesada.
          Sin costos ocultos, sin permanencia, cancelás cuando quieras.
        </p>

        <!-- Toggle mensual/anual con descuento 20% en anual -->
        <div class="inline-flex items-center bg-slate-100 rounded-full p-1 relative">
          <button
            type="button"
            @click="cycle = 'monthly'"
            class="relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors z-10"
            :class="cycle === 'monthly' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'"
          >
            Mensual
          </button>
          <button
            type="button"
            @click="cycle = 'annual'"
            class="relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors z-10 flex items-center gap-1.5"
            :class="cycle === 'annual' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'"
          >
            Anual
            <span class="text-[9px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">−20%</span>
          </button>
          <span
            class="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all"
            :style="cycle === 'monthly'
              ? { left: '4px', width: 'calc(50% - 8px)' }
              : { left: 'calc(50% + 4px)', width: 'calc(50% - 8px)' }"
          ></span>
        </div>
      </div>

      <!-- Grid de planes, 4 columnas en desktop, 1 en mobile con snap horizontal -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div
          v-for="(tier, i) in mainTiers"
          :key="tier.key"
          class="relative rounded-3xl border-2 p-6 flex flex-col transition-all"
          :class="tier.key === 'growth'
            ? 'border-primary bg-primary/[0.03] shadow-xl shadow-primary/10 lg:scale-[1.02]'
            : 'border-slate-200 bg-white hover:border-slate-300'"
        >
          <!-- Badge "más popular" en el Growth -->
          <span
            v-if="tier.key === 'growth'"
            class="absolute -top-3 left-6 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
          >
            Más elegido
          </span>

          <!-- Nombre + volumen -->
          <h3 class="text-xl font-extrabold tracking-tight text-slate-900 mb-1">
            {{ tier.name }}
          </h3>
          <p class="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-5">
            {{ volumeLabel(tier) }}
          </p>

          <!-- Precio + ciclo -->
          <div class="mb-1 flex items-baseline gap-2 flex-wrap">
            <span class="text-4xl font-black tabular-nums tracking-tighter text-slate-900">
              USD {{ effectiveFee(tier) }}
            </span>
            <span class="text-sm text-slate-400">/ mes</span>
          </div>
          <p class="text-[11px] text-slate-500 mb-5">
            <template v-if="cycle === 'annual'">
              <span class="line-through tabular-nums">USD {{ tier.monthlyFee }}</span>
              mensual · cobrado anual
            </template>
            <template v-else>
              + <span class="font-bold text-primary">{{ tier.commissionPct }}%</span> por venta
            </template>
          </p>
          <p v-if="cycle === 'annual'" class="text-[11px] text-slate-500 mb-5">
            + <span class="font-bold text-primary">{{ tier.commissionPct }}%</span> por venta procesada
          </p>

          <!-- Features clave -->
          <ul class="space-y-2 mb-6 flex-1">
            <li
              v-for="feat in tier.keyFeatures"
              :key="feat"
              class="flex items-start gap-2 text-sm text-slate-600"
            >
              <Check class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" stroke-width="3" />
              <span>{{ feat }}</span>
            </li>
          </ul>

          <!-- CTA -->
          <RouterLink
            :to="{ path: '/comenzar', query: { from: 'pricing', plan: tier.key } }"
            @click="trackPlanCta(tier.key)"
            class="block text-center rounded-xl px-4 py-3 text-sm font-bold transition-all"
            :class="tier.key === 'growth'
              ? 'bg-primary text-white hover:bg-[#3c1fc9] shadow-md shadow-primary/20'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200'"
          >
            {{ tier.key === 'growth' ? 'Empezar 14 días gratis' : 'Empezar gratis' }}
          </RouterLink>
        </div>
      </div>

      <!-- Enterprise, card aparte, más ancha, energía premium -->
      <div class="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none"></div>
        <div class="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div>
            <p class="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-3">
              Enterprise · 200+ locales
            </p>
            <h3 class="text-3xl font-extrabold tracking-tighter mb-3">
              Operación a escala<br />
              <span class="text-primary italic font-light">con SLA y soporte L3.</span>
            </h3>
            <p class="text-sm text-white/70 leading-relaxed mb-5 max-w-md">
              Pricing y SLA a medida. Integraciones custom, SSO/SAML, on-prem si lo necesitás,
              y un equipo dedicado para tu cuenta.
            </p>
            <ul class="space-y-2 text-sm text-white/85">
              <li v-for="feat in enterpriseTier.keyFeatures" :key="feat" class="flex items-start gap-2">
                <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" stroke-width="3" />
                <span>{{ feat }}</span>
              </li>
              <li class="flex items-start gap-2">
                <Check class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" stroke-width="3" />
                <span>Comisión por venta desde <span class="font-bold">{{ enterpriseTier.commissionPct }}%</span></span>
              </li>
            </ul>
          </div>
          <div class="lg:text-right">
            <p class="text-xs text-white/50 font-bold uppercase tracking-widest mb-2">Pricing</p>
            <p class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">A medida</p>
            <a
              :href="calendarUrl"
              target="_blank"
              rel="noopener"
              @click="trackEnterpriseClick"
              class="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-5 py-3 text-sm font-bold transition-colors"
            >
              <CalendarDays class="w-4 h-4" />
              Hablar con ventas
            </a>
          </div>
        </div>
      </div>

      <!-- Disclaimer + trust line -->
      <p class="mt-8 text-center text-xs text-slate-400 leading-relaxed max-w-xl mx-auto">
        Sin permanencia · Cancelás en 1 click · Comisión solo sobre ventas procesadas
        por Deenex (no salón cash, no propinas, no impuestos).
        <button type="button" @click="showFaq = !showFaq" class="underline hover:text-slate-600 font-semibold">
          {{ showFaq ? 'Ocultar preguntas' : 'Ver preguntas frecuentes' }}
        </button>
      </p>

      <!-- FAQ inline simple -->
      <Transition name="faq">
        <div v-if="showFaq" class="mt-8 max-w-3xl mx-auto grid gap-3">
          <details
            v-for="(faq, i) in faqs"
            :key="i"
            class="rounded-2xl border border-slate-200 bg-slate-50/40 group"
          >
            <summary class="px-5 py-4 cursor-pointer font-bold text-sm text-slate-900 flex items-center justify-between">
              {{ faq.q }}
              <span class="text-slate-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p class="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{{ faq.a }}</p>
          </details>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Check, CalendarDays } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'
import { trackEvent } from '@/utils/analytics'

const onboarding = useOnboarding()
const cycle = ref('monthly')
const showFaq = ref(false)

const calendarUrl = import.meta.env.VITE_CALENDAR_URL || 'mailto:ventas@deenex.tech'

// Primeros 4 tiers (Starter/Growth/Scale/Pro) en el grid principal.
// Enterprise se renderiza aparte porque tiene un layout distinto.
const mainTiers = computed(() =>
  onboarding.PLAN_TIERS.filter((t) => t.key !== 'enterprise')
)
const enterpriseTier = computed(() =>
  onboarding.PLAN_TIERS.find((t) => t.key === 'enterprise')
)

// Volumen por PEDIDOS, no por locales (lo cobramos por orders/mes).
function volumeLabel(tier) {
  if (tier.minOrders === 0) return `Hasta ${tier.maxOrders.toLocaleString('es-AR')} pedidos/mes`
  return `${tier.minOrders.toLocaleString('es-AR')}–${tier.maxOrders.toLocaleString('es-AR')} pedidos/mes`
}

function effectiveFee(tier) {
  if (tier.monthlyFee === null) return 'A medida'
  return cycle.value === 'annual'
    ? Math.round(tier.monthlyFee * 0.8)
    : tier.monthlyFee
}

function trackPlanCta(planKey) {
  trackEvent('pricing_plan_cta_click', { plan: planKey, cycle: cycle.value })
}

function trackEnterpriseClick() {
  trackEvent('pricing_enterprise_cta_click')
}

const faqs = [
  {
    q: '¿Cómo se calcula la comisión por venta?',
    a: 'Es un porcentaje sobre el GMV (Gross Merchandise Value), el monto total de ventas que pasen por Deenex. No se aplica sobre propinas, impuestos, ni operaciones cash del salón que no toquen el sistema.',
  },
  {
    q: '¿Qué pasa si crezco y supero el rango de locales del plan?',
    a: 'Te movemos al plan siguiente al mes siguiente sin cargos extra. Tu comisión también baja automáticamente con el nuevo tier.',
  },
  {
    q: '¿Cobran setup fee o costos ocultos?',
    a: 'No. Setup es 100% guiado por nuestro CSM y no tiene cargo. El precio que ves es el final.',
  },
  {
    q: '¿Cuánto dura el trial gratis?',
    a: '14 días para todos los planes. Activás con MercadoPago pero el primer cargo es recién al día 15. Si cancelás antes, no te cobramos nada.',
  },
  {
    q: '¿Puedo cambiar de plan después?',
    a: 'Sí, en cualquier momento desde el dashboard. Los cambios aplican al próximo ciclo de facturación.',
  },
]
</script>

<style scoped>
.faq-enter-active,
.faq-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  max-height: 0;
}
.faq-enter-to,
.faq-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
