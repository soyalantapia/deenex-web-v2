<template>
  <form @submit.prevent="onSubmit" novalidate>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 4 de 5
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      <template v-if="onboarding.greeting.value">
        {{ onboarding.greeting.value }}, arrancás<br />
        <span class="text-primary italic font-light">en USD 29 / mes.</span>
      </template>
      <template v-else>
        Arrancás en<br />
        <span class="text-primary italic font-light">USD 29 / mes.</span>
      </template>
    </h1>
    <!-- Mensaje clave: TODOS arrancan acá independiente del tamaño actual.
         No hay decisión de "qué plan", es un único bundle de entrada que
         crece automáticamente cuando el VOLUMEN REAL lo justifica. -->
    <p class="text-base text-slate-500 leading-relaxed mb-6 max-w-md">
      Todas las marcas arrancan con el mismo plan de entrada, pagás solo
      <span class="font-bold text-slate-900">USD 29 hasta 300 pedidos/mes</span>
      + <span class="font-bold text-slate-900">3% solo en delivery</span>.
      Cuando tu volumen real supere ese límite, escalás automáticamente al
      siguiente tier. Sin renegociar nada.
    </p>

    <!-- Toggle mensual/anual, anual 20% off. Cobranza estándar SaaS para
         mejorar cash flow + reducir churn. -->
    <div v-if="!isEnterprise" class="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div class="inline-flex items-center bg-slate-100 rounded-full p-1 relative">
        <button
          type="button"
          @click="form.billingCycle = 'monthly'"
          class="relative px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors z-10"
          :class="form.billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'"
        >
          Mensual
        </button>
        <button
          type="button"
          @click="form.billingCycle = 'annual'"
          class="relative px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors z-10 flex items-center gap-1.5"
          :class="form.billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'"
        >
          Anual
          <span class="text-[9px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">−20%</span>
        </button>
        <!-- Indicador animado del toggle activo -->
        <span
          class="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all"
          :style="form.billingCycle === 'monthly'
            ? { left: '4px', width: 'calc(50% - 8px)' }
            : { left: 'calc(50% + 4px)', width: 'calc(50% - 8px)' }"
        ></span>
      </div>
      <p v-if="form.billingCycle === 'annual'" class="text-xs text-emerald-700 font-semibold leading-snug">
        💰 Ahorrás <span class="tabular-nums">USD {{ onboarding.annualSavingsUsd.value.toLocaleString('es-AR') }}</span> al año vs mensual.
      </p>
      <p v-else class="text-xs text-slate-400 leading-snug">
        Cambiá a anual y ahorrás <span class="tabular-nums font-bold text-emerald-600">20%</span> sobre el fee.
      </p>
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
            <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Sparkles class="w-3 h-3" />
              Tu punto de partida
            </p>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tighter">
              {{ recommendedPlan.name }}
            </h2>
          </div>
          <span class="bg-emerald-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap">
            14 días gratis
          </span>
        </div>

        <div class="flex items-baseline gap-2 mb-3 flex-wrap">
          <span class="text-5xl font-black tabular-nums tracking-tighter">USD {{ effectiveFee(recommendedPlan) }}</span>
          <span class="text-sm text-white/70">/ mes</span>
          <span v-if="form.billingCycle === 'annual'" class="text-sm text-white/50 line-through tabular-nums">
            USD {{ recommendedPlan.monthlyFee }}
          </span>
          <span v-if="form.billingCycle === 'annual'" class="text-[10px] font-black bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
            −20%
          </span>
        </div>

        <!-- "Incluye hasta X pedidos/mes", el corazón del mensaje:
             todos arrancan acá, el escalado lo dispara el VOLUMEN REAL. -->
        <div class="rounded-xl bg-white/10 border border-white/15 p-3 mb-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-400 flex items-center justify-center shrink-0 text-emerald-950">
            <Check class="w-5 h-5" stroke-width="3" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-white/60 uppercase tracking-widest font-black mb-0.5">
              Incluye hasta
            </p>
            <p class="text-lg font-extrabold tabular-nums text-white leading-tight">
              {{ recommendedPlan.maxOrders.toLocaleString('es-AR') }} pedidos/mes
            </p>
          </div>
        </div>

        <p v-if="form.billingCycle === 'annual'" class="text-[11px] text-white/70 leading-snug mb-2">
          Cobrado anualmente: USD {{ (effectiveFee(recommendedPlan) * 12).toLocaleString('es-AR') }} / año.
        </p>
        <p class="text-white/80 text-sm leading-relaxed mb-1 flex items-center gap-1.5 flex-wrap">
          + <span class="font-bold tabular-nums">{{ recommendedPlan.commissionPct }}%</span>
          comisión <span class="text-white/60">solo en delivery</span>.
          <Tooltip variant="light" placement="top" align="left" label="Sobre qué se aplica la comisión">
            <strong class="block mb-1">¿Sobre qué se aplica?</strong>
            Solo sobre el GMV de delivery (los pedidos que despacha tu canal Deenex). NO aplica a mesa, takeaway ni a las ventas que entran por Rappi/PedidosYa. Tampoco sobre propinas ni impuestos.
          </Tooltip>
        </p>
        <p v-if="recommendedPlan.marketingAiPct" class="text-white/85 text-xs leading-relaxed mb-1 flex items-start gap-1.5 flex-wrap">
          <Sparkles class="w-3 h-3 mt-0.5 shrink-0 text-emerald-300" />
          <span>
            Marketing AI <span class="font-bold">incluido</span>: cobramos <span class="font-bold tabular-nums">{{ recommendedPlan.marketingAiPct }}%</span>
            <span class="text-white/65">solo sobre las recompras extras que generamos</span>
          </span>
        </p>
        <p class="text-white/60 text-xs leading-relaxed mt-1">
          Primer cargo el <span class="font-bold text-white">{{ onboarding.firstChargeDateShort.value }}</span>.
          Antes no te cobramos nada.
        </p>

        <!-- Toggle de Fidelización Dinámica removido, ya viene incluida en
             el Bundle de entrada (USD 29), no es add-on opcional. -->
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
         , Marcos Aldazábal, Socio y Fundador
        </span>
        <span class="text-[10px] font-black text-primary/60 tracking-wider uppercase">
          Palta
        </span>
      </figcaption>
    </figure>

    <!-- Escalera de crecimiento, INFORMATIVA, no seleccionable.
         "Estás acá" siempre marca Inicio (USD 69). Si declaró volumen alto,
         "Próxima parada" señala el projectedTier como roadmap. Layout más
         respirado que la versión anterior (grid colapsado): cards stacked
         con padding generoso. -->
    <div v-if="!isEnterprise" class="mb-8">
      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
        Cuando crezcas, tu plan crece con vos
      </p>
      <div class="space-y-2.5">
        <div
          v-for="tier in selectablePlans"
          :key="tier.key"
          class="rounded-2xl border-2 px-5 py-4 transition-colors"
          :class="[
            tier.key === recommendedPlan.key
              ? 'border-primary bg-primary/[0.04]'
              : tier.key === projectedTier.key && projectedTier.key !== recommendedPlan.key
                ? 'border-emerald-200 bg-emerald-50/40'
                : 'border-slate-200 bg-white',
          ]"
        >
          <!-- Línea 1: nombre del tier + badges -->
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :class="tier.key === recommendedPlan.key
                ? 'bg-primary'
                : tier.key === projectedTier.key
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'"
              aria-hidden="true"
            ></span>
            <span class="text-base font-bold text-slate-900">{{ tier.name }}</span>
            <span
              v-if="tier.key === recommendedPlan.key"
              class="text-[10px] font-black text-white bg-primary px-2.5 py-0.5 rounded-full uppercase tracking-widest"
            >
              Estás acá
            </span>
            <span
              v-else-if="tier.key === projectedTier.key"
              class="text-[10px] font-black text-white bg-emerald-500 px-2.5 py-0.5 rounded-full uppercase tracking-widest"
            >
              Siguiente paso
            </span>
          </div>

          <!-- Línea 2: stats con mucho aire -->
          <div class="flex items-baseline gap-x-6 gap-y-2 flex-wrap pl-4">
            <!-- Pedidos -->
            <div class="min-w-0">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Pedidos/mes
              </p>
              <p class="text-sm font-bold text-slate-700 tabular-nums">
                {{ planVolumeLabel(tier) }}
              </p>
            </div>
            <!-- Fee -->
            <div class="min-w-0">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Fee mensual
              </p>
              <p class="text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                <template v-if="tier.monthlyFee !== null">USD {{ effectiveFee(tier) }}</template>
                <template v-else>A medida</template>
              </p>
            </div>
            <!-- Comisión -->
            <div class="min-w-0">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Comisión delivery
              </p>
              <p class="text-sm font-bold tabular-nums" :class="tier.key === recommendedPlan.key ? 'text-primary' : 'text-slate-700'">
                {{ formatPct(tier.commissionPct) }} en delivery
              </p>
            </div>
            <!-- Marketing AI: INCLUIDO performance, cobra solo sobre recompras
                 EXTRAS que el sistema genera (sin uplift = sin fee). -->
            <div v-if="tier.marketingAiPct" class="min-w-0">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Marketing AI
              </p>
              <p class="text-sm font-bold text-slate-700 tabular-nums whitespace-nowrap">
                {{ tier.marketingAiPct }}% performance
              </p>
            </div>
            <!-- POS por local (opcional) -->
            <div v-if="tier.posPerLocation" class="min-w-0">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                POS / local
              </p>
              <p class="text-sm font-bold text-slate-700 tabular-nums whitespace-nowrap">
                USD {{ tier.posPerLocation }}/mes
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con narrativa según volumen declarado -->
      <p
        v-if="projectedTier.key !== recommendedPlan.key"
        class="text-[12px] text-slate-600 leading-relaxed mt-3 flex items-start gap-1.5 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Declaraste <strong>{{ totalMonthlyOrders.toLocaleString('es-AR') }} pedidos/mes</strong>.
          Cuando tu volumen real lo confirme, escalamos automáticamente al tier
          <strong class="text-emerald-700">{{ projectedTier.name }}</strong>.
          Mientras tanto pagás solo USD {{ effectiveFee(recommendedPlan) }} de entrada.
        </span>
      </p>
      <p v-else class="text-[11px] text-slate-500 leading-relaxed mt-3 flex items-start gap-1.5">
        <Check class="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" stroke-width="3" />
        <span>
          Pasás al siguiente tier <strong class="text-slate-700">automáticamente</strong> cuando superás el volumen del actual. Sin renegociar nada, el sistema lo hace al cierre del mes y tu data te sigue.
        </span>
      </p>
    </div>

    <StepActions
      :next-label="isEnterprise ? 'Hablar con ventas' : 'Activar trial gratis'"
      :disabled="false"
      @back="$router.push('/comenzar/ahorro')"
    />
  </form>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Sparkles } from 'lucide-vue-next'
import StepActions from '@/components/onboarding/StepActions.vue'
import Tooltip from '@/components/onboarding/Tooltip.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()

// Form local sync con state global. `planKey` ya no se setea acá, el plan
// se asigna automáticamente desde recommendedPlan. `addLoyalty` se removió
// porque ahora Fidelización Dinámica viene incluida en el Bundle de entrada,
// no es add-on opcional. Solo queda billingCycle.
const form = reactive({
  billingCycle: onboarding.state.plan.billingCycle || 'monthly',
})

// Sync billing cycle al state cuando cambia.
watch(() => form.billingCycle, (v) => {
  onboarding.state.plan.billingCycle = v
  onboarding.track('plan_billing_cycle_changed', { cycle: v })
})

// Precio efectivo: aplica descuento anual si corresponde.
function effectiveFee(tier) {
  if (tier.monthlyFee === null) return null
  return form.billingCycle === 'annual'
    ? Math.round(tier.monthlyFee * 0.8)
    : tier.monthlyFee
}

const recommendedPlan = computed(() => onboarding.recommendedPlan.value)
// projectedTier = tier teórico según volumen declarado. Usado en la escalera
// para mostrar "Acá vas a llegar" cuando el lead declaró un volumen mayor
// al cap del tier Inicio. Si declaró ≤300 pedidos, projectedTier === Inicio
// y no mostramos roadmap (solo el copy default).
const projectedTier = computed(() => onboarding.projectedTier.value)

// Total estimado de pedidos/mes = locales × pedidos por local. Usado para
// mostrar en el subtítulo y para que el lead entienda por qué le tocó X plan.
const totalMonthlyOrders = computed(() => {
  const locations = Math.max(1, Number(onboarding.state.business.locations) || 1)
  return locations * onboarding.effectiveOrders.value
})

// Antes el lead podía elegir cualquier tier manualmente. Ahora el modelo
// es Bundle único escalonado: el tier se calcula automáticamente desde el
// volumen de pedidos del lead. No hay selección, `effectivePlanKey` siempre
// apunta al recomendado.
const effectivePlanKey = computed(() => recommendedPlan.value.key)

const isEnterprise = computed(() => effectivePlanKey.value === 'enterprise')

const selectablePlans = computed(() => onboarding.PLAN_TIERS)

// Label de volumen ahora muestra el rango de PEDIDOS (la métrica de pricing
// real) en lugar de "X-Y locales". Resuelve la pregunta clave del lead:
// "¿en cuál caigo yo?", porque los locales son ambiguos, los pedidos no.
function planVolumeLabel(tier) {
  if (tier.key === 'enterprise') return '25.000+ pedidos/mes'
  if (tier.minOrders === 0) return `Hasta ${tier.maxOrders.toLocaleString('es-AR')} pedidos/mes`
  return `${tier.minOrders.toLocaleString('es-AR')}–${tier.maxOrders.toLocaleString('es-AR')} pedidos/mes`
}

// Formatea % con coma decimal estilo es-AR. Ej: 2.75 → "2,75%"; 3 → "3%".
function formatPct(n) {
  if (n == null) return '0%'
  const rounded = Math.round(n * 100) / 100
  return rounded.toLocaleString('es-AR', { maximumFractionDigits: 2 }) + '%'
}

function onSubmit() {
  onboarding.setPlan({
    key: effectivePlanKey.value,
    product: 'comercio',
    // Loyalty viene incluida en el Bundle de entrada, no es add-on opcional.
    addLoyalty: true,
    billingCycle: form.billingCycle,
  })
  if (isEnterprise.value) {
    router.push('/comenzar/listo?enterprise=1')
  } else {
    router.push('/comenzar/activar')
  }
}
</script>
