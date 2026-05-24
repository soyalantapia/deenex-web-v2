<template>
  <form @submit.prevent="onSubmit" novalidate v-autofocus>
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 2 de 6
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      <template v-if="onboarding.greeting.value">{{ onboarding.greeting.value }}, contanos<br /></template>
      <template v-else>Contanos </template>de tu marca.<br />
      <span class="text-primary italic font-light">Te recomendamos el plan en base a eso.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-10 max-w-md">
      Nada de esto es definitivo — podés cambiarlo después dentro de la plataforma.
    </p>

    <div class="space-y-8">
      <div>
        <Field
          v-model="form.brand"
          label="Nombre de la marca"
          name="brand"
          placeholder="Palta · Hatsu · La Trattoria"
          :error="errors.brand"
          required
          @blur="validate('brand')"
        />
        <!-- Subdomain preview live + availability check -->
        <div
          v-if="onboarding.subdomainPreview.value && onboarding.subdomainPreview.value !== 'tu-marca'"
          class="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
          :class="domainAvailable === false
            ? 'bg-amber-50 border-amber-200'
            : 'bg-primary/[0.04] border-primary/10'"
        >
          <span class="text-[10px] font-bold uppercase tracking-widest"
            :class="domainAvailable === false ? 'text-amber-700' : 'text-primary'"
          >
            Tu app
          </span>
          <code class="text-xs font-mono flex-1 min-w-0 truncate"
            :class="domainAvailable === false ? 'text-amber-800' : 'text-slate-700'"
          >
            {{ effectiveSubdomain }}<span class="text-slate-400">.deenex.app</span>
          </code>
          <span v-if="domainChecking" class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0"></span>
          <span v-else-if="domainAvailable === true" class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 shrink-0">
            <Check class="w-3 h-3" />Disponible
          </span>
          <button
            v-else-if="domainAvailable === false"
            type="button"
            @click="acceptSuggestion"
            class="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline shrink-0"
          >
            Usar sugerencia
          </button>
        </div>
      </div>

      <!-- Slider + input combinado -->
      <div>
        <div class="flex items-baseline justify-between mb-3">
          <span class="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
            ¿Cuántos locales operás?
          </span>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Editá o usá el slider
          </span>
        </div>
        <div class="bg-slate-50/60 border border-slate-200 rounded-2xl p-5">
          <div class="flex items-baseline gap-2 mb-4">
            <input
              v-model.number="form.locations"
              type="number"
              min="1"
              max="500"
              inputmode="numeric"
              @blur="clampLocations"
              class="text-5xl font-black text-primary tabular-nums tracking-tighter w-32 bg-transparent border-2 border-transparent outline-none focus:bg-white focus:border-primary focus:shadow-md focus:shadow-primary/10 rounded-lg px-2 -mx-2 transition-all no-spinner"
              aria-label="Cantidad de locales"
            />
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {{ form.locations === 1 ? 'local' : 'locales operativos' }}
            </span>
          </div>
          <div class="relative pt-1 pb-7">
            <div class="absolute left-0 top-1/2 -translate-y-[16px] h-2 bg-slate-200 rounded-full w-full"></div>
            <div
              class="absolute left-0 top-1/2 -translate-y-[16px] h-2 bg-primary rounded-full transition-all duration-150"
              :style="{ width: `${Math.min(((form.locations - 1) / 199) * 100, 100)}%` }"
            ></div>
            <input
              v-model.number="form.locations"
              type="range"
              min="1"
              max="200"
              class="w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10 custom-range"
            />
            <div class="absolute inset-x-0 bottom-0 text-[10px] font-black text-slate-400 uppercase tracking-tight h-4">
              <span class="absolute left-0">1</span>
              <span class="absolute -translate-x-1/2" :style="{ left: '12.5%' }">25</span>
              <span class="absolute -translate-x-1/2" :style="{ left: '35%' }">70</span>
              <span class="absolute -translate-x-1/2 hidden sm:block" :style="{ left: '50%' }">100</span>
              <span class="absolute -translate-x-1/2" :style="{ left: '75%' }">150</span>
              <span class="absolute right-0 translate-x-0 text-right">200+</span>
            </div>
          </div>
          <p v-if="form.locations >= 200" class="mt-1 text-xs text-emerald-600 font-semibold">
            Tu volumen requiere un plan Enterprise — te asignamos un CSM dedicado.
          </p>
        </div>
      </div>

      <!-- POS -->
      <div>
        <span class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">
          ¿Qué POS usás hoy?
        </span>
        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="opt in posOptions"
            :key="opt.value"
            type="button"
            @click="form.pos = opt.value"
            class="relative px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left"
            :class="form.pos === opt.value
              ? 'border-primary bg-primary/[0.04] text-primary'
              : 'border-slate-200 text-slate-600 hover:border-slate-300'"
          >
            {{ opt.label }}
            <span v-if="form.pos === opt.value" class="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check class="w-2.5 h-2.5 text-white" />
            </span>
          </button>
        </div>
      </div>

      <!-- Canales actuales -->
      <div>
        <span class="block text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">
          ¿Con qué canales vendés hoy?
          <span class="ml-1 text-[10px] font-medium text-slate-400 normal-case tracking-normal">Podés elegir varios</span>
        </span>
        <div class="grid sm:grid-cols-2 gap-2.5">
          <label
            v-for="ch in channelOptions"
            :key="ch.value"
            class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="form.channels.includes(ch.value)
              ? 'border-primary bg-primary/[0.04]'
              : 'border-slate-200 hover:border-slate-300'"
          >
            <input
              type="checkbox"
              :value="ch.value"
              v-model="form.channels"
              class="sr-only"
            />
            <span
              class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
              :class="form.channels.includes(ch.value)
                ? 'bg-primary border-primary'
                : 'border-slate-300'"
            >
              <Check v-if="form.channels.includes(ch.value)" class="w-3 h-3 text-white" />
            </span>
            <div class="flex-1 min-w-0">
              <span class="block text-sm font-bold text-slate-900">{{ ch.label }}</span>
              <span class="block text-xs text-slate-500 leading-snug mt-0.5">{{ ch.desc }}</span>
            </div>
          </label>
        </div>
        <p v-if="errors.channels" class="mt-2 text-xs text-rose-500 font-medium">{{ errors.channels }}</p>
      </div>
    </div>

    <StepActions
      next-label="Continuar"
      :disabled="!isFormValid"
      @back="$router.push('/comenzar')"
    />
  </form>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'
import Field from '@/components/onboarding/Field.vue'
import StepActions from '@/components/onboarding/StepActions.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const router = useRouter()
const onboarding = useOnboarding()

// Smart pre-fill: si la marca está vacía pero el email es corporativo, sugerimos
// inferida del dominio. El usuario la puede cambiar a su gusto.
const inferredBrand = onboarding.inferBrandFromEmail(onboarding.state.identity.email)

const form = reactive({
  brand: onboarding.state.business.brand || inferredBrand,
  locations: onboarding.state.business.locations || 1,
  pos: onboarding.state.business.pos,
  channels: [...onboarding.state.business.channels],
  acceptedSuggestion: '', // override del subdomain si el original estaba tomado
})

// Mantenemos sincronizado el subdomain preview con el state global mientras
// el usuario tipea, para que el badge `tu-marca.deenex.app` reaccione en vivo.
watch(
  () => form.brand,
  (val) => {
    onboarding.state.business.brand = val
    triggerSubdomainCheck()
  }
)

// ── Subdomain availability check ────────────────────────────────────────
// Lista hardcoded de slugs ya "tomados" — en producción esto sería una API.
const TAKEN_SUBDOMAINS = new Set([
  'palta', 'hatsu', 'coquitos', 'monti', 'glorias', 'quem',
  'demo', 'admin', 'app', 'api', 'test', 'staging',
])

const domainChecking = ref(false)
const domainAvailable = ref(null) // null = sin chequear · true · false
const domainSuggestion = ref('')
let domainCheckTimer = null

function triggerSubdomainCheck() {
  if (domainCheckTimer) clearTimeout(domainCheckTimer)
  const slug = onboarding.subdomainPreview.value
  if (!slug || slug === 'tu-marca' || slug.length < 2) {
    domainChecking.value = false
    domainAvailable.value = null
    return
  }
  domainChecking.value = true
  domainAvailable.value = null
  // Debounce + simulación API. Cuando exista, reemplazar por
  // GET /api/onboarding/subdomain-availability?slug={slug}
  domainCheckTimer = setTimeout(() => {
    domainChecking.value = false
    if (TAKEN_SUBDOMAINS.has(slug)) {
      domainAvailable.value = false
      domainSuggestion.value = `${slug}-${suggestionSuffix()}`
    } else {
      domainAvailable.value = true
      domainSuggestion.value = ''
    }
  }, 550)
}

function suggestionSuffix() {
  // Heurística simple: sufijo geo si captamos uno por país del WhatsApp,
  // o nro random como fallback.
  const wa = onboarding.state.identity.whatsapp || ''
  if (wa.startsWith('+54')) return 'ar'
  if (wa.startsWith('+52')) return 'mx'
  if (wa.startsWith('+56')) return 'cl'
  return String(Math.floor(Math.random() * 99) + 1)
}

const effectiveSubdomain = computed(() => {
  // Si el lead aceptó la sugerencia, mostramos esa.
  return form.acceptedSuggestion || onboarding.subdomainPreview.value
})

function acceptSuggestion() {
  if (!domainSuggestion.value) return
  // Persistimos como override del subdomain.
  form.acceptedSuggestion = domainSuggestion.value
  domainAvailable.value = true
  onboarding.track('subdomain_suggestion_accepted', { slug: domainSuggestion.value })
}

onMounted(() => {
  triggerSubdomainCheck()
})

const errors = reactive({ brand: '', channels: '' })

const posOptions = [
  { value: 'maxirest', label: 'Maxirest' },
  { value: 'fudo', label: 'Fudo' },
  { value: 'odoo', label: 'Odoo' },
  { value: 'bsale', label: 'Bsale' },
  { value: 'tango', label: 'Tango' },
  { value: 'other', label: 'Otro POS' },
  { value: 'none', label: 'No tengo POS' },
]

const channelOptions = [
  { value: 'salon', label: 'Salón con mesas', desc: 'Atendés en el local con mozos.' },
  { value: 'takeaway', label: 'Take Away', desc: 'Pedido al mostrador o por QR.' },
  { value: 'delivery_own', label: 'Delivery propio', desc: 'Tenés flota o repartidores.' },
  { value: 'delivery_third', label: 'PedidosYa / Rappi / Uber Eats', desc: 'Apps de terceros con comisión.' },
  { value: 'glovo', label: 'Glovo', desc: 'Si operás en LATAM con Glovo activo.' },
  { value: 'whatsapp', label: 'WhatsApp', desc: 'Pedidos por mensaje sin sistema.' },
]

function validate(field) {
  if (field === 'brand') {
    errors.brand = form.brand.trim().length < 2 ? 'Necesitamos al menos 2 caracteres.' : ''
  }
}

// Si el usuario escribe un número fuera de rango en el input, lo normalizamos
// al perder foco para que el slider y el computed del plan no se rompan.
function clampLocations() {
  const n = Number(form.locations) || 1
  form.locations = Math.max(1, Math.min(500, Math.round(n)))
}

const isFormValid = computed(() => {
  return (
    form.brand.trim().length >= 2 &&
    form.locations >= 1 &&
    !!form.pos &&
    form.channels.length >= 1
  )
})

function onSubmit() {
  validate('brand')
  if (form.channels.length === 0) {
    errors.channels = 'Elegí al menos un canal.'
  } else {
    errors.channels = ''
  }
  if (!isFormValid.value) return
  onboarding.setBusiness({
    brand: form.brand.trim(),
    locations: Number(form.locations),
    pos: form.pos,
    channels: [...form.channels],
  })
  router.push('/comenzar/plan')
}
</script>

<style scoped>
/* Oculta los spinners del input number para que se vea como texto editable. */
.no-spinner::-webkit-outer-spin-button,
.no-spinner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spinner {
  -moz-appearance: textfield;
  appearance: textfield;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  background: white;
  border: 3px solid var(--primary, #4f26db);
  border-radius: 50%;
  box-shadow: 0 4px 15px -3px rgba(79, 38, 219, 0.4);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.custom-range:active::-webkit-slider-thumb {
  transform: scale(1.15);
}
input[type='range'] {
  touch-action: none;
}
</style>
