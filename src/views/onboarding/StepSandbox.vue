<template>
  <form @submit.prevent="onContinue">
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 4 de 6 · Vista previa
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      <template v-if="onboarding.greeting.value">{{ onboarding.greeting.value }}, así<br /></template>
      <template v-else>Así </template>se ve tu Deenex.<br />
      <span class="text-primary italic font-light">Tocá cualquier sección, es interactivo.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-6 max-w-md">
      Datos demo de un restaurante ficticio. Cuando actives tu cuenta, vas a ver
      <span class="font-bold text-slate-900">los datos reales de {{ onboarding.state.business.brand || 'tu marca' }}</span>
      con su branding aplicado.
    </p>

    <!-- Tour callout: aparece la primera vez que ven el sandbox -->
    <Transition name="tour">
      <div
        v-if="showTour"
        class="mb-5 rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3 relative"
      >
        <div class="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shrink-0 text-amber-950">
          👋
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900 leading-tight mb-1">
            Tour de 10 segundos
          </p>
          <p class="text-xs text-slate-600 leading-snug">
            Cambiá entre los 4 tabs de abajo para ver las distintas vistas de Deenex:
            <span class="font-semibold">Ventas</span> en tiempo real,
            <span class="font-semibold">Clientes</span> con su LTV,
            <span class="font-semibold">Campañas</span> automatizadas y
            <span class="font-semibold">Fidelización</span> por niveles.
          </p>
        </div>
        <button
          type="button"
          @click="dismissTour"
          class="text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors shrink-0"
          aria-label="Cerrar tour"
        >
          Entendido
        </button>
      </div>
    </Transition>

    <!-- Browser chrome mock -->
    <div class="rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden bg-white mb-8">
      <div class="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50/80">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        <div class="flex-1 mx-3 bg-white border border-slate-200 rounded-md px-3 py-0.5 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <Lock class="w-2.5 h-2.5" />
          {{ onboarding.subdomainPreview.value }}.deenex.app/dashboard
        </div>
        <span class="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
          Vista demo
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

      <!-- Tab content -->
      <div class="p-5 sm:p-7 min-h-[340px]">
        <Transition name="tab" mode="out-in">
          <!-- VENTAS -->
          <div v-if="activeTab === 'sales'" key="sales" class="space-y-5">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="kpi in salesKpis"
                :key="kpi.label"
                class="rounded-xl border border-slate-200 bg-white p-3"
              >
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{{ kpi.label }}</p>
                <p class="text-lg font-black tabular-nums text-slate-900">{{ kpi.value }}</p>
                <p class="text-[10px] font-semibold mt-0.5" :class="kpi.delta.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'">
                  {{ kpi.delta }} vs ayer
                </p>
              </div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Ventas por canal · Esta semana</span>
                <span class="text-[10px] text-slate-400 font-medium">7 días</span>
              </div>
              <div class="space-y-2.5">
                <div
                  v-for="ch in salesByChannel"
                  :key="ch.name"
                  class="flex items-center gap-3"
                >
                  <span class="text-xs font-semibold text-slate-600 w-24 shrink-0">{{ ch.name }}</span>
                  <div class="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all" :class="ch.color" :style="{ width: ch.pct + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold text-slate-900 tabular-nums w-20 text-right shrink-0">USD {{ ch.amount.toLocaleString('es-AR') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- CLIENTES -->
          <div v-else-if="activeTab === 'customers'" key="customers" class="space-y-5">
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
                <p class="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Clientes registrados</p>
                <p class="text-2xl font-black tabular-nums text-slate-900">3.847</p>
                <p class="text-[10px] text-primary font-semibold">+128 esta semana</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recurrencia</p>
                <p class="text-2xl font-black tabular-nums text-slate-900">2.4×</p>
                <p class="text-[10px] text-emerald-600 font-semibold">+0.6× vs ene</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top VIP</p>
                <p class="text-2xl font-black tabular-nums text-slate-900">142</p>
                <p class="text-[10px] text-slate-500">clientes nivel Oro</p>
              </div>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white">
              <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Clientes top</span>
                <span class="text-[10px] text-slate-400 font-medium">Por LTV</span>
              </div>
              <ul class="divide-y divide-slate-100">
                <li v-for="c in topCustomers" :key="c.name" class="flex items-center gap-3 px-4 py-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0" :class="c.color">
                    {{ c.emoji }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-900 leading-tight truncate">{{ c.name }}</p>
                    <p class="text-[10px] text-slate-500 mt-0.5">{{ c.orders }} pedidos · último: {{ c.last }}</p>
                  </div>
                  <span class="text-sm font-black tabular-nums text-emerald-600 shrink-0">USD {{ c.ltv.toLocaleString('es-AR') }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- CAMPAÑAS -->
          <div v-else-if="activeTab === 'campaigns'" key="campaigns" class="space-y-3">
            <div
              v-for="campaign in campaigns"
              :key="campaign.title"
              class="rounded-xl border p-4 flex items-center gap-4"
              :class="campaign.status === 'active' ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-white'"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                :class="campaign.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'"
              >
                <component :is="campaign.icon" class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-900 leading-tight">{{ campaign.title }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">{{ campaign.audience }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-black text-slate-900 tabular-nums">{{ campaign.openRate }}%</p>
                <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Apertura</p>
              </div>
              <span
                class="text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0"
                :class="campaign.status === 'active'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-500'"
              >
                {{ campaign.status === 'active' ? 'Live' : 'Borrador' }}
              </span>
            </div>
          </div>

          <!-- LOYALTY -->
          <div v-else-if="activeTab === 'loyalty'" key="loyalty" class="space-y-5">
            <div class="rounded-2xl bg-gradient-to-br from-primary via-primary to-[#3c1fc9] text-white p-5 relative overflow-hidden">
              <div class="absolute right-4 top-4 w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                <Crown class="w-6 h-6 text-amber-900" />
              </div>
              <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Programa de fidelización</p>
              <p class="text-xl font-black mb-1">Club {{ onboarding.state.business.brand || 'Palta' }}</p>
              <p class="text-xs text-white/80 leading-relaxed max-w-xs">
                3 niveles · puntos por pedido · cupones de cumpleaños · wallet personalizada.
              </p>
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

    <!-- Persuasion CTA -->
    <div class="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
      <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
        <Zap class="w-6 h-6 text-emerald-600" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold text-slate-900 leading-tight mb-1">
          ¿Te gusta lo que ves?
        </p>
        <p class="text-xs text-slate-500 leading-snug">
          Activá tu trial y empezás con tus datos reales en menos de 5 minutos.
          Los datos de esta demo se quedan acá.
        </p>
      </div>
    </div>

    <StepActions
      next-label="Quiero esto para mi marca"
      :disabled="false"
      @back="$router.push('/comenzar/plan')"
    />
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Lock, BarChart3, Users, Megaphone, Crown, Star, Award, Zap,
  Send, MessageCircle, Sparkles,
} from 'lucide-vue-next'
import StepActions from '@/components/onboarding/StepActions.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()

const tabs = [
  { key: 'sales', label: 'Ventas', icon: BarChart3 },
  { key: 'customers', label: 'Clientes', icon: Users },
  { key: 'campaigns', label: 'Campañas', icon: Megaphone },
  { key: 'loyalty', label: 'Fidelización', icon: Crown },
]
const activeTab = ref('sales')

// Datos demo seedeados — pensados para que se vean realistas pero claramente
// "demo" (la nota verde arriba es explícita).
const salesKpis = [
  { label: 'Facturación', value: 'USD 3.165', delta: '+8.4%' },
  { label: 'Pedidos', value: '207', delta: '+12 (6%)' },
  { label: 'Ticket prom', value: 'USD 14.92', delta: '+1.2%' },
  { label: 'Nuevos', value: '38', delta: '+5' },
]
const salesByChannel = [
  { name: 'Salón', pct: 85, amount: 1342, color: 'bg-primary' },
  { name: 'Take Away', pct: 62, amount: 985, color: 'bg-violet-400' },
  { name: 'Delivery propio', pct: 45, amount: 712, color: 'bg-emerald-500' },
  { name: 'Mostrador', pct: 8, amount: 126, color: 'bg-amber-400' },
]

const topCustomers = [
  { name: 'María González', emoji: '👩‍🦰', orders: 47, last: 'hoy', ltv: 1842, color: 'bg-rose-100' },
  { name: 'Lautaro Sosa', emoji: '🧑‍💻', orders: 38, last: 'ayer', ltv: 1421, color: 'bg-violet-100' },
  { name: 'Agustina Robles', emoji: '👩‍🎓', orders: 32, last: '2d', ltv: 1187, color: 'bg-sky-100' },
  { name: 'Pablo Giménez', emoji: '🧑‍🍳', orders: 28, last: '3d', ltv: 968, color: 'bg-emerald-100' },
]

const campaigns = [
  { title: 'Recuperación 30d sin compra', audience: '1.247 clientes · WhatsApp + Push', openRate: 68, status: 'active', icon: Send },
  { title: 'Combo fin de semana', audience: '3.847 clientes · Push notification', openRate: 41, status: 'active', icon: MessageCircle },
  { title: 'Cumpleaños del mes', audience: '124 clientes · Email', openRate: 0, status: 'draft', icon: Sparkles },
]

const loyaltyTiers = [
  { name: 'Bronce', count: '2.341', bg: 'bg-amber-100', icon: Star, iconColor: 'text-amber-600' },
  { name: 'Plata', count: '1.364', bg: 'bg-slate-200', icon: Award, iconColor: 'text-slate-600' },
  { name: 'Oro', count: '142', bg: 'bg-amber-300', icon: Crown, iconColor: 'text-amber-800' },
]

// Tour callout: solo aparece la primera vez. Lo persistimos en localStorage
// para que el lead que vuelve no lo vea de nuevo.
const TOUR_KEY = 'deenex_sandbox_tour_seen'
const showTour = ref(false)
onMounted(() => {
  if (typeof window !== 'undefined' && !localStorage.getItem(TOUR_KEY)) {
    showTour.value = true
  }
})
function dismissTour() {
  showTour.value = false
  try { localStorage.setItem(TOUR_KEY, '1') } catch {}
  onboarding.track('sandbox_tour_dismissed')
}

onboarding.track('sandbox_viewed', { brand: onboarding.state.business.brand })

function onContinue() {
  onboarding.track('sandbox_completed', {
    last_tab: activeTab.value,
  })
  // Marcamos el step como completado para que el router guard deje pasar a /activar
  if (!onboarding.state.meta.completedSteps.includes('preview')) {
    onboarding.state.meta.completedSteps.push('preview')
  }
  router.push('/comenzar/activar')
}
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
.tour-enter-active,
.tour-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.tour-enter-from,
.tour-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
