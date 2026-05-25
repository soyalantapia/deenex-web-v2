<template>
  <!--
    ActivationOverlay — modal full-screen que aparece después de "Activar
    cuenta". Muestra los pasos de creación con animación tipo "estamos
    trabajando en tu cuenta": procesando pago, generando subdomain,
    armando branding, etc.

    En producción cada paso corresponde a un webhook real del backend
    (account.created, subdomain.provisioned, branding.generated, etc).
    Acá usamos setTimeout para simular la latencia natural — la sensación
    de "se está haciendo en vivo" es key para que el lead crea que el
    sistema está laburando, no que es una pantalla estática.
  -->
  <Teleport to="body">
    <Transition name="activation-overlay">
      <div
        v-if="show"
        class="fixed inset-0 z-[10000] bg-gradient-to-br from-primary via-[#3c1fc9] to-slate-900 flex items-center justify-center p-4"
      >
        <!-- Glow effects de fondo -->
        <div class="absolute top-20 left-20 w-96 h-96 rounded-full bg-emerald-400/20 blur-[120px] pointer-events-none"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-primary/30 blur-[120px] pointer-events-none animate-pulse"></div>

        <div class="relative max-w-lg w-full">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 mb-5">
              <!-- Spinner pulsante -->
              <div class="w-8 h-8 rounded-full border-[3px] border-white/30 border-t-white animate-spin"></div>
            </div>
            <p class="text-[10px] font-black text-white/60 uppercase tracking-[0.25em] mb-2">
              Activando tu cuenta
            </p>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tighter leading-tight">
              {{ activeStep ? activeStep.title : 'Conectando…' }}
            </h2>
            <p class="text-sm text-white/70 mt-2 leading-relaxed">
              {{ activeStep?.description || '' }}
            </p>
          </div>

          <!-- Lista de pasos con animación -->
          <div class="rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/10 p-5">
            <ul class="space-y-3">
              <li
                v-for="(step, i) in steps"
                :key="step.key"
                class="flex items-start gap-3 transition-all"
                :class="{ 'opacity-50': step.status === 'pending' }"
              >
                <!-- Status icon -->
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                  :class="{
                    'bg-emerald-400 text-emerald-950 scale-100': step.status === 'done',
                    'bg-white/15 text-white': step.status === 'doing',
                    'bg-white/5 text-white/40': step.status === 'pending',
                  }"
                >
                  <Check v-if="step.status === 'done'" class="w-3.5 h-3.5" stroke-width="3" />
                  <span
                    v-else-if="step.status === 'doing'"
                    class="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin"
                  ></span>
                  <span v-else class="text-[10px] font-black tabular-nums">{{ i + 1 }}</span>
                </span>

                <div class="flex-1 min-w-0 pt-0.5">
                  <p
                    class="text-sm font-bold leading-tight transition-colors"
                    :class="step.status === 'done' ? 'text-white' : step.status === 'doing' ? 'text-white' : 'text-white/50'"
                  >
                    {{ step.title }}
                  </p>
                  <p
                    v-if="step.status === 'doing' || step.status === 'done'"
                    class="text-[11px] text-white/60 mt-0.5 leading-snug"
                  >
                    <template v-if="step.status === 'done' && step.doneText">
                      <Check class="w-2.5 h-2.5 inline -mt-0.5 mr-0.5 text-emerald-400" stroke-width="3" />
                      {{ step.doneText }}
                    </template>
                    <template v-else-if="step.status === 'doing'">
                      {{ step.description }}
                    </template>
                  </p>
                </div>

                <!-- Time indicator -->
                <span
                  v-if="step.status === 'doing'"
                  class="text-[10px] font-bold text-white/40 tabular-nums uppercase tracking-widest mt-1.5 whitespace-nowrap"
                >
                  ~{{ step.estimatedSec }}s
                </span>
                <span
                  v-else-if="step.status === 'done'"
                  class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1.5 whitespace-nowrap"
                >
                  Listo
                </span>
              </li>
            </ul>

            <!-- Progress bar -->
            <div class="mt-5 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                class="h-full rounded-full bg-emerald-400 transition-all duration-500"
                :style="{ width: progressPct + '%' }"
              ></div>
            </div>
            <div class="mt-2 flex items-center justify-between gap-3">
              <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest tabular-nums">
                {{ doneCount }}/{{ steps.length }} pasos
              </p>
              <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest tabular-nums">
                {{ remainingSec }}s restantes
              </p>
            </div>
          </div>

          <!-- Footer info -->
          <p class="mt-5 text-center text-[11px] text-white/50 leading-relaxed">
            No cierres la pestaña. En {{ remainingSec || '~5' }} segundos
            estás operando.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { Teleport } from 'vue'
import { Check } from 'lucide-vue-next'

const props = defineProps({
  show: { type: Boolean, default: false },
  brand: { type: String, default: 'tu marca' },
  subdomain: { type: String, default: 'tu-marca' },
})
const emit = defineEmits(['complete'])

// Cada paso simula un webhook real del backend (payment.confirmed,
// account.created, subdomain.provisioned, branding.generated, integrations.
// linked, magic_link.sent). Los delays son intencionalmente "humanos":
// no instantáneos para que el lead perciba esfuerzo real, no fake.
const steps = ref([
  {
    key: 'payment',
    title: 'Procesando pago con MercadoPago',
    description: 'Validando método de pago y reservando tu cuenta…',
    doneText: 'MercadoPago vinculado. Primer cargo: día 16.',
    estimatedSec: 4,
    delayMs: 2200,
    status: 'doing',
  },
  {
    key: 'account',
    title: 'Creando tu cuenta',
    description: 'Generando tenant + perfil del admin…',
    doneText: 'Cuenta creada en US-East. Region: Buenos Aires.',
    estimatedSec: 3,
    delayMs: 1600,
    status: 'pending',
  },
  {
    key: 'subdomain',
    title: 'Reservando tu URL',
    description: 'Provisionando DNS + SSL cert + CDN…',
    doneText: '',  // se completa en runtime con el subdomain dinámico
    estimatedSec: 5,
    delayMs: 2400,
    status: 'pending',
  },
  {
    key: 'branding',
    title: 'Armando tu marca',
    description: 'Aplicando colores, tipografía y assets a tu app…',
    doneText: '',  // se completa con brand dinámico
    estimatedSec: 4,
    delayMs: 1900,
    status: 'pending',
  },
  {
    key: 'loyalty',
    title: 'Activando Loyalty Dinámico',
    description: '3 niveles VIP + sistema de puntos + wallet branded…',
    doneText: 'Loyalty configurada. Cupones de cumple activos.',
    estimatedSec: 3,
    delayMs: 1500,
    status: 'pending',
  },
  {
    key: 'channels',
    title: 'Conectando WhatsApp y Push',
    description: 'Linkeando canales de mensajería automatizada…',
    doneText: 'WhatsApp Business + Push notifications listos.',
    estimatedSec: 3,
    delayMs: 1700,
    status: 'pending',
  },
  {
    key: 'magic',
    title: 'Enviando tu acceso por email',
    description: 'Generando magic link único (válido 24h)…',
    doneText: 'Email enviado. Revisá tu bandeja.',
    estimatedSec: 2,
    delayMs: 1200,
    status: 'pending',
  },
])

const activeStep = computed(() => steps.value.find((s) => s.status === 'doing'))
const doneCount = computed(() => steps.value.filter((s) => s.status === 'done').length)
const progressPct = computed(() => Math.round((doneCount.value / steps.value.length) * 100))
const remainingSec = computed(() => {
  return steps.value
    .filter((s) => s.status !== 'done')
    .reduce((sum, s) => sum + (s.status === 'doing' ? Math.floor(s.estimatedSec / 2) : s.estimatedSec), 0)
})

const timers = []
function clearAllTimers() {
  timers.forEach((t) => clearTimeout(t))
  timers.length = 0
}

function runProvisioning() {
  // Resetear estados (en caso de re-mount)
  steps.value.forEach((s, i) => {
    s.status = i === 0 ? 'doing' : 'pending'
  })

  // Insertamos doneText dinámicos
  const subdomainStep = steps.value.find((s) => s.key === 'subdomain')
  if (subdomainStep) {
    subdomainStep.doneText = `${props.subdomain}.deenex.app reservado y vivo.`
  }
  const brandingStep = steps.value.find((s) => s.key === 'branding')
  if (brandingStep) {
    brandingStep.doneText = `Branding de ${props.brand} aplicado.`
  }

  // Schedule cada paso con su delay acumulado
  let accumulated = 0
  steps.value.forEach((step, i) => {
    accumulated += step.delayMs
    timers.push(
      setTimeout(() => {
        // Marca current done
        step.status = 'done'
        // Si hay siguiente, márcalo como doing
        const next = steps.value[i + 1]
        if (next) {
          next.status = 'doing'
        } else {
          // Todos done — esperá un beat para que el usuario vea el 100%
          // antes de continuar al welcome.
          timers.push(setTimeout(() => emit('complete'), 800))
        }
      }, accumulated)
    )
  })
}

// Arranca el provisioning cuando el modal aparece. Si se cierra antes de
// terminar (por ejemplo refresh), cancela los timers para evitar leaks.
watch(
  () => props.show,
  (v) => {
    if (v) runProvisioning()
    else clearAllTimers()
  },
  { immediate: true }
)

onUnmounted(clearAllTimers)
</script>

<style scoped>
.activation-overlay-enter-active,
.activation-overlay-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.activation-overlay-enter-from,
.activation-overlay-leave-to {
  opacity: 0;
}
.activation-overlay-enter-from > div,
.activation-overlay-leave-to > div {
  transform: scale(0.95);
}
</style>
