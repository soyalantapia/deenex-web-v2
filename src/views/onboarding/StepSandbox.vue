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
      Datos demo de una {{ industry.industry.value.label }} {{ industry.industry.value.emoji }} con
      <span class="font-bold text-slate-900">la marca {{ brandLabel }}</span>
      aplicada. Cuando actives, son los datos reales de tu operación.
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
            <!-- Botón "Recibir pedido demo" -->
            <div class="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-3 flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">
                ⚡
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-slate-900 leading-tight">Simulá un pedido en vivo</p>
                <p class="text-[10px] text-slate-500 leading-snug">
                  Tocá el botón y vas a ver cómo entra al dashboard.
                </p>
              </div>
              <button
                type="button"
                @click="simulateOrder"
                :disabled="simulating"
                class="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold whitespace-nowrap hover:bg-[#3c1fc9] transition-colors shadow-sm shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="simulating" class="inline-flex items-center gap-1.5">
                  <span class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Procesando…
                </span>
                <span v-else>Recibir pedido demo →</span>
              </button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="kpi in salesKpis"
                :key="kpi.label"
                class="rounded-xl border border-slate-200 bg-white p-3 relative overflow-hidden transition-all"
                :class="kpi.flashing ? 'border-emerald-400 bg-emerald-50/40' : ''"
              >
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{{ kpi.label }}</p>
                <p class="text-lg font-black tabular-nums text-slate-900">{{ kpi.value }}</p>
                <p class="text-[10px] font-semibold mt-0.5" :class="kpi.delta.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'">
                  {{ kpi.delta }} vs ayer
                </p>
              </div>
            </div>

            <!-- Pedido más reciente (aparece al simular) -->
            <Transition name="order-pop">
              <div v-if="latestOrder" class="rounded-xl border-2 border-emerald-300 bg-emerald-50/60 p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <ShoppingBag class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-900 leading-tight">
                    Nuevo pedido · {{ latestOrder.customer }}
                  </p>
                  <p class="text-[11px] text-slate-500 leading-snug">
                    {{ latestOrder.items.join(' · ') }} · {{ latestOrder.channel }}
                  </p>
                </div>
                <span class="text-base font-black text-emerald-600 tabular-nums shrink-0">
                  USD {{ latestOrder.total }}
                </span>
              </div>
            </Transition>
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
              <p class="text-xl font-black mb-1">Club {{ brandLabel }}</p>
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
  Send, MessageCircle, Sparkles, ShoppingBag,
} from 'lucide-vue-next'
import StepActions from '@/components/onboarding/StepActions.vue'
import { useOnboarding } from '@/composables/useOnboarding'
import { useIndustry } from '@/composables/useIndustry'

const router = useRouter()
const onboarding = useOnboarding()
const industry = useIndustry()

const brandLabel = computed(() => onboarding.state.business.brand || 'Tu marca')

const tabs = [
  { key: 'sales', label: 'Ventas', icon: BarChart3 },
  { key: 'customers', label: 'Clientes', icon: Users },
  { key: 'campaigns', label: 'Campañas', icon: Megaphone },
  { key: 'loyalty', label: 'Fidelización', icon: Crown },
]
const activeTab = ref('sales')

// Datos demo seedeados — los KPIs ahora son reactivos para reflejar el
// "pedido en vivo" que simula el lead. Cada KPI tiene un `flashing` que
// se enciende brevemente cuando entra un pedido nuevo.
const salesKpis = ref([
  { label: 'Facturación', value: 'USD 3.165', delta: '+8.4%', flashing: false, raw: 3165 },
  { label: 'Pedidos', value: '207', delta: '+12 (6%)', flashing: false, raw: 207 },
  { label: 'Ticket prom', value: 'USD 14.92', delta: '+1.2%', flashing: false, raw: 14.92 },
  { label: 'Nuevos', value: '38', delta: '+5', flashing: false, raw: 38 },
])

// Pedido demo más reciente (aparece animado abajo de los KPIs)
const latestOrder = ref(null)
const simulating = ref(false)

// Demo orders se obtienen del industry resolver — adaptados al rubro real
// del lead (empanadas → empanadas, sushi → sushi, etc).
const DEMO_ORDERS = computed(() => industry.industry.value.sampleOrders)

async function simulateOrder() {
  simulating.value = true
  // Pequeño delay para que se sienta como una operación real
  await new Promise((r) => setTimeout(r, 850))

  const orders = DEMO_ORDERS.value
  const pick = orders[Math.floor(Math.random() * orders.length)]
  latestOrder.value = pick

  // Actualizamos los KPIs como reaccionarían en producción real.
  const k = salesKpis.value
  k[0].raw += pick.total
  k[0].value = `USD ${k[0].raw.toLocaleString('es-AR')}`
  k[1].raw += 1
  k[1].value = String(k[1].raw)
  k[2].raw = k[0].raw / k[1].raw
  k[2].value = `USD ${k[2].raw.toFixed(2)}`
  if (Math.random() < 0.3) {
    k[3].raw += 1
    k[3].value = String(k[3].raw)
  }

  // Flash visual de KPIs
  k.forEach((kpi) => (kpi.flashing = true))
  setTimeout(() => {
    k.forEach((kpi) => (kpi.flashing = false))
  }, 1400)

  simulating.value = false
  onboarding.track('sandbox_order_simulated', { total: pick.total, channel: pick.channel })
}

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

// Campaigns también vienen del industry resolver — adaptadas al rubro.
const ICON_BY_INDEX = [Send, MessageCircle, Sparkles]
const campaigns = computed(() =>
  industry.industry.value.sampleCampaigns.map((c, i) => ({
    ...c,
    status: c.status || 'active',
    icon: ICON_BY_INDEX[i] || Send,
  }))
)

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

/* Pop animation para el nuevo pedido que entra al dashboard */
.order-pop-enter-active {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.order-pop-leave-active {
  transition: all 0.25s ease;
}
.order-pop-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.92);
}
.order-pop-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
