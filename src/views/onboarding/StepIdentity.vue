<template>
  <!-- Step Identity: inputs cortos (nombre, email, whatsapp), un max-w-xl
       local mantiene el form compacto aunque el layout permita full-width. -->
  <div class="max-w-xl">
    <ResumeModal
      :show="showResumeModal"
      :progress-summary="progressSummary"
      :total-steps="5"
      @resume="onResume"
      @start-over="onStartOver"
      @decline="showResumeModal = false"
    />
    <form @submit.prevent="onSubmit" novalidate v-autofocus>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Empezá gratis · Paso 1 de 5
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      Decinos quién sos.<br />
      <span class="text-primary italic font-light">Te lleva menos de un minuto.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-10 max-w-md">
      Lo usamos para crear tu cuenta y mandarte los datos de acceso por
      email y WhatsApp.
    </p>

    <div class="space-y-5">
      <Field
        v-model="form.fullName"
        label="Tu nombre"
        name="fullName"
        autocomplete="name"
        placeholder="Tu nombre completo"
        :error="errors.fullName"
        required
        @blur="validate('fullName')"
      />

      <Field
        v-model="form.email"
        label="Tu email"
        type="email"
        name="email"
        autocomplete="email"
        inputmode="email"
        placeholder="marcos@palta.com.ar"
        hint="Te mandamos el magic link acá. Si no es corporativo, igual sirve."
        :error="errors.email"
        required
        @blur="validate('email')"
      />

      <PhoneField
        v-model="form.whatsapp"
        label="WhatsApp"
        hint="Nuestro CSM te escribe en el primer día para ayudarte con el setup."
        :error="errors.whatsapp"
        required
        @blur="validate('whatsapp')"
        @country-change="validate('whatsapp')"
      />
    </div>

    <StepActions
      :show-back="false"
      next-label="Continuar"
      :disabled="!isFormValid"
      @back="$router.back()"
    />

    <p class="mt-6 text-[11px] text-slate-400 leading-relaxed">
      Al continuar aceptás nuestros
      <a href="/terminos" target="_blank" rel="noopener" class="underline hover:text-slate-600">términos</a>
      y la
      <a href="/privacidad" target="_blank" rel="noopener" class="underline hover:text-slate-600">política de privacidad</a>.
      Nunca compartimos tus datos.
    </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Field from '@/components/onboarding/Field.vue'
import PhoneField from '@/components/onboarding/PhoneField.vue'
import StepActions from '@/components/onboarding/StepActions.vue'
import ResumeModal from '@/components/onboarding/ResumeModal.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const route = useRoute()
const router = useRouter()
const onboarding = useOnboarding()

// Inicializamos con fullName si existe, o concatenando first+last del state viejo
// (para que leads que volvieron de una versión anterior no pierdan datos).
const initialFullName =
  onboarding.state.identity.fullName ||
  [onboarding.state.identity.firstName, onboarding.state.identity.lastName]
    .filter(Boolean)
    .join(' ')

const form = reactive({
  fullName: initialFullName,
  email: onboarding.state.identity.email,
  whatsapp: onboarding.state.identity.whatsapp,
})
const errors = reactive({ fullName: '', email: '', whatsapp: '' })

// ── Resume detection ─────────────────────────────────────────────────────
const showResumeModal = ref(false)

// Formatea "última actividad" eligiendo la mejor unidad (minuto/hora/día).
// Antes mostraba siempre minutos (ej. "hace 1.440 minutos" en lugar de
// "ayer" / "hace 1 día"), poco legible.
function formatLastActivity(startedAt) {
  if (!startedAt) return 'hace un momento'
  const rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' })
  const deltaMs = Date.now() - startedAt.getTime()
  const minutes = Math.round(deltaMs / 1000 / 60)
  if (minutes < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  return rtf.format(-days, 'day')
}

const progressSummary = computed(() => {
  const state = onboarding.state
  const completed = state.meta.completedSteps.length
  const startedAt = state.meta.startedAt ? new Date(state.meta.startedAt) : null
  return {
    email: state.identity.email,
    brand: state.business.brand,
    locations: state.business.locations,
    completedSteps: completed,
    lastActivity: formatLastActivity(startedAt),
  }
})

onMounted(() => {
  const completed = onboarding.state.meta.completedSteps
  const resumeToken = route.query.resume

  // Si vienen con magic link (?resume=token), saltamos el modal y los
  // mandamos directo al primer step incompleto. En producción, el backend
  // valida el token y restaura el snapshot completo antes de redirigir;
  // acá usamos el state ya persistido en localStorage (siempre disponible
  // porque el lead viene del mismo dispositivo o ya se hidrató en boot).
  //
  // Wow-moment-first: el step 'trial' salió del flow — el último gateable
  // antes del welcome es 'plan'. Si plan está completo, los mandamos a
  // /listo donde corre el ActivationOverlay automático sin tarjeta.
  if (resumeToken && completed.includes('identity') && !completed.includes('welcome')) {
    onboarding.track('resume_magic_link', {
      token: String(resumeToken).slice(0, 8) + '…',
      completed_count: completed.length,
    })
    const pending = ['business', 'savings', 'plan'].find(
      (s) => !completed.includes(s)
    )
    const map = {
      business: '/comenzar/negocio',
      savings: '/comenzar/ahorro',
      plan: '/comenzar/plan',
    }
    if (pending && map[pending]) {
      router.replace(map[pending])
      return
    }
    // Plan ya está → activación pendiente: /listo se encarga del overlay.
    if (completed.includes('plan')) {
      router.replace('/comenzar/listo')
      return
    }
  }

  // Caso normal: hay progreso parcial → modal de bienvenida.
  if (completed.includes('identity') && !completed.includes('welcome')) {
    showResumeModal.value = true
    onboarding.track('resume_modal_shown', { completed_count: completed.length })
  }
})

function onResume() {
  showResumeModal.value = false
  onboarding.track('resume_accepted', { completed_count: onboarding.state.meta.completedSteps.length })
  // Saltar al primer step incompleto. Wow-moment-first: si llegó a plan
  // pero no a welcome, lo mandamos directo a /listo para que vea el
  // ActivationOverlay y el wow moment.
  const completed = onboarding.state.meta.completedSteps
  const pending = ['business', 'savings', 'plan'].find(
    (s) => !completed.includes(s),
  )
  const map = {
    business: '/comenzar/negocio',
    savings: '/comenzar/ahorro',
    plan: '/comenzar/plan',
  }
  if (pending && map[pending]) {
    router.push(map[pending])
    return
  }
  // Si plan está completo y welcome no, vamos a /listo (activation overlay).
  if (completed.includes('plan') && !completed.includes('welcome')) {
    router.push('/comenzar/listo')
  }
}

function onStartOver() {
  showResumeModal.value = false
  onboarding.track('resume_declined', { completed_count: onboarding.state.meta.completedSteps.length })
  onboarding.reset()
  Object.assign(form, { fullName: '', email: '', whatsapp: '' })
}

// ── Validación robusta ───────────────────────────────────────────────────
// Emails desechables, bloqueamos los más comunes. En producción esto sería
// una lookup table del backend que se actualiza periódicamente. Por ahora
// frontend-only, suficiente para filtrar el 90% de los abusos.
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', '10minutemail.com',
  'trashmail.com', 'yopmail.com', 'sharklasers.com', 'dispostable.com',
  'maildrop.cc', 'temp-mail.org', 'fakeinbox.com', 'getnada.com',
])

// Detecta strings que son SOLO emojis/whitespace (sin caracteres alfanuméricos
// reales). Las marcas con sólo emojis son spam casi siempre.
function isOnlyEmoji(s) {
  return s.length > 0 && !/[\p{L}\p{N}]/u.test(s)
}

function validate(field) {
  const value = (form[field] || '').trim()
  switch (field) {
    case 'fullName':
      if (value.length < 2) {
        errors.fullName = 'Mínimo 2 caracteres.'
      } else if (isOnlyEmoji(value)) {
        errors.fullName = 'Tu nombre real, por favor.'
      } else if (value.length > 80) {
        errors.fullName = 'Demasiado largo (máx 80).'
      } else {
        errors.fullName = ''
      }
      break
    case 'email': {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.email = 'Necesitamos un email válido.'
      } else {
        const domain = value.split('@')[1]?.toLowerCase() || ''
        if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
          errors.email = 'Usá un email permanente, te mandamos cosas importantes acá.'
        } else {
          errors.email = ''
        }
      }
      break
    }
    case 'whatsapp': {
      const digits = value.replace(/\D/g, '')
      if (digits.length < 8) {
        errors.whatsapp = 'Ingresá un número con código de área.'
      } else if (digits.length > 15) {
        errors.whatsapp = 'Número demasiado largo.'
      } else if (/^(\d)\1+$/.test(digits)) {
        // 11111111, 00000000, etc, son números fake típicos.
        errors.whatsapp = 'Ese número no parece real.'
      } else {
        errors.whatsapp = ''
      }
      break
    }
  }
}

function validateAll() {
  ;['fullName', 'email', 'whatsapp'].forEach(validate)
}

// El cómputo lee directamente los VALORES del form, no `errors`. Los errores
// se muestran on blur (mejor UX, no spamea al lead mientras tipea) pero el
// botón "Continuar" reactúa al instante al tipear cada caracter, antes había
// un bug de doble-click: click #1 disparaba blur del input, validate limpiaba
// el error, isFormValid pasaba a true, pero el evento click ya había pegado
// en el botón disabled. Click #2 ya enabled → submit. Ahora no hay race.
const isFormValid = computed(() => {
  return (
    form.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.whatsapp.replace(/\D/g, '').length >= 8
  )
})

function onSubmit() {
  validateAll()
  if (!isFormValid.value) return
  // Derivamos first/last del fullName para mantener compat con `greeting`.
  const trimmed = form.fullName.trim()
  const parts = trimmed.split(/\s+/)
  onboarding.setIdentity({
    fullName: trimmed,
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
    email: form.email.trim().toLowerCase(),
    whatsapp: form.whatsapp.trim(),
  })
  router.push('/comenzar/negocio')
}
</script>
