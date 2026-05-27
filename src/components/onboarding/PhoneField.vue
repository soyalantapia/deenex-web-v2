<template>
  <div class="block" ref="rootEl">
    <label :for="inputId" class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-2">
      {{ label }}
      <span v-if="required" class="text-primary" aria-hidden="true">·</span>
      <span v-if="required" class="sr-only"> (requerido)</span>
    </label>
    <div
      class="flex items-stretch rounded-xl bg-white border-2 transition-colors overflow-hidden"
      :class="error
        ? 'border-rose-300 focus-within:border-rose-500'
        : 'border-slate-200 focus-within:border-primary'"
    >
      <!-- Combobox button: WAI-ARIA exige aria-expanded + aria-controls que apunta
           al listbox. aria-haspopup="listbox" para que el SR anuncie "expandible". -->
      <button
        type="button"
        @click.prevent="open = !open"
        @keydown="onTriggerKeydown"
        class="flex items-center gap-1.5 px-3 border-r border-slate-200 bg-slate-50/60 text-sm font-semibold text-slate-700 hover:bg-slate-100 shrink-0"
        :aria-expanded="open"
        :aria-controls="listboxId"
        aria-haspopup="listbox"
        :aria-label="`País: ${selectedCountry.name}, ${selectedCountry.dial}. Click para cambiar.`"
      >
        <span class="text-base leading-none" aria-hidden="true">{{ selectedCountry.flag }}</span>
        <span class="tabular-nums">{{ selectedCountry.dial }}</span>
        <ChevronDown class="w-3 h-3 text-slate-400 transition-transform" :class="open ? 'rotate-180' : ''" aria-hidden="true" />
      </button>
      <input
        :id="inputId"
        :value="localValue"
        :placeholder="selectedCountry.placeholder"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="describedById"
        @input="onInput($event.target.value)"
        @blur="$emit('blur')"
        class="flex-1 min-w-0 px-3 py-3 text-base text-slate-900 placeholder-slate-300 bg-white focus:outline-none"
      />
    </div>

    <!-- Country dropdown: role="listbox" + aria-activedescendant para que el SR
         anuncie qué país está hover-iluminado mientras navegás con ↑↓. -->
    <Transition name="dropdown">
      <ul
        v-if="open"
        :id="listboxId"
        ref="listboxRef"
        role="listbox"
        :aria-activedescendant="activeCountryId"
        @keydown="onListboxKeydown"
        tabindex="-1"
        class="mt-2 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden list-none p-0"
      >
        <li
          v-for="(c, idx) in countries"
          :key="c.code"
          :id="`country-${uid}-${c.code}`"
          role="option"
          :aria-selected="c.code === selectedCountry.code"
          @click="pickCountry(c.code)"
          @mouseenter="activeIndex = idx"
          class="flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors"
          :class="[
            idx === activeIndex ? 'bg-slate-50' : '',
            c.code === selectedCountry.code ? 'bg-primary/[0.04] text-primary' : 'text-slate-700',
          ]"
        >
          <span class="text-base leading-none" aria-hidden="true">{{ c.flag }}</span>
          <span class="text-sm font-semibold tabular-nums w-12">{{ c.dial }}</span>
          <span class="text-sm">{{ c.name }}</span>
        </li>
      </ul>
    </Transition>

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
import { ref, computed, watch, onMounted, onUnmounted, useId, nextTick } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const rootEl = ref(null)
const listboxRef = ref(null)

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

// IDs únicos para a11y (label↔input + button↔listbox + input↔error/hint).
const uid = useId()
const inputId = `phone-${uid}`
const listboxId = `phone-${uid}-listbox`
const errorId = `phone-${uid}-error`
const hintId = `phone-${uid}-hint`
const describedById = computed(() => {
  if (props.error) return errorId
  if (props.hint) return hintId
  return undefined
})

// `country-change` lo emitimos cada vez que el lead cambia de país. El parent
// (StepIdentity) escucha y re-valida, antes podía cambiar AR→MX con un número
// AR inválido para MX y el botón Continuar quedaba habilitado (P0 bug).
const emit = defineEmits(['update:modelValue', 'blur', 'country-change'])

const countries = [
  { code: 'AR', name: 'Argentina', dial: '+54', flag: '🇦🇷', placeholder: '11 5555-5555' },
  { code: 'MX', name: 'México', dial: '+52', flag: '🇲🇽', placeholder: '55 1234 5678' },
  { code: 'CL', name: 'Chile', dial: '+56', flag: '🇨🇱', placeholder: '9 1234 5678' },
  { code: 'CO', name: 'Colombia', dial: '+57', flag: '🇨🇴', placeholder: '300 123 4567' },
  { code: 'PE', name: 'Perú', dial: '+51', flag: '🇵🇪', placeholder: '987 654 321' },
  { code: 'UY', name: 'Uruguay', dial: '+598', flag: '🇺🇾', placeholder: '99 123 456' },
  { code: 'ES', name: 'España', dial: '+34', flag: '🇪🇸', placeholder: '612 34 56 78' },
]

const open = ref(false)
const selectedCode = ref('AR')
const localValue = ref('')
// Índice del país hover/teclado-iluminado en el dropdown. Se actualiza con
// ↑↓; el aria-activedescendant del listbox apunta a este país para que SR lea
// "Argentina, +54, seleccionado" mientras navegás sin haber confirmado.
const activeIndex = ref(0)
const activeCountryId = computed(
  () => (open.value && countries[activeIndex.value] ? `country-${uid}-${countries[activeIndex.value].code}` : null),
)

// Initialize from incoming model: split dial from local
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    const matched = countries.find((c) => val.startsWith(c.dial))
    if (matched) {
      selectedCode.value = matched.code
      localValue.value = val.slice(matched.dial.length).trim()
    } else if (!localValue.value) {
      localValue.value = val
    }
  },
  { immediate: true }
)

const selectedCountry = computed(
  () => countries.find((c) => c.code === selectedCode.value) || countries[0]
)

function pickCountry(code) {
  selectedCode.value = code
  open.value = false
  emit('update:modelValue', composeValue())
  // Notificamos al parent para que re-dispare validación del número con
  // las reglas del nuevo país (mínimo dígitos, prefijo, etc).
  emit('country-change', code)
}

// Keyboard nav patrón Combobox (WAI-ARIA):
//   - En el botón: Enter/Space abre, ↓ abre + foco al listbox.
//   - En el listbox: ↑↓ mueven activeIndex, Enter selecciona, Esc cierra.
async function onTriggerKeydown(e) {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    open.value = true
    // Inicializa el foco en el país actualmente seleccionado al abrir.
    const currentIdx = countries.findIndex((c) => c.code === selectedCode.value)
    activeIndex.value = currentIdx >= 0 ? currentIdx : 0
    await nextTick()
    listboxRef.value?.focus()
  }
}
function onListboxKeydown(e) {
  if (!open.value) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % countries.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + countries.length) % countries.length
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    const target = countries[activeIndex.value]
    if (target) pickCountry(target.code)
  } else if (e.key === 'Home') {
    e.preventDefault()
    activeIndex.value = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    activeIndex.value = countries.length - 1
  }
}

function onInput(raw) {
  // Mantenemos solo dígitos, espacios y guiones para la parte local.
  localValue.value = raw.replace(/[^\d\s-]/g, '')
  emit('update:modelValue', composeValue())
}

function composeValue() {
  const local = localValue.value.replace(/\s+/g, ' ').trim()
  if (!local) return ''
  return `${selectedCountry.value.dial} ${local}`
}

// Cierra el dropdown si hacés click afuera del componente.
function onDocumentClick(e) {
  if (!open.value || !rootEl.value) return
  if (!rootEl.value.contains(e.target)) {
    open.value = false
  }
}

// Cierra con tecla Escape.
function onKeydown(e) {
  if (e.key === 'Escape' && open.value) open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
