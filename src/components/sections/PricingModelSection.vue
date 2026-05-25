<template>
  <section id="pricing-2026" class="py-24 px-6 sm:px-12 bg-white overflow-hidden">
    <div class="max-w-6xl mx-auto">

      <!-- ──────────────────────────────────────────────────────── -->
      <!-- 1. INTRO — el "qué hace Deenex" + claim editorial         -->
      <!-- ──────────────────────────────────────────────────────── -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-5">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {{ c.eyebrow }}
          </div>
          <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
            {{ c.headlineLine1 }}<br />
            <span class="text-primary italic font-light">{{ c.headlineLine2 }}</span>
          </h2>
        </div>
        <div class="hidden lg:block max-w-[320px] text-right relative lg:ml-auto">
          <div class="absolute -left-10 top-0 bottom-0 w-px bg-slate-200/60"></div>
          <p class="text-slate-400 text-sm leading-relaxed pr-2">
            {{ c.sidequote }}
          </p>
        </div>
      </div>

      <!-- ──────────────────────────────────────────────────────── -->
      <!-- 2. PLANES MENSUALES — tabla Comercio + Partners + Bundle -->
      <!-- ──────────────────────────────────────────────────────── -->
      <div class="mb-16">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">
              {{ c.plans.eyebrow }}
            </p>
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 leading-tight">
              {{ c.plans.title }}
            </h3>
          </div>
          <p class="text-sm text-slate-500 max-w-md leading-relaxed">
            {{ c.plans.subtitle }}
          </p>
        </div>

        <!-- Toggle Comercio / Partners / Bundle -->
        <div class="flex items-center gap-3 flex-wrap mb-6">
          <div class="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in productTabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5"
              :class="activeTab === tab.key
                ? 'bg-white text-primary shadow-sm shadow-slate-200/60'
                : 'text-slate-500 hover:text-slate-700'"
            >
              {{ tab.label }}
              <span
                v-if="tab.badge"
                class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                :class="activeTab === tab.key ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'"
              >{{ tab.badge }}</span>
            </button>
          </div>
          <p v-if="activeTabHint" class="text-xs text-slate-500 max-w-md leading-snug">
            {{ activeTabHint }}
          </p>
        </div>

        <!-- Tabla planes (desktop) + carrusel (mobile) -->
        <div class="hidden md:block rounded-3xl border border-slate-200 overflow-hidden">
          <div class="grid grid-cols-[2fr_repeat(4,1fr)] divide-x divide-slate-100">
            <!-- Header -->
            <div class="bg-slate-50/60 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Plan · Pedidos / mes
            </div>
            <div
              v-for="plan in c.plans.tiers"
              :key="plan.key"
              class="bg-slate-50/60 px-5 py-4 text-center"
              :class="plan.featured ? 'relative' : ''"
            >
              <p class="text-sm font-extrabold text-slate-900 uppercase tracking-tight">{{ plan.name }}</p>
              <p class="text-[10px] text-slate-400 mt-0.5">{{ plan.volume }}</p>
              <span
                v-if="plan.featured"
                class="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
              >
                {{ plan.featuredLabel || 'Popular' }}
              </span>
            </div>

            <!-- Filas: Fee fijo + comisión -->
            <template v-if="activeTab !== 'bundle'">
              <div class="px-6 py-5 text-sm font-semibold text-slate-900">Fee fijo / mes</div>
              <div
                v-for="plan in c.plans.tiers"
                :key="plan.key + '-fee'"
                class="px-5 py-5 text-center"
              >
                <span class="text-xl font-extrabold text-slate-900 tabular-nums">USD {{ activeProductPrices(plan).fee }}</span>
              </div>

              <div class="px-6 py-5 text-sm font-semibold text-slate-900">
                Comisión por venta
                <span class="block text-[11px] text-slate-400 font-medium mt-0.5">Baja con volumen</span>
              </div>
              <div
                v-for="plan in c.plans.tiers"
                :key="plan.key + '-pct'"
                class="px-5 py-5 text-center"
              >
                <span class="inline-flex items-baseline gap-0.5">
                  <span class="text-lg font-extrabold text-primary tabular-nums">{{ activeProductPrices(plan).pct }}</span>
                  <span class="text-xs font-semibold text-primary/70">%</span>
                </span>
              </div>
            </template>

            <!-- Bundle: precio combinado con tachado -->
            <template v-else>
              <div class="px-6 py-5 text-sm font-semibold text-slate-900">
                Fee combinado / mes
                <span class="block text-[11px] text-slate-400 font-medium mt-0.5">Comercio + Partners</span>
              </div>
              <div
                v-for="plan in c.plans.tiers"
                :key="plan.key + '-bundle'"
                class="px-5 py-5 text-center"
              >
                <span class="block text-[11px] text-slate-300 line-through tabular-nums">USD {{ plan.bundle.list }}</span>
                <span class="text-xl font-extrabold text-emerald-600 tabular-nums">USD {{ plan.bundle.price }}</span>
              </div>
            </template>
          </div>

          <!-- Footnote tabla -->
          <div class="px-6 py-4 bg-white border-t border-slate-100 text-[11px] text-slate-400 font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>{{ c.plans.footnote }}</span>
            <span v-if="activeTab === 'bundle'" class="text-emerald-600 font-semibold">
              · Cada producto conserva su comisión por transacción.
            </span>
          </div>
        </div>

        <!-- Cards stack (mobile) -->
        <div class="md:hidden flex flex-col gap-3">
          <div
            v-for="plan in c.plans.tiers"
            :key="plan.key + '-mobile'"
            class="border border-slate-200 rounded-2xl p-5 bg-white relative"
            :class="plan.featured ? 'border-primary/30 shadow-md shadow-primary/5' : ''"
          >
            <span
              v-if="plan.featured"
              class="absolute -top-2 left-5 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
            >
              {{ plan.featuredLabel || 'Popular' }}
            </span>
            <div class="flex items-baseline justify-between mb-1">
              <h4 class="text-base font-extrabold uppercase tracking-tight text-slate-900">{{ plan.name }}</h4>
              <p class="text-[10px] text-slate-400 font-medium">{{ plan.volume }}</p>
            </div>

            <template v-if="activeTab !== 'bundle'">
              <div class="flex items-baseline gap-2 mt-3">
                <span class="text-2xl font-extrabold text-slate-900 tabular-nums">USD {{ activeProductPrices(plan).fee }}</span>
                <span class="text-xs text-slate-400">/ mes</span>
              </div>
              <p class="mt-1 text-sm font-bold text-primary">
                + {{ activeProductPrices(plan).pct }}% por venta
              </p>
            </template>

            <template v-else>
              <div class="flex items-baseline gap-2 mt-3">
                <span class="text-2xl font-extrabold text-emerald-600 tabular-nums">USD {{ plan.bundle.price }}</span>
                <span class="text-xs text-slate-300 line-through">USD {{ plan.bundle.list }}</span>
              </div>
              <p class="mt-1 text-[11px] text-slate-500">Cada producto conserva su comisión.</p>
            </template>
          </div>
          <p class="text-[11px] text-slate-400 font-medium px-1">{{ c.plans.footnote }}</p>
        </div>
      </div>

      <!-- Divider editorial: dos modelos posibles -->
      <div class="my-16 sm:my-20 relative">
        <div class="absolute inset-x-0 top-1/2 h-px bg-slate-200/70 -translate-y-1/2"></div>
        <div class="relative flex justify-center">
          <span class="px-4 sm:px-6 py-2 bg-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
            {{ c.divider }}
          </span>
        </div>
      </div>

      <!-- ──────────────────────────────────────────────────────── -->
      <!-- 3. DEENEX COMERCIO — una tarifa, cuatro canales          -->
      <!-- ──────────────────────────────────────────────────────── -->
      <div class="mb-16 grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-14 items-start">
        <!-- Columna izquierda: tarifa hero -->
        <div class="relative bg-slate-50/60 border border-slate-200 rounded-3xl p-8 lg:p-10 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent pointer-events-none"></div>
          <div class="relative">
            <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">
              {{ c.comercio.eyebrow }}
            </p>
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 leading-[1.1] mb-6">
              {{ c.comercio.headlineLine1 }}<br />
              <span class="text-primary italic font-light">{{ c.comercio.headlineLine2 }}</span>
            </h3>

            <div class="flex items-baseline gap-1 mb-3">
              <span class="text-[6rem] sm:text-[7rem] font-black text-primary tracking-tighter leading-none">{{ c.comercio.rate }}</span>
              <span class="text-2xl font-black text-primary">%</span>
            </div>
            <div class="flex items-start gap-3 mb-6 pl-1">
              <div class="w-px self-stretch bg-primary/30 mt-1"></div>
              <div>
                <p class="text-[10px] font-black text-primary/80 uppercase tracking-widest">{{ c.comercio.rateCaption }}</p>
                <p class="text-sm text-slate-500 mt-1 max-w-[220px] leading-snug">
                  {{ c.comercio.rateDesc }}
                </p>
              </div>
            </div>

            <p class="text-sm font-bold text-slate-900 mb-1">{{ c.comercio.promiseTitle }}</p>
            <p class="text-sm text-slate-500 leading-relaxed">
              {{ c.comercio.promiseDesc }}
            </p>
          </div>
        </div>

        <!-- Columna derecha: 4 canales -->
        <div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="channel in c.comercio.channels"
              :key="channel.title"
              class="border border-slate-200 rounded-2xl p-5 bg-white hover:border-slate-300 transition-colors"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <component :is="channel.icon" v-if="channel.icon" class="w-4 h-4 text-primary" />
                </div>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">{{ channel.title }}</h4>
              <p class="text-base font-extrabold mb-2 leading-none">
                <span class="text-primary tabular-nums">{{ channel.rate }}</span>
                <span class="text-xs font-bold text-slate-500 ml-1">{{ channel.scope }}</span>
              </p>
              <p class="text-xs text-slate-500 leading-relaxed">{{ channel.desc }}</p>
            </div>
          </div>

          <!-- Plan complementario Partners -->
          <div class="mt-3 rounded-2xl bg-slate-900 text-white p-5 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent pointer-events-none"></div>
            <div class="relative flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <component :is="c.partners.icon" v-if="c.partners.icon" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">
                    {{ c.partners.eyebrow }}
                  </p>
                  <p class="text-sm font-bold leading-tight">{{ c.partners.title }}</p>
                  <p class="text-xs text-white/60 mt-0.5">{{ c.partners.desc }}</p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-3xl font-black text-white tabular-nums">{{ c.partners.rate }}</span>
                <span class="text-lg font-black text-white">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider editorial: marketing on top -->
      <div class="my-16 sm:my-20 relative">
        <div class="absolute inset-x-0 top-1/2 h-px bg-slate-200/70 -translate-y-1/2"></div>
        <div class="relative flex justify-center">
          <span class="px-4 sm:px-6 py-2 bg-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
            {{ c.dividerActiva }}
          </span>
        </div>
      </div>

      <!-- ──────────────────────────────────────────────────────── -->
      <!-- 4. DEENEX ACTIVA — marketing por performance              -->
      <!-- ──────────────────────────────────────────────────────── -->
      <div class="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 items-start">
        <!-- Pitch -->
        <div>
          <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">
            {{ c.activa.eyebrow }}
          </p>
          <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 leading-[1.1] mb-6">
            {{ c.activa.headlineLine1 }}<br />
            <span class="text-primary italic font-light">{{ c.activa.headlineLine2 }}</span>
          </h3>
          <p class="text-base text-slate-500 leading-relaxed mb-4">
            {{ c.activa.desc }}
          </p>
          <p class="text-sm font-bold text-slate-900">{{ c.activa.tagline }}</p>
        </div>

        <!-- Cards de pricing performance -->
        <div class="flex flex-col gap-3">
          <!-- Orgánica -->
          <div class="border border-slate-200 rounded-2xl p-5 bg-white flex items-start justify-between gap-4">
            <div class="flex items-start gap-3 min-w-0">
              <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <component :is="c.activa.organic.icon" v-if="c.activa.organic.icon" class="w-4 h-4 text-primary" />
              </div>
              <div class="min-w-0">
                <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">
                  {{ c.activa.organic.eyebrow }}
                </p>
                <p class="text-sm font-bold text-slate-900 leading-tight">{{ c.activa.organic.title }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ c.activa.organic.note }}</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="text-3xl font-black text-primary tabular-nums">{{ c.activa.organic.rate }}</span>
              <span class="text-base font-black text-primary">%</span>
            </div>
          </div>

          <!-- Paga -->
          <div class="rounded-2xl bg-slate-900 text-white p-5 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent pointer-events-none"></div>
            <div class="relative flex items-start justify-between gap-4">
              <div class="flex items-start gap-3 min-w-0">
                <div class="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <component :is="c.activa.paid.icon" v-if="c.activa.paid.icon" class="w-4 h-4 text-white" />
                </div>
                <div class="min-w-0">
                  <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-0.5">
                    {{ c.activa.paid.eyebrow }}
                  </p>
                  <p class="text-sm font-bold leading-tight">{{ c.activa.paid.title }}</p>
                  <p class="text-xs text-white/60 mt-1">{{ c.activa.paid.note }}</p>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-3xl font-black text-white tabular-nums">{{ c.activa.paid.rate }}</span>
                <span class="text-base font-black text-white">%</span>
              </div>
            </div>
          </div>

          <!-- Ejemplo numérico -->
          <div class="rounded-2xl bg-slate-50/60 border border-slate-200 p-5">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              {{ c.activa.example.eyebrow }}
            </p>
            <ul class="space-y-2 text-sm">
              <li
                v-for="(row, ri) in c.activa.example.rows"
                :key="ri"
                class="flex items-center justify-between gap-3"
                :class="row.highlight ? 'pt-2 mt-2 border-t border-slate-200' : ''"
              >
                <span class="text-slate-600">{{ row.label }}</span>
                <span
                  class="font-extrabold tabular-nums"
                  :class="row.highlight ? 'text-primary' : 'text-slate-900'"
                >
                  {{ row.value }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CTA final -->
      <div v-if="c.cta" class="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <a
          :href="c.cta.primaryHref"
          @click="c.cta.primaryEvent && trackEvent(c.cta.primaryEvent)"
          class="inline-flex items-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          {{ c.cta.primaryLabel }}
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
            <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <a :href="c.cta.secondaryHref" class="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          {{ c.cta.secondaryLabel }}
        </a>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { trackEvent } from '@/utils/analytics'
import {
  ShoppingBag,
  Coffee,
  Utensils,
  Bike,
  Sparkles,
  Megaphone,
  Truck,
} from 'lucide-vue-next'

const DEFAULTS = {
  eyebrow: 'Pricing · 2026',
  headlineLine1: 'Crecé con nosotros.',
  headlineLine2: 'El precio se ajusta solo.',
  sidequote:
    '"Los restaurantes saben cocinar. No saben hacer marketing." — Deenex se ocupa de que el cliente vuelva.',
  divider: 'O si preferís una tarifa simple sin fee mensual',
  dividerActiva: 'Y para activar tu base, sin compromiso',

  plans: {
    eyebrow: 'Planes mensuales',
    title: 'Fee fijo + comisión que baja con volumen',
    subtitle:
      'Una matriz simple para que pagues lo justo según cuánto vendés. Sin tope de locales por marca.',
    products: [
      { key: 'comercio', label: 'Comercio', hint: 'Ecommerce omnicanal · 4 canales bajo tu marca.' },
      { key: 'partners', label: 'Partners', hint: 'Red de riders para comercios sin flota propia.' },
      { key: 'bundle', label: 'Bundle', badge: 'AHORRO', hint: 'Comercio + Partners con descuento sobre el fee combinado.' },
    ],
    tiers: [
      {
        key: 'starter',
        name: 'Starter',
        volume: 'Hasta 300 pedidos',
        comercio: { fee: 29, pct: '1,5' },
        partners: { fee: 49, pct: '3,0' },
        bundle: { list: 78, price: 69 },
      },
      {
        key: 'growth',
        name: 'Growth',
        volume: '301 – 1.000',
        comercio: { fee: 119, pct: '1,25' },
        partners: { fee: 169, pct: '2,75' },
        bundle: { list: 288, price: 239 },
        featured: true,
        featuredLabel: 'Popular',
      },
      {
        key: 'scale',
        name: 'Scale',
        volume: '1.001 – 3.000',
        comercio: { fee: 269, pct: '1,0' },
        partners: { fee: 389, pct: '2,5' },
        bundle: { list: 658, price: 549 },
      },
      {
        key: 'pro',
        name: 'Pro',
        volume: '3.001+',
        comercio: { fee: 449, pct: '0,75' },
        partners: { fee: 649, pct: '2,25' },
        bundle: { list: 1098, price: 899 },
      },
    ],
    footnote:
      'USD / mes por marca · Sin tope de locales · Implementación: USD 50 por local · USD 75 con integración POS.',
  },

  comercio: {
    eyebrow: 'Deenex Comercio',
    headlineLine1: 'Una sola tarifa.',
    headlineLine2: 'Cuatro canales.',
    rate: '1,5',
    rateCaption: 'Por venta procesada',
    rateDesc: 'El alcance cambia según el canal. El número, nunca.',
    promiseTitle: 'Sin fee fijo. Sin setup. Sin sorpresas.',
    promiseDesc:
      'Cobramos cuando el comercio vende — alineados con su crecimiento.',
    channels: [
      {
        title: 'Mostrador',
        rate: '1,5%',
        scope: 'de todo',
        desc: 'Cliente siempre identificado por QR ID o DNI al pagar.',
        icon: ShoppingBag,
      },
      {
        title: 'Take Away',
        rate: '1,5%',
        scope: 'de todo',
        desc: 'Pedido nominal por web o app. Cliente registrado de origen.',
        icon: Coffee,
      },
      {
        title: 'Salón',
        rate: '1,5%',
        scope: 'solo registrados',
        desc: 'Mesas con QR de identificación. El que no escanea, no entra al cobro.',
        icon: Utensils,
      },
      {
        title: 'Flota Propia',
        rate: '1,5%',
        scope: 'de todo',
        desc: 'El comercio pone los riders. Nosotros la plataforma.',
        icon: Bike,
      },
    ],
  },

  partners: {
    eyebrow: 'Plan complementario',
    title: 'Deenex Partners — red de riders propia',
    desc: 'Para comercios sin flota. Combinable con Comercio en el Bundle.',
    rate: '3',
    icon: Truck,
  },

  activa: {
    eyebrow: 'Deenex Activa · Marketing por performance',
    headlineLine1: 'Si no vendés,',
    headlineLine2: 'no pagás.',
    desc:
      'Activamos la base de datos del comercio con campañas automáticas — push, WhatsApp, Meta Ads. Cobramos solo sobre la venta atribuida.',
    tagline: 'Cero fee mensual. Cero compromiso.',
    organic: {
      eyebrow: 'Activación orgánica',
      title: 'Push, email, WhatsApp, SMS',
      note: 'Sobre venta atribuida a la campaña.',
      rate: '10 – 12',
      icon: Sparkles,
    },
    paid: {
      eyebrow: 'Activación paga',
      title: 'Meta Ads, Google Ads',
      note: 'Sobre venta atribuida — sin contar pauta.',
      rate: '6 – 7',
      icon: Megaphone,
    },
    example: {
      eyebrow: 'Ejemplo · cliente Growth',
      rows: [
        { label: '800 pedidos / mes · ticket USD 15', value: 'USD 12.000 GMV' },
        { label: 'Recompra atribuida (~15%)', value: 'USD 1.800' },
        {
          label: 'Fee Deenex Activa (~7%)',
          value: '≈ USD 130 / mes',
          highlight: true,
        },
      ],
    },
  },

  cta: {
    primaryLabel: 'Calcular mi plan',
    primaryHref: '#agendar',
    primaryEvent: 'click_pricing_2026_calcular',
    secondaryLabel: 'Hablar con ventas',
    secondaryHref: '#agendar',
  },
}

const props = defineProps({
  content: { type: Object, default: () => ({}) },
})

const c = computed(() => {
  const src = props.content || {}
  return {
    ...DEFAULTS,
    ...src,
    plans: {
      ...DEFAULTS.plans,
      ...src.plans,
      tiers: src.plans?.tiers?.length ? src.plans.tiers : DEFAULTS.plans.tiers,
      products: src.plans?.products?.length ? src.plans.products : DEFAULTS.plans.products,
    },
    comercio: {
      ...DEFAULTS.comercio,
      ...src.comercio,
      channels: src.comercio?.channels?.length
        ? src.comercio.channels
        : DEFAULTS.comercio.channels,
    },
    partners: { ...DEFAULTS.partners, ...src.partners },
    activa: {
      ...DEFAULTS.activa,
      ...src.activa,
      organic: { ...DEFAULTS.activa.organic, ...src.activa?.organic },
      paid: { ...DEFAULTS.activa.paid, ...src.activa?.paid },
      example: {
        ...DEFAULTS.activa.example,
        ...src.activa?.example,
        rows: src.activa?.example?.rows?.length
          ? src.activa.example.rows
          : DEFAULTS.activa.example.rows,
      },
    },
    cta: { ...DEFAULTS.cta, ...src.cta },
  }
})

const productTabs = computed(() => c.value.plans.products)
const activeTab = ref('comercio')
const activeTabHint = computed(() => {
  const t = productTabs.value.find((x) => x.key === activeTab.value)
  return t?.hint || ''
})

function activeProductPrices(plan) {
  if (activeTab.value === 'partners') return plan.partners
  return plan.comercio
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
