<template>
  <label class="block">
    <span class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-2">
      {{ label }}
      <span v-if="required" class="text-primary">·</span>
    </span>
    <div
      class="flex items-stretch rounded-xl bg-white border-2 transition-colors overflow-hidden"
      :class="error
        ? 'border-rose-300 focus-within:border-rose-500'
        : 'border-slate-200 focus-within:border-primary'"
    >
      <button
        type="button"
        @click="open = !open"
        class="flex items-center gap-1.5 px-3 border-r border-slate-200 bg-slate-50/60 text-sm font-semibold text-slate-700 hover:bg-slate-100 shrink-0"
      >
        <span class="text-base leading-none">{{ selectedCountry.flag }}</span>
        <span class="tabular-nums">{{ selectedCountry.dial }}</span>
        <ChevronDown class="w-3 h-3 text-slate-400" />
      </button>
      <input
        :value="localValue"
        :placeholder="selectedCountry.placeholder"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        @input="onInput($event.target.value)"
        @blur="$emit('blur')"
        class="flex-1 min-w-0 px-3 py-3 text-base text-slate-900 placeholder-slate-300 bg-white focus:outline-none"
      />
    </div>

    <!-- Country dropdown -->
    <div
      v-if="open"
      class="mt-2 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
    >
      <button
        v-for="c in countries"
        :key="c.code"
        type="button"
        @click="pickCountry(c.code)"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
        :class="c.code === selectedCountry.code ? 'bg-primary/[0.04] text-primary' : 'text-slate-700'"
      >
        <span class="text-base leading-none">{{ c.flag }}</span>
        <span class="text-sm font-semibold tabular-nums w-12">{{ c.dial }}</span>
        <span class="text-sm">{{ c.name }}</span>
      </button>
    </div>

    <p v-if="error" class="mt-1.5 text-xs text-rose-500 font-medium">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-slate-400 font-medium">{{ hint }}</p>
  </label>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'blur'])

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
</script>
