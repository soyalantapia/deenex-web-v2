<template>
  <div>
    <!-- Wow-moment-first: ActivationOverlay corre al mount cuando el lead
         llega desde Plan sin tarjeta. Cuando termina (~13s), onProvisioning
         Complete marca el trial activado y revela el welcome content. -->
    <ActivationOverlay
      v-if="!isEnterprise"
      :show="!provisioningDone"
      :brand="onboarding.state.business.brand || 'tu marca'"
      :subdomain="onboarding.subdomainPreview.value"
      @complete="onProvisioningComplete"
    />

    <!-- Confetti cañón doble, solo cuando no es Enterprise -->
    <ConfettiCanvas v-if="!isEnterprise && playConfetti" :duration="3500" :particle-count="160" />

    <!-- Header con check + sparks -->
    <div class="relative mb-8">
      <div class="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6 relative">
        <Check class="w-8 h-8 text-white" stroke-width="3" />
        <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
        <span class="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary animate-ping" style="animation-delay: 0.4s"></span>
      </div>

      <p class="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
        ¡Listo! · Paso 5 de 5
      </p>

      <h1 v-if="isEnterprise" class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
        <template v-if="onboarding.greeting.value">{{ onboarding.greeting.value }}, tu solicitud<br /></template>
        <template v-else>Tu solicitud </template>Enterprise<br />
        <span class="text-primary italic font-light">ya está en revisión.</span>
      </h1>
      <h1 v-else class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
        <template v-if="onboarding.state.business.brand">
          {{ onboarding.state.business.brand }}<br />
        </template>
        <template v-else>Tu marca<br /></template>
        <span class="text-primary italic font-light">ya está viva.</span>
      </h1>

      <p v-if="isEnterprise" class="text-base text-slate-500 leading-relaxed max-w-md">
        Un Account Executive de Deenex te va a contactar en menos de 24 horas
        <template v-if="onboarding.state.identity.whatsapp">
          por WhatsApp al
          <span class="font-semibold text-slate-900">{{ onboarding.state.identity.whatsapp }}</span>.
        </template>
        <template v-else-if="onboarding.state.identity.email">
          por email a
          <span class="font-semibold text-slate-900">{{ onboarding.state.identity.email }}</span>.
        </template>
        <template v-else>
          para coordinar la implementación.
        </template>
      </p>
      <!-- Wow-moment-first: subdomain prominente como prueba de valor real. -->
      <div v-else class="space-y-3 max-w-md">
        <a
          :href="`https://${onboarding.subdomainPreview.value}.deenex.app`"
          target="_blank"
          rel="noopener"
          @click="trackBrandUrlClick"
          class="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 transition-colors"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
          <code class="text-sm font-mono font-bold text-emerald-700">
            {{ onboarding.subdomainPreview.value }}.deenex.app
          </code>
          <ArrowRight class="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </a>
        <p class="text-base text-slate-500 leading-relaxed">
          Tu app respondiendo en vivo. Compartila con tus clientes ahora —
          el dashboard te espera para cargar el menú y empezar a recibir pedidos.
        </p>
      </div>
    </div>

    <!-- Trial info, descriptivo, no agresivo. Wow-moment-first: el lead arrancó
         SIN tarjeta. La tarjeta se pide en el dashboard cuando intente activar
         cobros reales (decisión producto). Acá solo mostramos: hasta cuándo es
         gratis explorar, y qué hace falta para vender. -->
    <div v-if="!isEnterprise" class="rounded-2xl bg-slate-50 border border-slate-200 p-5 mb-6">
      <div class="flex items-start gap-4">
        <Clock class="w-7 h-7 text-primary shrink-0 mt-0.5" />
        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            Tu trial sin tarjeta es hasta el
          </p>
          <p class="text-base font-bold text-slate-900 leading-tight">
            {{ onboarding.firstChargeDateFormatted.value }}
          </p>
          <p class="text-xs text-slate-500 leading-snug mt-1">
            Hasta esa fecha podés cargar menú, configurar branding y probar
            pedidos en modo demo. Cancelás en 1 click cuando quieras.
          </p>
        </div>
      </div>
      <!-- Lo que viene cuando estés listo para vender. Sin presión upfront. -->
      <div class="mt-4 pt-4 border-t border-slate-200/70 flex items-baseline justify-between gap-3">
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            Para empezar a vender
          </p>
          <p class="text-sm text-slate-700">
            <span class="font-semibold">Agregás tarjeta cuando actives cobros</span>
            <span class="text-slate-300 mx-1.5">·</span>
            <span class="text-slate-500">{{ planSummary.commissionPct }}% solo en delivery</span>
          </p>
        </div>
        <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest whitespace-nowrap">
          {{ daysUntilFirstCharge }} días gratis
        </span>
      </div>
    </div>

    <!-- Next steps, cada uno linkea al app a la sección concreta -->
    <div v-if="!isEnterprise" class="space-y-3 mb-8">
      <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
        Lo que sigue · Tenés 14 días para configurar todo
      </p>
      <a
        v-for="(step, i) in nextSteps"
        :key="step.title"
        :href="buildDashboardLink(step.path)"
        @click="trackNextStepClick(step.key)"
        class="group border border-slate-200 rounded-2xl p-5 flex items-start gap-4 hover:border-primary hover:bg-primary/[0.02] transition-colors"
      >
        <div class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
          {{ i + 1 }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-900 leading-tight mb-1 flex items-center gap-2">
            {{ step.title }}
            <ArrowRight class="w-3 h-3 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </p>
          <p class="text-xs text-slate-500 leading-relaxed">{{ step.desc }}</p>
        </div>
        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mt-1 whitespace-nowrap">
          ~{{ step.time }}
        </span>
      </a>
    </div>

    <!-- Provisioning checklist, qué pasa después que el lead activó.
         Mostramos un counter "N/4" + barra de progreso para que el lead
         entienda al toque que es un proceso de ~4 pasos finitos, no un
         "loading infinito" ansiogénico. -->
    <div v-if="!isEnterprise" class="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 mb-6">
      <div class="flex items-center justify-between mb-3 gap-3">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Estado de tu cuenta
        </p>
        <p class="text-[10px] font-black uppercase tracking-widest tabular-nums shrink-0"
          :class="provisioningComplete ? 'text-emerald-600' : 'text-primary'">
          {{ provisioningProgress.done }}/{{ provisioningProgress.total }} listos
        </p>
      </div>
      <!-- Progress bar -->
      <div class="h-1 rounded-full bg-slate-200 overflow-hidden mb-4">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="provisioningComplete ? 'bg-emerald-500' : 'bg-primary'"
          :style="{ width: provisioningProgress.pct + '%' }"
        ></div>
      </div>
      <ul class="space-y-2.5">
        <li
          v-for="task in provisioningTasks"
          :key="task.label"
          class="flex items-center gap-3 text-sm"
        >
          <span
            class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
            :class="task.status === 'done'
              ? 'bg-emerald-500'
              : task.status === 'doing'
                ? 'bg-primary/10'
                : 'bg-slate-200'"
          >
            <Check v-if="task.status === 'done'" class="w-3 h-3 text-white" stroke-width="3" />
            <span
              v-else-if="task.status === 'doing'"
              class="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin"
            ></span>
          </span>
          <span :class="task.status === 'done' ? 'text-slate-900 font-semibold' : task.status === 'doing' ? 'text-slate-700' : 'text-slate-400'">
            {{ task.label }}
          </span>
        </li>
      </ul>
      <p v-if="provisioningTasks.every(t => t.status === 'done')" class="mt-4 pt-4 border-t border-slate-200/70 text-xs text-emerald-600 font-bold">
        ✓ Listo. Te mandamos un magic link a {{ onboarding.state.identity.email }} para entrar al dashboard.
      </p>
    </div>

    <!-- CTAs -->
    <div v-if="!isEnterprise" class="flex flex-col sm:flex-row gap-3 mb-8">
      <button
        v-if="!provisioningComplete"
        type="button"
        disabled
        class="group flex-1 inline-flex items-center justify-center gap-2 bg-slate-200 text-slate-500 font-bold rounded-xl px-6 py-4 text-sm cursor-not-allowed"
      >
        <span class="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
        <span>Preparando tu dashboard… <span class="tabular-nums opacity-70">{{ provisioningProgress.done }}/{{ provisioningProgress.total }}</span></span>
      </button>
      <a
        v-else
        :href="dashboardUrl"
        @click="trackDashboardClick"
        class="group flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-6 py-4 text-sm transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
      >
        Entrar al dashboard
        <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </a>
      <a
        :href="calendarUrl"
        target="_blank"
        rel="noopener"
        @click="trackCsmClick"
        class="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-semibold rounded-xl px-6 py-4 text-sm transition-colors"
      >
        <CalendarDays class="w-3.5 h-3.5" />
        Agendar Customer Success
      </a>
    </div>

    <!-- Email verification reminder + preview del email que llega -->
    <div v-if="!isEnterprise" class="rounded-xl border border-amber-200 bg-amber-50/40 overflow-hidden mb-8">
      <div class="p-4 flex items-start gap-3">
        <Mail class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div class="min-w-0 flex-1">
          <!-- Antes el copy era "Confirmá tu email para acceder", lo que
               implicaba que el lead NO podía entrar al dashboard sin clickear
               el link. Pero el botón grande arriba dice "Entrar al dashboard"
               y ese ya logea automáticamente vía session token. Cambiamos a un
               recordatorio sin tono de gating — el lead puede entrar ahora Y
               desde el link del email después si vuelve. -->
          <p class="text-xs font-bold text-slate-900 leading-tight">
            Guardá el link en tu email para volver
          </p>
          <p class="text-[11px] text-slate-500 leading-snug mt-1">
            Te lo mandamos a <span class="font-semibold text-slate-700">{{ onboarding.state.identity.email }}</span>
            así podés entrar al dashboard cuando quieras, desde cualquier dispositivo.
            Si no lo ves, revisá spam o
            <button type="button" @click="resendMagicLink" class="text-amber-700 font-semibold underline hover:text-amber-900">
              reenviá el link
            </button>.
          </p>
        </div>
        <button
          type="button"
          @click="emailPreviewOpen = !emailPreviewOpen"
          class="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          {{ emailPreviewOpen ? 'Ocultar' : 'Ver preview' }}
        </button>
      </div>
      <!-- Preview del email, colapsable -->
      <Transition name="email-preview">
        <div v-if="emailPreviewOpen" class="border-t border-amber-200 bg-white p-4 text-xs">
          <div class="rounded-lg border border-slate-200 overflow-hidden">
            <div class="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <div class="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-white text-[8px] font-black">D</div>
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold text-slate-900 truncate">Tu cuenta de Deenex está lista</p>
                <p class="text-[9px] text-slate-500 truncate">de Deenex &lt;{{ CONTACT_EMAIL }}&gt; a {{ onboarding.state.identity.email }}</p>
              </div>
            </div>
            <div class="p-4 text-[11px] text-slate-700 leading-relaxed">
              <p class="font-bold text-slate-900 mb-2">¡Hola {{ onboarding.greeting.value || 'amigo' }}!</p>
              <p class="mb-3">Tu cuenta de Deenex para <strong>{{ onboarding.state.business.brand }}</strong> está activa. Entrá al dashboard con un click:</p>
              <div class="bg-primary text-white text-center px-4 py-2 rounded-lg text-[10px] font-bold mb-3">
                → Entrar a {{ onboarding.subdomainPreview.value }}.deenex.app
              </div>
              <p class="text-[10px] text-slate-500">El link expira en 24h. Si no lo pediste, ignorá este mail.</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Refer-a-friend block REMOVIDO de StepWelcome — se movió al admin como
         widget sticky bottom-left (ReferralWidget). Razón: el wow moment del
         welcome es "tu marca está viva + auto-redirect al dashboard". El
         referral aparece DESPUÉS dentro del admin, siempre disponible. -->

    <!-- Auto-redirect notice: indica que vamos a llevarlo al admin en X segs -->
    <div v-if="!isEnterprise && provisioningDone" class="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 mb-4 flex items-center gap-3">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" aria-hidden="true"></span>
      <p class="text-sm text-slate-700 leading-snug flex-1">
        <span class="font-bold text-emerald-700">Te llevamos a tu dashboard</span>
        en 5 segundos. O entrá ahora con el botón de abajo.
      </p>
    </div>

    <!-- Enterprise CTA: ofrecemos DOS canales (calendar + WhatsApp) porque
         el lead high-value puede preferir agendar O chatear ahora. Antes solo
         estaba el calendar; si el lead no le gusta agendar, se nos iba.
         WhatsApp pre-rellena con marca/locales/email para que el AE arranque
         con contexto en lugar de "hola, ¿quién sos?". -->
    <div v-else class="flex flex-col sm:flex-row gap-3">
      <a
        :href="calendarUrl"
        target="_blank"
        rel="noopener"
        @click="trackEnterpriseCta('calendar')"
        class="group flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-6 py-4 text-sm transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
      >
        <CalendarDays class="w-3.5 h-3.5" />
        Agendar reunión ahora
      </a>
      <a
        :href="enterpriseWhatsappUrl"
        target="_blank"
        rel="noopener"
        @click="trackEnterpriseCta('whatsapp')"
        class="group flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-6 py-4 text-sm transition-all shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
      >
        <MessageCircle class="w-3.5 h-3.5" />
        Chatear por WhatsApp
      </a>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Check, CalendarDays, ArrowRight, MessageCircle, Mail, Clock } from 'lucide-vue-next'
import ConfettiCanvas from '@/components/onboarding/ConfettiCanvas.vue'
import ActivationOverlay from '@/components/onboarding/ActivationOverlay.vue'
import { useOnboarding } from '@/composables/useOnboarding'
import { CONTACT_EMAIL, whatsappLink } from '@/utils/contact'

const route = useRoute()
const onboarding = useOnboarding()

const isEnterprise = computed(() => {
  return route.query.enterprise === '1' || onboarding.state.plan.key === 'enterprise'
})

// URLs del entorno. El default apunta al admin de desarrollo (que YA tiene el
// branding multi-tenant funcionando). Cuando exista app.deenex.tech con session
// handoff propio, podemos cambiar la default. Por env: VITE_APP_DASHBOARD_URL.
const DASHBOARD_BASE = import.meta.env.VITE_APP_DASHBOARD_URL || 'https://administrador.desarrollo.deenex.tech'
// Fallback: si no hay calendar URL configurado (dev local sin .env), caemos a
// WhatsApp en vez de a "#" (anchor vacío que dejaba al lead bailando).
const calendarUrl = import.meta.env.VITE_CALENDAR_URL || whatsappLink(
  'Hola! Vengo del onboarding y quería agendar una reunión con el equipo de Deenex.',
)

// WhatsApp pre-rellenado para Enterprise: incluye marca + locales + email para
// que el AE arranque la conversación con contexto, no preguntando datos básicos.
const enterpriseWhatsappUrl = computed(() => {
  const brand = onboarding.state.business.brand || 'mi marca'
  const locations = onboarding.state.business.locations || '?'
  const email = onboarding.state.identity.email || ''
  const lines = [
    `Hola! Soy ${onboarding.greeting.value || 'lead Enterprise'} de ${brand}.`,
    `Acabo de completar el onboarding y mi solicitud es para Enterprise (${locations} locales).`,
    email ? `Mi email: ${email}` : null,
    `Me gustaría avanzar con la implementación, ¿podemos hablar?`,
  ].filter(Boolean)
  return whatsappLink(lines.join('\n'))
})

function trackEnterpriseCta(channel) {
  onboarding.track('enterprise_cta_click', {
    channel,
    locations: onboarding.state.business.locations,
    brand: onboarding.state.business.brand,
  })
}

// Session handoff: el dashboard espera un magic-link token en query para
// loguear al lead automáticamente. En producción este token lo emite el
// backend en /activate-trial; acá generamos un placeholder con email + nonce
// que el dashboard usa para hacer el lookup. Sin esto, el lead llega a
// app.deenex.tech y tiene que volver a poner email / pass (no existe pass).
const dashboardSessionToken = computed(() => {
  const email = onboarding.state.identity.email || ''
  const activatedAt = onboarding.state.trial.activatedAt || new Date().toISOString()
  // En producción: JWT firmado por el backend con TTL corto (10 min) que el
  // dashboard intercambia por una session cookie. Acá usamos base64 stub.
  if (typeof window === 'undefined') return ''
  try {
    return btoa(`${email}|${activatedAt}|magiclink`).replace(/[^A-Za-z0-9]/g, '').slice(0, 32)
  } catch {
    return ''
  }
})

const dashboardUrl = computed(() => {
  const base = DASHBOARD_BASE
  const tok = dashboardSessionToken.value
  if (!tok) return base
  // El dashboard parsea ?session=token y hace login automático.
  return `${base}?session=${tok}&from=onboarding`
})

// Helper para deep-links a settings/branding etc, preserva el token de sesión.
function buildDashboardLink(path) {
  const base = `${DASHBOARD_BASE}${path}`
  const tok = dashboardSessionToken.value
  if (!tok) return base
  const sep = path.includes('?') ? '&' : '?'
  return `${base}${sep}session=${tok}&from=onboarding`
}

const nextSteps = [
  {
    key: 'branding',
    title: 'Subí tu logo y colores',
    desc: 'Brandeamos automáticamente tu app, web y emails con tu identidad visual.',
    time: '2 min',
    path: '/settings/branding',
  },
  {
    key: 'menu',
    title: 'Importá tu menú',
    desc: 'Pegá desde Excel o subí un CSV. Te ayudamos a categorizar y precios.',
    time: '10 min',
    path: '/menu/import',
  },
  {
    key: 'delivery',
    title: 'Configurá tu zona de delivery',
    desc: 'Dibujás los polígonos directo sobre el mapa. Hasta 5 zonas por local.',
    time: '5 min',
    path: '/settings/delivery-zones',
  },
  {
    key: 'integrations',
    title: 'Conectá MercadoPago y WhatsApp',
    desc: 'Tokens en 1 click. Activamos cobros y notificaciones al instante.',
    time: '3 min',
    path: '/settings/integrations',
  },
]

function trackNextStepClick(key) {
  onboarding.track('next_step_click', { step: key })
}

// ── Referral REMOVIDO ─────────────────────────────────────────────────────
// El bloque "¿Conocés otra marca?" + sharing por WhatsApp/email + preview se
// movió al admin como widget sticky bottom-left (ReferralWidget). Razón: el
// welcome del web hace auto-redirect al dashboard a los 5s — el lead no
// tendría tiempo de interactuar con el referral acá. Adentro del admin queda
// siempre visible y accionable cuando el lead lo necesite.

// ── Resumen del plan + monto del próximo cargo ──────────────────────────
const planSummary = computed(() => {
  const key = onboarding.state.plan.key || onboarding.recommendedPlan.value.key
  const tier = onboarding.PLAN_TIERS.find((t) => t.key === key) || onboarding.recommendedPlan.value
  // Aplicamos descuento anual igual que en StepTrial para consistencia
  // del primer cargo mostrado al lead.
  if (onboarding.state.plan.billingCycle === 'annual' && tier.monthlyFee !== null) {
    return { ...tier, monthlyFee: Math.round(tier.monthlyFee * 0.8) }
  }
  return tier
})

const daysUntilFirstCharge = computed(() => {
  const diff = onboarding.firstChargeDate.value.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

// Email preview toggle
const emailPreviewOpen = ref(false)

const playConfetti = ref(false)

// Wow-moment-first: el ActivationOverlay corre ACÁ (en Welcome) en lugar de
// en StepTrial. Cuando el lead llega desde Plan, la cuenta NO está activada
// todavía → mostramos el overlay con los 7 sub-pasos animados. Cuando termina,
// marcamos el trial como activado SIN tarjeta (paymentChoice=null) y revelamos
// el welcome content. Si el lead llega a Welcome con trial ya activado (resume,
// refresh), saltamos el overlay y mostramos el welcome directo.
//
// Enterprise: siempre saltea el overlay — su flow es "solicitud en revisión",
// no activación inmediata.
const provisioningDone = ref(
  isEnterprise.value || !!onboarding.state.trial.activatedAt,
)

function onProvisioningComplete() {
  // markTrialActivated con (paymentChoice=null, paymentRef=null) significa
  // "trial activado sin tarjeta". El paywall vive ahora en el dashboard.
  onboarding.markTrialActivated(null, null)
  provisioningDone.value = true
  onboarding.track('provisioning_complete', {
    plan: onboarding.state.plan.key,
    flow: 'wow_moment_first',
  })
  // Confetti recién acá, después que el lead ve su URL viva (el wow moment real).
  setTimeout(() => { playConfetti.value = true }, 250)

  // Auto-redirect al admin (dashboard): le damos 5s al lead para que vea el
  // confetti + la URL viva ("Palta ya está viva"), después navegamos al admin
  // con el session token. El admin muestra su propio welcome overlay con la
  // URL del subdomain y el setup checklist (decisión de producto: el wow
  // continúa adentro del dashboard, no afuera).
  scheduleAutoRedirect()
}

// Lo guardamos en un ref para poder cancelarlo si el lead clickea manualmente
// "Entrar al dashboard" antes de los 5s — evita doble navegación.
let autoRedirectTimer = null
function scheduleAutoRedirect() {
  if (isEnterprise.value) return // Enterprise no auto-redirige (su flow es agendar)
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer)
  autoRedirectTimer = setTimeout(() => {
    onboarding.track('auto_redirect_to_dashboard', {
      from: 'welcome_provisioning_complete',
      subdomain: onboarding.subdomainPreview.value,
    })
    window.location.assign(dashboardUrl.value)
  }, 5000)
}

onUnmounted(() => {
  if (autoRedirectTimer) clearTimeout(autoRedirectTimer)
})

// ── Provisioning steps, mostrado como recap dentro de Welcome ──────────
// Lista visual de qué pasó durante el overlay, queda como confirmación
// post-activación. Antes vivía en StepTrial; ahora es decorativa porque el
// overlay completo ya hizo el trabajo visual.
const provisioningTasks = ref([
  { key: 'account', label: 'Cuenta creada y guardada', status: 'done' },
  { key: 'subdomain', label: `Reservamos ${onboarding.subdomainPreview.value}.deenex.app`, status: 'done' },
  { key: 'branding', label: 'Branding aplicado a tu app', status: 'done' },
  { key: 'magic', label: 'Magic link enviado por email', status: 'done' },
])

const provisioningComplete = computed(() =>
  provisioningTasks.value.every((t) => t.status === 'done')
)

// Progress visible, el lead ve "2/4 listos" + barra avanzando, mucho menos
// ansiógeno que un spinner indefinido.
const provisioningProgress = computed(() => {
  const total = provisioningTasks.value.length
  const done = provisioningTasks.value.filter((t) => t.status === 'done').length
  return { total, done, pct: Math.round((done / total) * 100) }
})

// startProvisioning() removido, el provisioning visual ahora lo hace
// ActivationOverlay en el step anterior (después de "Activar cuenta").
// Cuando el lead llega a Welcome todos los tasks están done desde el inicio.

function resendMagicLink() {
  onboarding.track('magic_link_resend_requested')
  // Stub: en producción POST /api/onboarding/magic-link/resend
  alert('Te reenviamos el magic link a ' + onboarding.state.identity.email)
}

onMounted(() => {
  if (isEnterprise.value) {
    onboarding.track('enterprise_request_submitted', {
      locations: onboarding.state.business.locations,
    })
    return
  }

  onboarding.track('welcome_viewed', {
    plan: onboarding.state.plan.key,
    flow: 'wow_moment_first',
    provisioning_already_done: provisioningDone.value,
  })

  // Si el lead llega con trial YA activado (resume / refresh dentro del welcome),
  // disparamos confetti directo, sin esperar el overlay.
  if (provisioningDone.value) {
    setTimeout(() => { playConfetti.value = true }, 200)
  }
  // Sino, el overlay se monta solo (v-if en template) y onProvisioningComplete
  // dispara el confetti cuando termine la animación de provisioning.
})

function trackDashboardClick() {
  onboarding.track('dashboard_click', { from: 'welcome' })
}

function trackCsmClick() {
  onboarding.track('csm_click', { from: 'welcome' })
}

function trackBrandUrlClick() {
  // El lead clickeó la URL viva de su marca — métrica core del wow moment.
  onboarding.track('brand_url_click', {
    subdomain: onboarding.subdomainPreview.value,
    from: 'welcome_header',
  })
}

</script>

<style scoped>
/* Colapsable del email preview, slide suave para no romper el reading flow. */
.email-preview-enter-active,
.email-preview-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.email-preview-enter-from,
.email-preview-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.email-preview-enter-to,
.email-preview-leave-from {
  opacity: 1;
  max-height: 400px;
}

/* Referral preview, slide+fade. max-height más alto porque incluye un mock hero. */
.referral-preview-enter-active,
.referral-preview-leave-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.referral-preview-enter-from,
.referral-preview-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.referral-preview-enter-to,
.referral-preview-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
