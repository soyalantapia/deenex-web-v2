<template>
  <div>
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
      Empezá gratis · Paso 1 de 6
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
      <a href="/terminos" class="underline hover:text-slate-600">términos</a>
      y la
      <a href="/privacidad" class="underline hover:text-slate-600">política de privacidad</a>.
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

const progressSummary = computed(() => {
  const state = onboarding.state
  const completed = state.meta.completedSteps.length
  const startedAt = state.meta.startedAt ? new Date(state.meta.startedAt) : null
  const lastActivity = startedAt
    ? new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' }).format(
        Math.round((Date.now() - startedAt.getTime()) / 1000 / 60 / -1),
        'minute'
      )
    : 'hace un momento'
  return {
    email: state.identity.email,
    brand: state.business.brand,
    locations: state.business.locations,
    completedSteps: completed,
    lastActivity,
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
  if (resumeToken && completed.includes('identity') && !completed.includes('trial')) {
    onboarding.track('resume_magic_link', {
      token: String(resumeToken).slice(0, 8) + '…',
      completed_count: completed.length,
    })
    const pending = ['business', 'plan', 'preview', 'trial'].find(
      (s) => !completed.includes(s)
    )
    const map = {
      business: '/comenzar/negocio',
      plan: '/comenzar/plan',
      preview: '/comenzar/preview',
      trial: '/comenzar/activar',
    }
    if (pending && map[pending]) {
      router.replace(map[pending])
      return
    }
  }

  // Caso normal: hay progreso parcial → modal de bienvenida.
  if (completed.includes('identity') && !completed.includes('trial')) {
    showResumeModal.value = true
    onboarding.track('resume_modal_shown', { completed_count: completed.length })
  }
})

function onResume() {
  showResumeModal.value = false
  onboarding.track('resume_accepted', { completed_count: onboarding.state.meta.completedSteps.length })
  // Saltar al primer step incompleto
  const pending = ['business', 'plan', 'preview', 'trial'].find(
    (s) => !onboarding.state.meta.completedSteps.includes(s)
  )
  const map = {
    business: '/comenzar/negocio',
    plan: '/comenzar/plan',
    preview: '/comenzar/preview',
    trial: '/comenzar/activar',
  }
  if (pending) router.push(map[pending])
}

function onStartOver() {
  showResumeModal.value = false
  onboarding.track('resume_declined', { completed_count: onboarding.state.meta.completedSteps.length })
  onboarding.reset()
  Object.assign(form, { fullName: '', email: '', whatsapp: '' })
}

function validate(field) {
  const value = (form[field] || '').trim()
  switch (field) {
    case 'fullName':
      errors.fullName = value.length < 2 ? 'Mínimo 2 caracteres.' : ''
      break
    case 'email':
      errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Necesitamos un email válido.'
      break
    case 'whatsapp': {
      const digits = value.replace(/\D/g, '')
      errors.whatsapp = digits.length >= 8 ? '' : 'Ingresá un número con código de área.'
      break
    }
  }
}

function validateAll() {
  ;['fullName', 'email', 'whatsapp'].forEach(validate)
}

const isFormValid = computed(() => {
  return (
    form.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.whatsapp.replace(/\D/g, '').length >= 8 &&
    Object.values(errors).every((e) => !e)
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
