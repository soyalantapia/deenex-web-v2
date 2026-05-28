<template>
  <aside class="hidden lg:block sticky top-32">
    <Transition name="panel" mode="out-in">
      <!-- IDENTITY · MARCA, social proof + guarantee ─────────────────── -->
      <!-- Identity, Business y Savings comparten el mismo card "Trial 14 días"
           (sin cargo hoy + garantías + logos clientes). Estos 3 steps son
           pre-conversión, sin contexto de plan elegido. -->
      <div v-if="mode === 'identity' || mode === 'business' || mode === 'savings'" key="trust" class="bg-slate-50/60 border border-slate-200 rounded-3xl p-7 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent pointer-events-none"></div>
        <div class="relative">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-5">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Trial 14 días
          </div>
          <h3 class="text-xl font-extrabold tracking-tighter text-slate-900 mb-3 leading-tight">
            Empezá gratis.<br />
            <span class="text-primary italic font-light">Pagás cuando vendas.</span>
          </h3>
          <ul class="space-y-3 text-sm text-slate-600 leading-relaxed">
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check class="w-3 h-3 text-primary" />
              </span>
              Activás tu app sin tarjeta. La pedimos cuando actives cobros reales.
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check class="w-3 h-3 text-primary" />
              </span>
              14 días para cargar menú, branding y probar pedidos en modo demo.
            </li>
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check class="w-3 h-3 text-primary" />
              </span>
              Si no convence, te exportamos los datos y bajamos sin preguntas.
            </li>
          </ul>
          <div class="mt-7 pt-6 border-t border-slate-200/70">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              +500 sucursales ya operan con Deenex
            </p>
            <!-- Carrusel: 3 logos visibles al mismo tiempo dentro de los
                 ~272px del sidepanel (320 - 24*2 de padding). Cada item ocupa
                 ~80px (60 logo + 20 gap) → 3 items entran cómodos. -->
            <Vue3Marquee
              :duration="20"
              :pause-on-hover="true"
              :clone="true"
              :gradient="true"
              :gradient-color="[248, 250, 252]"
              :gradient-width="16"
            >
              <div
                v-for="b in brandLogos"
                :key="b.name"
                class="mr-5 flex items-center justify-center h-7 w-[60px] shrink-0"
              >
                <img
                  :src="b.src"
                  :alt="b.name"
                  class="max-h-6 max-w-full w-auto object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
                  loading="lazy"
                />
              </div>
            </Vue3Marquee>
          </div>
        </div>
      </div>

      <!-- PLAN, savings highlight + testimonial ───────────────────────── -->
      <div v-else-if="mode === 'plan'" key="plan" class="space-y-4">
        <div class="rounded-3xl bg-emerald-50/60 border border-emerald-100 p-7 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent pointer-events-none"></div>
          <div class="relative">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider mb-5">
              <TrendingDown class="w-3 h-3" />
              Tu ahorro
            </div>
            <h3 class="text-xl font-extrabold tracking-tighter text-slate-900 mb-3 leading-tight">
              Lo que dejás de pagar<br />
              <span class="text-emerald-600 italic font-light">a apps de terceros.</span>
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed mb-4">
              Cada local que migrás te ahorra entre USD 800 y USD 4.500 mensuales
              en comisiones según el volumen.
            </p>
            <ul class="space-y-2.5 text-sm text-slate-700">
              <li class="flex items-center justify-between gap-2 pb-2 border-b border-emerald-100">
                <span>PedidosYa</span>
                <span class="font-bold text-rose-500 tabular-nums">28%</span>
              </li>
              <li class="flex items-center justify-between gap-2 pb-2 border-b border-emerald-100">
                <span>Rappi</span>
                <span class="font-bold text-rose-500 tabular-nums">30%</span>
              </li>
              <li class="flex items-center justify-between gap-2 pb-2 border-b border-emerald-100">
                <span>Uber Eats</span>
                <span class="font-bold text-rose-500 tabular-nums">30%</span>
              </li>
              <li class="flex items-center justify-between gap-2 pt-1">
                <span class="font-bold">Deenex</span>
                <span class="font-bold text-emerald-600 tabular-nums">{{ deenexFeeLabel }} solo delivery</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- PREVIEW (sandbox), tips de uso + founder note ───────────────── -->
      <div v-else-if="mode === 'preview'" key="preview" class="space-y-4">
        <div class="rounded-3xl bg-slate-900 text-white p-7 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none"></div>
          <div class="relative">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-wider mb-5">
              <Sparkles class="w-3 h-3" />
              Vista demo
            </div>
            <h3 class="text-xl font-extrabold tracking-tighter mb-3 leading-tight">
              Tocá lo que quieras.<br />
              <span class="text-emerald-300 italic font-light">No rompés nada.</span>
            </h3>
            <p class="text-sm text-white/70 leading-relaxed mb-5">
              Datos demo de un restaurante ficticio. Cuando actives tu cuenta,
              vas a ver los datos reales de tu marca con tu branding.
            </p>
            <ul class="space-y-2.5 text-xs text-white/80">
              <li class="flex items-start gap-2">
                <Eye class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                Cambiá de tab para ver Ventas, Clientes, Campañas y Loyalty.
              </li>
              <li class="flex items-start gap-2">
                <Eye class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                Los KPIs se actualizan en tiempo real cuando tenés pedidos.
              </li>
              <li class="flex items-start gap-2">
                <Eye class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                Vas a tener tu propio subdomain branded.
              </li>
            </ul>
          </div>
        </div>

        <!-- Mensaje del equipo Deenex -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <div class="flex items-start gap-3 mb-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[#3c1fc9] flex items-center justify-center text-white shrink-0">
              <img src="@/assets/images/nav-logo.webp" alt="Deenex" class="h-3 w-auto brightness-0 invert" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-900 leading-tight">Equipo fundador</p>
              <p class="text-[10px] text-slate-500 font-medium">Deenex</p>
            </div>
          </div>
          <blockquote class="text-xs text-slate-600 leading-relaxed italic">
            "Construimos Deenex porque vimos a las marcas con las que trabajábamos
            perder 30% de su margen con apps de terceros. Probalo y vas a entender
            por qué nos despertamos cada día para esto."
          </blockquote>
        </div>
      </div>

      <!-- TRIAL, trust badges (security, garantías, MP) ───────────────── -->
      <div v-else-if="mode === 'trial'" key="trial" class="space-y-4">
        <div class="rounded-3xl bg-slate-50/60 border border-slate-200 p-7 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent pointer-events-none"></div>
          <div class="relative">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider mb-5">
              <ShieldCheck class="w-3 h-3" />
              Seguro y garantizado
            </div>
            <h3 class="text-xl font-extrabold tracking-tighter text-slate-900 mb-3 leading-tight">
              Tu dinero, protegido.<br />
              <span class="text-primary italic font-light">Sin letra chica.</span>
            </h3>
            <ul class="space-y-3 mt-5">
              <li v-for="badge in trustBadges" :key="badge.title" class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-200">
                  <component :is="badge.icon" class="w-5 h-5" :class="badge.color" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-slate-900 leading-tight">{{ badge.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5 leading-snug">{{ badge.desc }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- WELCOME, celebración + next steps recap ─────────────────────── -->
      <div v-else-if="mode === 'welcome'" key="welcome" class="space-y-4">
        <div class="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-7 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none"></div>
          <div class="relative">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider mb-5">
              <PartyPopper class="w-3 h-3" />
              Bienvenido
            </div>
            <h3 class="text-xl font-extrabold tracking-tighter mb-3 leading-tight">
              Tu trial está activo.<br />
              <span class="text-emerald-100 italic font-light">14 días para enamorarte.</span>
            </h3>
            <p class="text-sm text-white/90 leading-relaxed">
              Estás entre las primeras cadenas de la región en operar 100% sobre canal propio. Te queda un equipo de Customer Success listo para ayudarte.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import {
  Check, TrendingDown, Sparkles, Eye, ShieldCheck, PartyPopper,
  Lock, FileCheck, Receipt,
} from 'lucide-vue-next'

const props = defineProps({
  mode: { type: String, default: 'identity' }, // identity | business | plan | preview | trial | welcome
  hasProgress: { type: Boolean, default: false },
  recommendedPlanCommission: { type: String, default: '1,25%' },
})

import { Vue3Marquee } from 'vue3-marquee'

// Logos reales de clientes, los mismos `.webp` que usa la landing en el
// social proof del Hero. Vite resuelve el path al asset hashed en build.
import paltaLogo from '@/assets/images/clients/palta.webp'
import hatsuLogo from '@/assets/images/clients/hatsu.webp'
import coquitosLogo from '@/assets/images/clients/coquitos.webp'
import montiLogo from '@/assets/images/clients/monti.webp'
import gloriasLogo from '@/assets/images/clients/glorias.webp'
import quemLogo from '@/assets/images/clients/quem.webp'

const brandLogos = [
  { name: 'Palta', src: paltaLogo },
  { name: 'Hatsu', src: hatsuLogo },
  { name: 'Coquitos', src: coquitosLogo },
  { name: 'Monti', src: montiLogo },
  { name: 'Glorias', src: gloriasLogo },
  { name: 'Qüem', src: quemLogo },
]

const deenexFeeLabel = computed(() => `${props.recommendedPlanCommission}`)

const trustBadges = [
  { title: 'MercadoPago oficial', desc: 'Partner certificado. Nunca vemos tu tarjeta.', icon: ShieldCheck, color: 'text-sky-500' },
  { title: 'Cifrado AES-256', desc: 'Tus datos en tránsito y en reposo, encriptados.', icon: Lock, color: 'text-emerald-500' },
  { title: 'Sin permanencia', desc: 'Cancelás en 1 click desde tu panel, cuando quieras.', icon: FileCheck, color: 'text-amber-500' },
  { title: 'Factura legal', desc: 'Factura B/C automática a tu CUIT/RFC cada mes.', icon: Receipt, color: 'text-violet-500' },
]
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
