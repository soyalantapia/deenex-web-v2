<template>
  <div>
    <!-- Confetti cañón doble — solo cuando no es Enterprise -->
    <ConfettiCanvas v-if="!isEnterprise && playConfetti" :duration="3500" :particle-count="160" />

    <!-- Header con check + sparks -->
    <div class="relative mb-8">
      <div class="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6 relative">
        <Check class="w-8 h-8 text-white" stroke-width="3" />
        <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
        <span class="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary animate-ping" style="animation-delay: 0.4s"></span>
      </div>

      <p class="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
        ¡Listo! · Paso 6 de 6
      </p>

      <h1 v-if="isEnterprise" class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
        <template v-if="onboarding.greeting.value">{{ onboarding.greeting.value }}, tu solicitud<br /></template>
        <template v-else>Tu solicitud </template>Enterprise<br />
        <span class="text-primary italic font-light">ya está en revisión.</span>
      </h1>
      <h1 v-else class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
        <template v-if="onboarding.greeting.value">¡Listo, {{ onboarding.greeting.value }}!<br /></template>
        <template v-else>Tu cuenta está activa.<br /></template>
        <span class="text-primary italic font-light">Empezás a operar ahora.</span>
      </h1>

      <p v-if="isEnterprise" class="text-base text-slate-500 leading-relaxed max-w-md">
        Un Account Executive de Deenex te va a contactar en menos de 24 horas
        por WhatsApp al
        <span class="font-semibold text-slate-900">{{ onboarding.state.identity.whatsapp }}</span>.
      </p>
      <p v-else class="text-base text-slate-500 leading-relaxed max-w-md">
        Te mandamos las credenciales por email a
        <span class="font-semibold text-slate-900">{{ onboarding.state.identity.email }}</span>.
        Entrá al dashboard y configuremos tu marca juntos.
      </p>
    </div>

    <!-- Next steps — cada uno linkea al app a la sección concreta -->
    <div v-if="!isEnterprise" class="space-y-3 mb-8">
      <p class="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
        Lo que sigue · Tenés 15 días para configurar todo
      </p>
      <a
        v-for="(step, i) in nextSteps"
        :key="step.title"
        :href="`${dashboardUrl}${step.path}`"
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

    <!-- CTAs -->
    <div v-if="!isEnterprise" class="flex flex-col sm:flex-row gap-3 mb-8">
      <a
        :href="dashboardUrl"
        @click="trackDashboardClick"
        class="group flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-6 py-4 text-sm transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
      >
        Ir al dashboard
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

    <!-- Refer-a-friend block ────────────────────────────────────────── -->
    <div v-if="!isEnterprise" class="relative rounded-3xl border-2 border-dashed border-primary/30 bg-primary/[0.02] p-6 mb-4">
      <div class="absolute -top-3 left-6 bg-white px-3 py-0.5 text-[10px] font-black text-primary uppercase tracking-widest rounded-full border border-primary/30">
        Beneficio mutuo
      </div>
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0 text-2xl">
          🎁
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold text-slate-900 leading-tight mb-1">
            ¿Conocés otra marca que sufre con apps de terceros?
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed mb-4">
            Invitalos con tu link personal: cuando activan, vos sumás
            <span class="font-bold text-emerald-600">1 mes gratis</span>
            y ellos arrancan con
            <span class="font-bold text-emerald-600">25% off</span>
            sobre el primer mes.
          </p>
          <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <code class="flex-1 text-xs font-mono text-slate-600 truncate">{{ referralLink }}</code>
            <button
              type="button"
              @click="copyReferral"
              class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md transition-colors shrink-0"
              :class="copied ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-[#3c1fc9]'"
            >
              {{ copied ? '¡Copiado!' : 'Copiar' }}
            </button>
          </div>
          <div class="flex items-center gap-2 mt-3">
            <a
              :href="whatsappShareUrl"
              target="_blank"
              rel="noopener"
              @click="trackShare('whatsapp')"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <MessageCircle class="w-3 h-3" />
              Compartir por WhatsApp
            </a>
            <span class="w-px h-3 bg-slate-200"></span>
            <a
              :href="emailShareUrl"
              @click="trackShare('email')"
              class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <Mail class="w-3 h-3" />
              Compartir por email
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Enterprise CTA -->
    <div v-else>
      <a
        :href="calendarUrl"
        target="_blank"
        rel="noopener"
        class="group w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-6 py-4 text-sm transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
      >
        <CalendarDays class="w-3.5 h-3.5" />
        Agendar reunión ahora
      </a>
    </div>

    <!-- Reset hint para devs -->
    <p class="mt-10 text-[11px] text-slate-300 leading-relaxed">
      ¿Querés empezar de nuevo?
      <button
        type="button"
        @click="onReset"
        class="underline hover:text-slate-500 transition-colors"
      >
        Borrar mi progreso
      </button>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, CalendarDays, ArrowRight, MessageCircle, Mail } from 'lucide-vue-next'
import ConfettiCanvas from '@/components/onboarding/ConfettiCanvas.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const route = useRoute()
const router = useRouter()
const onboarding = useOnboarding()

const isEnterprise = computed(() => {
  return route.query.enterprise === '1' || onboarding.state.plan.key === 'enterprise'
})

// URLs del entorno
const dashboardUrl = import.meta.env.VITE_APP_DASHBOARD_URL || 'https://app.deenex.tech'
const calendarUrl = import.meta.env.VITE_CALENDAR_URL || '#'

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

// ── Referral ─────────────────────────────────────────────────────────────
const referralCode = computed(() => {
  // Código simple basado en el subdomain del lead. En producción esto vendría
  // de la API con un ID único por cuenta.
  const slug = onboarding.subdomainPreview.value
  return slug && slug !== 'tu-marca' ? slug : 'amigo'
})
const referralLink = computed(() => `https://deenex.tech/r/${referralCode.value}`)
const copied = ref(false)
async function copyReferral() {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    onboarding.track('referral_copied', { code: referralCode.value })
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Clipboard fallido — UX queda igual, no rompemos nada.
  }
}
const whatsappShareUrl = computed(() => {
  const text = `Hola! Estoy probando Deenex y me parece muy útil para marcas gastronómicas. Te dejo mi link de referido, arrancás con 25% off el primer mes: ${referralLink.value}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
})
const emailShareUrl = computed(() => {
  const subject = 'Probá Deenex con 25% off el primer mes'
  const body = `Estoy probando Deenex y me parece muy útil para marcas gastronómicas. Te dejo mi link de referido, arrancás con 25% off el primer mes: ${referralLink.value}`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
})
function trackShare(channel) {
  onboarding.track('referral_share', { channel, code: referralCode.value })
}

const playConfetti = ref(false)

onMounted(() => {
  if (isEnterprise.value) {
    onboarding.track('enterprise_request_submitted', {
      locations: onboarding.state.business.locations,
    })
  } else {
    onboarding.track('welcome_viewed', {
      plan: onboarding.state.plan.key,
    })
    // Pequeño delay para que el confetti dispare después del paint inicial.
    setTimeout(() => {
      playConfetti.value = true
    }, 200)
  }
})

function trackDashboardClick() {
  onboarding.track('dashboard_click', { from: 'welcome' })
}

function trackCsmClick() {
  onboarding.track('csm_click', { from: 'welcome' })
}

function onReset() {
  if (confirm('¿Borrás todo el progreso del onboarding?')) {
    onboarding.reset()
    router.push('/comenzar')
  }
}
</script>
