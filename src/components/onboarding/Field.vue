<template>
  <div class="block">
    <label :for="inputId" class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-2">
      {{ label }}
      <span v-if="required" class="text-primary" aria-hidden="true">·</span>
      <!-- Indicador "required" semántico para SR. El "·" visual lo dejamos
           como decoración por consistencia con el sistema de diseño. -->
      <span v-if="required" class="sr-only"> (requerido)</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :inputmode="inputmode"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :name="name"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="describedById"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        class="w-full px-4 py-3 rounded-xl bg-white border-2 text-base text-slate-900 placeholder-slate-300 transition-colors focus:outline-none"
        :class="error
          ? 'border-rose-300 focus:border-rose-500'
          : 'border-slate-200 focus:border-primary'"
      />
      <span v-if="prefix" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold pointer-events-none">
        {{ prefix }}
      </span>
    </div>
    <!-- role="alert" + aria-live="polite" para que el SR anuncie el error
         apenas aparece (en blur), sin requerir que el usuario re-focus. -->
    <p
      v-if="error"
      :id="errorId"
      role="alert"
      aria-live="polite"
      class="mt-1.5 text-xs text-rose-500 font-medium"
    >
      {{ error }}
    </p>
    <p v-else-if="hint" :id="hintId" class="mt-1.5 text-xs text-slate-400 font-medium">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  prefix: { type: String, default: '' },
  inputmode: { type: String, default: undefined },
  autocomplete: { type: String, default: undefined },
  maxlength: { type: [String, Number], default: undefined },
  name: { type: String, default: undefined },
})

defineEmits(['update:modelValue', 'blur'])

// useId() de Vue 3.5+ genera IDs únicos estables por instancia (SSR-safe).
// Necesarios para linkear label↔input y aria-describedby ↔ error/hint.
// Antes el <label> wrappeaba al <input> (asociación implícita) sin id, lo que
// generaba ambigüedad para SR cuando había un span entremedio.
const uid = useId()
const inputId = `field-${uid}`
const errorId = `field-${uid}-error`
const hintId = `field-${uid}-hint`

// aria-describedby apunta al error si hay, sino al hint, sino undefined
// (no ponemos un id que no existe — eso confunde a los SR).
const describedById = computed(() => {
  if (props.error) return errorId
  if (props.hint) return hintId
  return undefined
})
</script>
