<template>
  <!--
    Pricing Model 2026 — Bundle único escalonado.

    Antes este componente mostraba 4 componentes separados (Presencial,
    Pedidos, Loyalty, Suite) + una opción "sin pago mensual / solo comisión".
    Esa opción NO existe en el modelo real (siempre es fee + comisión), y
    confundía al lead.

    Ahora: un solo Bundle "Deenex Full Suite" que arranca en USD 69 / 300
    pedidos/mes y escala automáticamente al pasar el volumen. Esto:
    - Elimina la decisión "qué componente elegir" → menos fricción.
    - Hace explícito que el precio CRECE CON VOS, no de golpe.
    - Mantiene la honestidad: siempre fee + commission, sin truco.
  -->
  <section :id="content.sectionId" class="py-24 px-6 bg-gradient-to-b from-white via-slate-50/40 to-white relative overflow-hidden">
    <!-- Glow decorativo de fondo -->
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[440px] bg-gradient-to-b from-primary/[0.05] to-transparent"></div>

    <div class="max-w-6xl mx-auto relative">
      <!-- Header ─────────────────────────────────────────────────────── -->
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles class="w-3 h-3" />
          {{ content.kicker }}
        </span>
        <h2 class="text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
          {{ content.title }}<br />
          <span class="text-primary italic font-light">{{ content.titleAccent }}</span>
        </h2>
        <p class="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          {{ content.subtitle }}
        </p>
      </div>

      <!-- Hero del Bundle inicial — punto de entrada ───────────────── -->
      <div class="relative rounded-3xl bg-slate-900 text-white p-7 sm:p-10 mb-8 overflow-hidden">
        <!-- Glow circular -->
        <div class="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>

        <div class="relative grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Rocket class="w-3 h-3" />
              {{ content.starterEyebrow }}
            </span>
            <h3 class="text-3xl sm:text-4xl font-extrabold tracking-tighter leading-tight mb-3">
              {{ content.starterTitle }}<br />
              <span class="text-primary italic font-light">{{ content.starterTitleAccent }}</span>
            </h3>
            <p class="text-sm sm:text-base text-white/70 leading-relaxed max-w-md mb-5">
              {{ content.starterDescription }}
            </p>
            <ul class="space-y-2 mb-1">
              <li v-for="f in content.starterIncludes" :key="f" class="flex items-start gap-2 text-sm text-white/85">
                <Check class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" stroke-width="3" />
                <span>{{ f }}</span>
              </li>
            </ul>
          </div>

          <!-- Tarjeta del precio inicial -->
          <div class="rounded-2xl bg-white text-slate-900 p-6 shadow-2xl shadow-slate-900/40">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Empezás con
            </p>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-5xl sm:text-6xl font-black tabular-nums tracking-tighter text-slate-900">
                USD {{ content.starterPrice }}
              </span>
              <span class="text-sm text-slate-500">/ mes</span>
            </div>
            <p class="text-sm font-bold text-primary mb-4 flex items-center gap-1">
              <span>+ {{ content.starterCommission }}% por venta procesada</span>
            </p>

            <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-3 mb-4">
              <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                Incluye hasta
              </p>
              <p class="text-lg font-extrabold text-emerald-700 tabular-nums">
                {{ content.starterOrders.toLocaleString('es-AR') }} pedidos/mes
              </p>
              <p class="text-[11px] text-emerald-600 leading-snug mt-0.5">
                Sumás pedidos sin cambiar de plan. Solo escalás al
                <span class="font-bold">superar el límite</span>.
              </p>
            </div>

            <RouterLink
              :to="{ path: '/comenzar', query: { from: 'cadenas_pricing' } }"
              class="block text-center bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-4 py-3.5 text-sm transition-all shadow-md shadow-primary/20"
            >
              {{ content.starterCtaLabel }}
            </RouterLink>
            <p class="text-[10px] text-slate-400 text-center mt-2.5 leading-snug">
              15 días gratis · sin tarjeta hoy · cancelás cuando quieras
            </p>
          </div>
        </div>
      </div>

      <!-- Escalera de crecimiento ────────────────────────────────────── -->
      <div class="mb-8">
        <div class="text-center mb-8">
          <p class="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-2">
            {{ content.scaleEyebrow }}
          </p>
          <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 mb-2">
            {{ content.scaleTitle }}
          </h3>
          <p class="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            {{ content.scaleSubtitle }}
          </p>
        </div>

        <!-- Tabla de tiers — visual de escalera por volumen de pedidos -->
        <div class="rounded-3xl border border-slate-200 bg-white overflow-hidden">
          <!-- Header de la tabla (desktop only) -->
          <div class="hidden sm:grid grid-cols-[1.4fr_1fr_auto_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>Tier</span>
            <span class="text-right">Pedidos / mes</span>
            <span class="text-right whitespace-nowrap">Fee fijo</span>
            <span class="text-right whitespace-nowrap">Comisión</span>
          </div>

          <!-- Filas: cada tier es una row -->
          <div
            v-for="(tier, i) in content.scaleTiers"
            :key="tier.name"
            class="relative grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_auto_auto] gap-2 sm:gap-4 px-6 py-4 transition-colors"
            :class="[
              tier.highlight ? 'bg-primary/[0.03] sm:bg-primary/[0.04]' : 'hover:bg-slate-50/60',
              i !== content.scaleTiers.length - 1 ? 'border-b border-slate-100' : '',
            ]"
          >
            <!-- Nombre del tier + tagline -->
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
                :class="tier.highlight
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-500'"
              >
                {{ i + 1 }}
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm font-bold text-slate-900">{{ tier.name }}</span>
                  <span
                    v-if="tier.highlight"
                    class="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest"
                  >
                    {{ content.scaleHighlightLabel }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 mt-0.5 leading-snug">{{ tier.tagline }}</p>
              </div>
            </div>

            <!-- Pedidos del tier -->
            <div class="sm:text-right">
              <span class="inline-block text-xs sm:text-sm font-bold text-slate-700 tabular-nums">
                {{ tier.ordersLabel }}
              </span>
              <p class="sm:hidden text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Pedidos/mes</p>
            </div>

            <!-- Fee fijo -->
            <div class="flex items-baseline gap-1 sm:justify-end sm:text-right">
              <span class="text-xs sm:text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                <template v-if="tier.fee !== null">USD {{ tier.fee }}</template>
                <template v-else>A medida</template>
              </span>
              <span v-if="tier.fee !== null" class="text-[10px] text-slate-400">/ mes</span>
              <span class="sm:hidden text-[10px] text-slate-400 ml-1 uppercase tracking-widest">Fee</span>
            </div>

            <!-- Comisión -->
            <div class="flex items-baseline gap-1 sm:justify-end sm:text-right">
              <span class="text-xs sm:text-sm font-bold tabular-nums whitespace-nowrap" :class="tier.highlight ? 'text-primary' : 'text-slate-700'">
                {{ tier.commissionLabel }}
              </span>
              <span class="text-[10px] text-slate-400">por venta</span>
            </div>
          </div>

          <!-- Footer con disclaimer -->
          <div class="px-6 py-4 bg-slate-50/60 border-t border-slate-100">
            <p class="text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <Info class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{{ content.scaleFootnote }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- "Cómo crecemos juntos" — narrativa ───────────────────────── -->
      <div class="grid lg:grid-cols-3 gap-4 mb-8">
        <div
          v-for="(promise, i) in content.growthPromises"
          :key="promise.title"
          class="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
              {{ i + 1 }}
            </span>
            <h4 class="text-sm font-bold text-slate-900 leading-tight">{{ promise.title }}</h4>
          </div>
          <p class="text-sm text-slate-500 leading-relaxed">{{ promise.body }}</p>
        </div>
      </div>

      <!-- Footer-CTA + guarantees -->
      <div class="rounded-3xl bg-gradient-to-br from-primary to-[#3c1fc9] text-white p-7 sm:p-10 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div class="relative grid lg:grid-cols-[1.3fr_1fr] gap-6 items-center">
          <div>
            <p class="text-[11px] font-black text-white/60 uppercase tracking-[0.25em] mb-3">
              Listo para empezar
            </p>
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter leading-tight mb-3">
              {{ content.ctaTitle }}
            </h3>
            <p class="text-sm text-white/85 leading-relaxed mb-5 max-w-md">
              {{ content.ctaSubtitle }}
            </p>
            <div class="flex items-center gap-3 flex-wrap">
              <RouterLink
                :to="{ path: '/comenzar', query: { from: 'cadenas_pricing_footer' } }"
                class="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-5 py-3 text-sm font-bold transition-colors"
              >
                {{ content.ctaPrimaryLabel }}
                <ArrowRight class="w-3.5 h-3.5" />
              </RouterLink>
              <a
                :href="content.ctaSecondaryHref"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 text-sm font-bold text-white/85 hover:text-white transition-colors"
              >
                {{ content.ctaSecondaryLabel }}
              </a>
            </div>
          </div>
          <ul class="grid gap-2 text-sm">
            <li v-for="g in content.ctaGuarantees" :key="g" class="flex items-start gap-2 text-white/85">
              <ShieldCheck class="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <span>{{ g }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Sparkles, Rocket, Check, Info, ArrowRight, ShieldCheck } from 'lucide-vue-next'

defineProps({
  content: {
    type: Object,
    required: true,
  },
})
</script>
