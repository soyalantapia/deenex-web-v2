<template>
  <div class="min-h-screen bg-white">
    <!-- Sticky header simple para el demo público -->
    <header class="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <RouterLink to="/" class="flex items-center gap-2 group">
          <img src="@/assets/images/nav-logo.webp" alt="Deenex" class="h-4 sm:h-5 w-auto" />
        </RouterLink>
        <div class="flex items-center gap-2">
          <span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest">
            <Sparkles class="w-2.5 h-2.5" />
            Vista demo pública
          </span>
          <RouterLink
            :to="{ path: '/comenzar', query: { from: 'public_demo' } }"
            @click="trackActivateClick('header')"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-[#3c1fc9] transition-colors"
          >
            Activar mi cuenta
            <ArrowRight class="w-3 h-3" />
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <!-- Intro -->
      <div class="mb-8">
        <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
          Demo · 0 tarjeta · 0 setup
        </p>
        <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
          Así es Deenex por dentro.<br />
          <span class="text-primary italic font-light">Tocá todo lo que quieras.</span>
        </h1>
        <p class="text-base text-slate-500 leading-relaxed max-w-xl">
          Datos demo de un restaurante ficticio. Cuando activás tu trial, ves tus
          datos reales con tu marca aplicada. Recorré los 4 tabs.
        </p>
      </div>

      <!-- Browser chrome mock -->
      <div class="rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden bg-white mb-8">
        <div class="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50/80">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <div class="flex-1 mx-3 bg-white border border-slate-200 rounded-md px-3 py-0.5 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Lock class="w-2.5 h-2.5" />
            demo.deenex.app/dashboard
          </div>
          <span class="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
            Demo
          </span>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-1 px-3 pt-3 border-b border-slate-100 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors relative"
            :class="activeTab === tab.key ? 'text-primary' : 'text-slate-500 hover:text-slate-700'"
          >
            <component :is="tab.icon" class="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" />
            {{ tab.label }}
            <span
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
            ></span>
          </button>
        </div>

        <!-- Tab content (versión reducida) -->
        <div class="p-5 sm:p-7 min-h-[340px]">
          <Transition name="tab" mode="out-in">
            <!-- VENTAS -->
            <div v-if="activeTab === 'sales'" key="sales" class="space-y-5">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div v-for="kpi in salesKpis" :key="kpi.label" class="rounded-xl border border-slate-200 bg-white p-3">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{{ kpi.label }}</p>
                  <p class="text-lg font-black tabular-nums text-slate-900">{{ kpi.value }}</p>
                  <p class="text-[10px] font-semibold text-emerald-600 mt-0.5">{{ kpi.delta }} vs ayer</p>
                </div>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Ventas por canal</p>
                <div class="space-y-2.5">
                  <div v-for="ch in salesByChannel" :key="ch.name" class="flex items-center gap-3">
                    <span class="text-xs font-semibold text-slate-600 w-24 shrink-0">{{ ch.name }}</span>
                    <div class="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full" :class="ch.color" :style="{ width: ch.pct + '%' }"></div>
                    </div>
                    <span class="text-xs font-bold text-slate-900 tabular-nums w-20 text-right shrink-0">USD {{ ch.amount.toLocaleString('es-AR') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CLIENTES -->
            <div v-else-if="activeTab === 'customers'" key="customers" class="space-y-5">
              <div class="grid grid-cols-3 gap-3">
                <div class="rounded-xl bg-primary/10 border border-primary/20 p-4">
                  <p class="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Registrados</p>
                  <p class="text-2xl font-black tabular-nums text-slate-900">3.847</p>
                  <p class="text-[10px] text-primary font-semibold">+128 esta semana</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-4">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recurrencia</p>
                  <p class="text-2xl font-black tabular-nums text-slate-900">2.4×</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-white p-4">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">VIP Oro</p>
                  <p class="text-2xl font-black tabular-nums text-slate-900">142</p>
                </div>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white">
                <div class="px-4 py-3 border-b border-slate-100">
                  <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Clientes top</span>
                </div>
                <ul class="divide-y divide-slate-100">
                  <li v-for="c in topCustomers" :key="c.name" class="flex items-center gap-3 px-4 py-3">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0" :class="c.color">{{ c.emoji }}</div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-slate-900 leading-tight truncate">{{ c.name }}</p>
                      <p class="text-[10px] text-slate-500 mt-0.5">{{ c.orders }} pedidos</p>
                    </div>
                    <span class="text-sm font-black tabular-nums text-emerald-600 shrink-0">USD {{ c.ltv.toLocaleString('es-AR') }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- CAMPAÑAS -->
            <div v-else-if="activeTab === 'campaigns'" key="campaigns" class="space-y-3">
              <div v-for="campaign in campaigns" :key="campaign.title" class="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <component :is="campaign.icon" class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-900 leading-tight">{{ campaign.title }}</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">{{ campaign.audience }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-sm font-black text-slate-900 tabular-nums">{{ campaign.openRate }}%</p>
                  <p class="text-[10px] text-slate-400">Apertura</p>
                </div>
              </div>
            </div>

            <!-- LOYALTY -->
            <div v-else-if="activeTab === 'loyalty'" key="loyalty" class="space-y-5">
              <div class="rounded-2xl bg-gradient-to-br from-primary to-[#3c1fc9] text-white p-5 relative overflow-hidden">
                <div class="absolute right-4 top-4 w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                  <Crown class="w-6 h-6 text-amber-900" />
                </div>
                <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Programa de fidelización</p>
                <p class="text-xl font-black mb-1">Club demo</p>
                <p class="text-xs text-white/80 leading-relaxed">3 niveles · puntos por pedido · cupones de cumpleaños</p>
              </div>
              <div class="grid grid-cols-3 gap-2.5">
                <div v-for="tier in loyaltyTiers" :key="tier.name" class="rounded-xl border border-slate-200 bg-white p-3 text-center">
                  <div class="w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2" :class="tier.bg">
                    <component :is="tier.icon" class="w-4 h-4" :class="tier.iconColor" />
                  </div>
                  <p class="text-xs font-bold text-slate-900">{{ tier.name }}</p>
                  <p class="text-[10px] text-slate-500 mt-0.5">{{ tier.count }} clientes</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- CTA principal: activación -->
      <div class="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent p-6 sm:p-8 text-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 mb-3">
          ¿Te gusta lo que ves?<br />
          <span class="text-primary italic font-light">Activá tu cuenta con tus datos reales.</span>
        </h2>
        <p class="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          14 días gratis con MercadoPago. Cancelás en 1 click hasta el día 15,
          sin cargos ni preguntas.
        </p>
        <RouterLink
          :to="{ path: '/comenzar', query: { from: 'public_demo' } }"
          @click="trackActivateClick('hero_block')"
          class="group inline-flex items-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-7 py-4 text-sm transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          Empezar mi trial de 14 días
          <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </RouterLink>
        <p class="text-[11px] text-slate-400 mt-4">
          14 días gratis · Setup en menos de 30 min · Acceso al CSM
        </p>
      </div>
    </main>

    <!-- Sticky CTA al final, fijado al fondo de la viewport -->
    <div class="sticky bottom-0 bg-white border-t border-slate-200 px-4 sm:px-6 py-3 z-30">
      <div class="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <p class="text-xs sm:text-sm text-slate-600 font-medium hidden sm:block">
          <span class="font-bold text-slate-900">Querés tus datos acá?</span>
          Activá tu cuenta en menos de 5 min.
        </p>
        <p class="text-xs text-slate-600 font-medium sm:hidden flex-1">
          ¿Querés esto para tu marca?
        </p>
        <RouterLink
          :to="{ path: '/comenzar', query: { from: 'public_demo' } }"
          @click="trackActivateClick('sticky_bottom')"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary hover:bg-[#3c1fc9] text-white text-xs sm:text-sm font-bold transition-colors shrink-0"
        >
          Activar mi cuenta
          <ArrowRight class="w-3 h-3" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Lock, BarChart3, Users, Megaphone, Crown, Star, Award,
  Send, MessageCircle, Sparkles, ArrowRight,
} from 'lucide-vue-next'
import { trackEvent } from '@/utils/analytics'

const tabs = [
  { key: 'sales', label: 'Ventas', icon: BarChart3 },
  { key: 'customers', label: 'Clientes', icon: Users },
  { key: 'campaigns', label: 'Campañas', icon: Megaphone },
  { key: 'loyalty', label: 'Fidelización', icon: Crown },
]
const activeTab = ref('sales')

const salesKpis = [
  { label: 'Facturación', value: 'USD 3.165', delta: '+8.4%' },
  { label: 'Pedidos', value: '207', delta: '+12 (6%)' },
  { label: 'Ticket prom', value: 'USD 14.92', delta: '+1.2%' },
  { label: 'Nuevos', value: '38', delta: '+5' },
]

const salesByChannel = [
  { name: 'Salón', pct: 85, amount: 1342, color: 'bg-primary' },
  { name: 'Take Away', pct: 62, amount: 985, color: 'bg-violet-400' },
  { name: 'Delivery', pct: 45, amount: 712, color: 'bg-emerald-500' },
  { name: 'Mostrador', pct: 8, amount: 126, color: 'bg-amber-400' },
]

const topCustomers = [
  { name: 'María González', emoji: '👩‍🦰', orders: 47, ltv: 1842, color: 'bg-rose-100' },
  { name: 'Lautaro Sosa', emoji: '🧑‍💻', orders: 38, ltv: 1421, color: 'bg-violet-100' },
  { name: 'Agustina Robles', emoji: '👩‍🎓', orders: 32, ltv: 1187, color: 'bg-sky-100' },
  { name: 'Pablo Giménez', emoji: '🧑‍🍳', orders: 28, ltv: 968, color: 'bg-emerald-100' },
]

const campaigns = [
  { title: 'Bienvenida con 20% off', audience: 'Clientes nuevos', openRate: 68, icon: Send },
  { title: 'Recuperación 30 días', audience: 'Sin pedidos hace 30+ días', openRate: 54, icon: MessageCircle },
  { title: 'Cumpleaños · cupón gratis', audience: 'Auto · cumpleaños del mes', openRate: 82, icon: Sparkles },
]

const loyaltyTiers = [
  { name: 'Bronce', count: '2.341', bg: 'bg-amber-100', icon: Star, iconColor: 'text-amber-600' },
  { name: 'Plata', count: '1.364', bg: 'bg-slate-200', icon: Award, iconColor: 'text-slate-600' },
  { name: 'Oro', count: '142', bg: 'bg-amber-300', icon: Crown, iconColor: 'text-amber-800' },
]

function trackActivateClick(location) {
  trackEvent('public_demo_activate_click', { location })
}

onMounted(() => {
  // SEO: la demo pública sí queremos que se indexe (es contenido de marketing).
  document.title = 'Demo del dashboard · Deenex'
  trackEvent('public_demo_viewed')
})
</script>

<style scoped>
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.18s ease;
}
.tab-enter-from,
.tab-leave-to {
  opacity: 0;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
