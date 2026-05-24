<template>
  <form @submit.prevent="onSubmit" novalidate>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Empezá gratis · Paso 1 de 5
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      Decinos quién sos.<br />
      <span class="text-primary italic font-light">Sin tarjeta, sin compromiso.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-10 max-w-md">
      Lo usamos para crear tu cuenta y mandarte los datos de acceso por
      WhatsApp y email. Toma menos de un minuto.
    </p>

    <div class="space-y-5">
      <div class="grid sm:grid-cols-2 gap-4">
        <Field
          v-model="form.firstName"
          label="Nombre"
          name="firstName"
          autocomplete="given-name"
          placeholder="Marcos"
          :error="errors.firstName"
          required
          @blur="validate('firstName')"
        />
        <Field
          v-model="form.lastName"
          label="Apellido"
          name="lastName"
          autocomplete="family-name"
          placeholder="Aldazábal"
          :error="errors.lastName"
          required
          @blur="validate('lastName')"
        />
      </div>

      <Field
        v-model="form.email"
        label="Email corporativo"
        type="email"
        name="email"
        autocomplete="email"
        inputmode="email"
        placeholder="marcos@palta.com.ar"
        hint="Te mandamos las credenciales acá."
        :error="errors.email"
        required
        @blur="validate('email')"
      />

      <Field
        v-model="form.whatsapp"
        label="WhatsApp"
        type="tel"
        name="whatsapp"
        autocomplete="tel"
        inputmode="tel"
        placeholder="11 5555-5555"
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
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Field from '@/components/onboarding/Field.vue'
import StepActions from '@/components/onboarding/StepActions.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()

const form = reactive({ ...onboarding.state.identity })
const errors = reactive({ firstName: '', lastName: '', email: '', whatsapp: '' })

function validate(field) {
  const value = (form[field] || '').trim()
  switch (field) {
    case 'firstName':
    case 'lastName':
      errors[field] = value.length < 2 ? 'Mínimo 2 caracteres.' : ''
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
  ;['firstName', 'lastName', 'email', 'whatsapp'].forEach(validate)
}

const isFormValid = computed(() => {
  return (
    form.firstName.trim().length >= 2 &&
    form.lastName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.whatsapp.replace(/\D/g, '').length >= 8 &&
    Object.values(errors).every((e) => !e)
  )
})

function onSubmit() {
  validateAll()
  if (!isFormValid.value) return
  onboarding.setIdentity({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim().toLowerCase(),
    whatsapp: form.whatsapp.trim(),
  })
  router.push('/comenzar/negocio')
}
</script>
