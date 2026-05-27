<template>
  <!-- Step Business: form con inputs cortos + grids 2-col. max-w-2xl da
       buen respiro para los grids de POS/canales sin que queden anchísimos. -->
  <form @submit.prevent="onSubmit" novalidate v-autofocus class="max-w-2xl">
    <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
      Paso 2 de 6
    </p>
    <h1 class="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
      <template v-if="onboarding.greeting.value">{{ onboarding.greeting.value }}, contanos<br /></template>
      <template v-else>Contanos </template>de tu marca.<br />
      <span class="text-primary italic font-light">Te recomendamos el plan en base a eso.</span>
    </h1>
    <p class="text-base text-slate-500 leading-relaxed mb-10 max-w-md">
      Lo cambiás después si hace falta.
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
        <!-- Subdomain preview live + availability check.
             Tres estados visuales claros:
             1. checking → spinner azul
             2. available → verde + "Disponible"
             3. taken → amber con razón explícita + botón "Usar {sugerencia}" -->
        <div
          v-if="onboarding.subdomainPreview.value && onboarding.subdomainPreview.value !== 'tu-marca'"
          class="mt-2 rounded-lg border transition-colors overflow-hidden"
          :class="domainAvailable === false
            ? 'bg-amber-50 border-amber-200'
            : 'bg-primary/[0.04] border-primary/10'"
        >
          <div class="flex items-center gap-2 px-3 py-2">
            <span class="text-[10px] font-bold uppercase tracking-widest"
              :class="domainAvailable === false ? 'text-amber-700' : 'text-primary'"
            >
              <template v-if="domainAvailable === false">Ocupado</template>
              <template v-else>Tu app</template>
            </span>
            <code class="text-xs font-mono flex-1 min-w-0 truncate"
              :class="domainAvailable === false ? 'text-amber-800 line-through opacity-70' : 'text-slate-700'"
            >
              {{ effectiveSubdomain }}<span class="text-slate-400">.deenex.app</span>
            </code>
            <span v-if="domainChecking" class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0"></span>
            <span v-else-if="domainAvailable === true" class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 shrink-0">
              <Check class="w-3 h-3" />Disponible
            </span>
          </div>
          <!-- Sugerencia explícita cuando está tomado, el lead ve qué va a quedar. -->
          <button
            v-if="domainAvailable === false && domainSuggestion"
            type="button"
            @click="acceptSuggestion"
            class="w-full flex items-center justify-between gap-2 px-3 py-2 border-t border-amber-200/70 bg-white hover:bg-amber-50/40 transition-colors text-left"
          >
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest shrink-0">
                Libre →
              </span>
              <code class="text-xs font-mono text-slate-800 truncate">
                {{ domainSuggestion }}<span class="text-slate-400">.deenex.app</span>
              </code>
            </div>
            <span class="text-[10px] font-bold text-primary hover:underline shrink-0">
              Usar este
            </span>
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
            Tu volumen requiere un plan Enterprise, te asignamos un CSM dedicado.
          </p>
        </div>
      </div>

      <!-- POS -->
      <div>
        <span class="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">
          ¿Qué POS usás hoy?
          <Tooltip placement="top" align="left">
            <strong class="block mb-1">¿Para qué lo preguntamos?</strong>
            Conectamos automáticamente Deenex con tu sistema de cobro para que los pedidos del canal propio entren a tu caja del salón. Si no tenés POS, igual funciona.
          </Tooltip>
        </span>
        <div class="grid grid-cols-2 gap-2.5">
          <button
            v-for="opt in posOptions"
            :key="opt.value"
            type="button"
            @click="form.pos = opt.value"
            class="relative pl-4 pr-9 py-3 rounded-xl border-2 text-sm font-semibold transition-all text-left"
            :class="form.pos === opt.value
              ? 'border-primary bg-primary/[0.04] text-primary'
              : 'border-slate-200 text-slate-600 hover:border-slate-300'"
          >
            {{ opt.label }}
            <span v-if="form.pos === opt.value" class="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Check class="w-2.5 h-2.5 text-white" />
            </span>
          </button>
        </div>
        <!-- Input adicional para "Otro POS": cuando el lead selecciona "Otro"
             le preguntamos cuál usa. Le entra al CSM como contexto para el
             setup de la integración. -->
        <Transition name="other-pos">
          <div v-if="form.pos === 'other'" class="mt-3">
            <input
              v-model="form.posOther"
              type="text"
              placeholder="¿Cuál? Ej: Bistrosoft, Restaurant.com, Square…"
              maxlength="60"
              class="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-primary text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
            />
            <p class="text-[11px] text-slate-400 mt-1.5 leading-snug">
              Lo usamos para preparar la integración antes de tu setup.
            </p>
          </div>
        </Transition>
      </div>

      <!-- Canales actuales -->
      <div>
        <span class="flex items-center gap-1.5 flex-wrap text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">
          ¿Con qué canales vendés hoy?
          <span class="text-[10px] font-medium text-slate-400 normal-case tracking-normal">Podés elegir varios</span>
          <Tooltip placement="top" align="left">
            <strong class="block mb-1">¿Por qué importa?</strong>
            Calculamos cuánto estás dejando en comisiones de apps de terceros y proyectamos cuánto te ahorrás migrando ese tráfico al canal propio.
          </Tooltip>
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
import Tooltip from '@/components/onboarding/Tooltip.vue'
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
  posOther: onboarding.state.business.posOther || '',
  channels: [...onboarding.state.business.channels],
  // Hidratamos desde state, si el lead aceptó una sugerencia antes y vuelve
  // al step, mantenemos la elección.
  acceptedSuggestion: onboarding.state.business.subdomainOverride || '',
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
// Lista hardcoded de slugs ya "tomados", en producción esto sería una API.
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
  // Persistimos como override del subdomain en el STATE GLOBAL, así Welcome,
  // Trial y todos los preview/email mocks usan el slug correcto. Antes el
  // override vivía solo en form local y se perdía al salir del step (P0 bug).
  form.acceptedSuggestion = domainSuggestion.value
  onboarding.state.business.subdomainOverride = domainSuggestion.value
  domainAvailable.value = true
  onboarding.track('subdomain_suggestion_accepted', { slug: domainSuggestion.value })
}

// Si el lead cambia el brand después de haber aceptado una sugerencia,
// limpiamos el override (el slugify del nuevo brand vuelve a tener prioridad).
watch(
  () => onboarding.state.business.brand,
  (newBrand, oldBrand) => {
    if (newBrand !== oldBrand && form.acceptedSuggestion) {
      form.acceptedSuggestion = ''
      onboarding.state.business.subdomainOverride = ''
    }
  }
)

onMounted(() => {
  triggerSubdomainCheck()
})

const errors = reactive({ brand: '', channels: '' })

// Lista completa de POS gastronómicos populares en LATAM. Orden alfabético
// (menos "No tengo POS" y "Otro" que van al final como casos especiales).
const posOptions = [
  { value: 'ayresit', label: 'Ayresit' },
  { value: 'fudo', label: 'Fudo' },
  { value: 'bistrosoft', label: 'Bistrosoft' },
  { value: 'maxirest', label: 'Maxirest' },
  { value: 'odoo', label: 'Odoo' },
  { value: 'tango', label: 'Tango' },
  { value: 'none', label: 'No tengo POS' },
  { value: 'other', label: 'Otro' },
]

const channelOptions = [
  { value: 'salon', label: 'Salón con mesas', desc: 'Atendés en el local con mozos.' },
  { value: 'takeaway', label: 'Take Away', desc: 'Pedido al mostrador o por QR.' },
  { value: 'delivery_own', label: 'Delivery propio', desc: 'Tenés flota o repartidores.' },
  { value: 'delivery_third', label: 'PedidosYa / Rappi / Uber Eats', desc: 'Apps de terceros con comisión.' },
  { value: 'app_own', label: 'App propia', desc: 'Ya tenés app o web propia con pedidos online.' },
  { value: 'whatsapp', label: 'WhatsApp', desc: 'Pedidos por mensaje sin sistema.' },
]

function validate(field) {
  if (field === 'brand') {
    const v = form.brand.trim()
    if (v.length < 2) {
      errors.brand = 'Necesitamos al menos 2 caracteres.'
    } else if (v.length > 60) {
      errors.brand = 'Demasiado largo (máx 60).'
    } else if (!/[\p{L}\p{N}]/u.test(v)) {
      errors.brand = 'El nombre tiene que tener letras o números.'
    } else {
      errors.brand = ''
    }
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

// Validación completa antes del submit. Antes hacíamos validate('brand') y
// chequeábamos channels acá pero el resto dependía del blur del input —
// si el lead tipeaba y clickeaba Continuar sin blur, el primer click solo
// disparaba el blur (cambiaba foco) y el segundo era el submit real.
// Ahora validamos todo de una vez y procesamos en un solo handler.
function validateAll() {
  validate('brand')
  clampLocations()
  if (!form.pos) {
    errors.pos = 'Elegí tu POS actual.'
  } else {
    errors.pos = ''
  }
  if (form.channels.length === 0) {
    errors.channels = 'Elegí al menos un canal.'
  } else {
    errors.channels = ''
  }
}

function onSubmit() {
  validateAll()
  if (!isFormValid.value) return
  onboarding.setBusiness({
    brand: form.brand.trim(),
    locations: Number(form.locations),
    pos: form.pos,
    // Solo enviamos posOther si seleccionaron "Otro", para no contaminar
    // el state con valores stale al cambiar de POS.
    posOther: form.pos === 'other' ? form.posOther.trim() : '',
    channels: [...form.channels],
  })
  router.push('/comenzar/ahorro')
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
/* Animación del input "Otro POS", slide+fade al aparecer. */
.other-pos-enter-active,
.other-pos-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.other-pos-enter-from,
.other-pos-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.other-pos-enter-to,
.other-pos-leave-from {
  opacity: 1;
  max-height: 100px;
}
</style>
