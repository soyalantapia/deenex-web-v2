<template>
  <!--
    ActivationOverlay, modal full-screen que aparece después de "Activar
    cuenta". Muestra los pasos de creación con animación tipo "estamos
    trabajando en tu cuenta": procesando pago, generando subdomain,
    armando branding, etc.

    En producción cada paso corresponde a un webhook real del backend
    (account.created, subdomain.provisioned, branding.generated, etc).
    Acá usamos setTimeout para simular la latencia natural, la sensación
    de "se está haciendo en vivo" es key para que el lead crea que el
    sistema está laburando, no que es una pantalla estática.
  -->
  <Teleport to="body">
    <Transition name="activation-overlay">
      <div
        v-if="show"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activation-title"
        class="fixed inset-0 z-[10000] bg-white flex items-center justify-center p-4 overflow-y-auto"
      >
        <!-- Glow sutil de marca: pequeños halos primary + emerald en las
             esquinas para que no sea un blanco plano puro, pero el fondo
             principal se mantiene blanco como el resto del onboarding. -->
        <div class="absolute top-0 left-0 w-[480px] h-[480px] rounded-full bg-primary/[0.06] blur-[140px] pointer-events-none" aria-hidden="true"></div>
        <div class="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full bg-emerald-400/10 blur-[140px] pointer-events-none" aria-hidden="true"></div>

        <!-- aria-live="polite" en el bloque dinámico para que el SR anuncie los
             cambios de step (provisionado, listo, etc) sin requerir focus. -->
        <div class="relative max-w-lg w-full" aria-live="polite" aria-atomic="false">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 mb-5" aria-hidden="true">
              <div class="w-8 h-8 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin"></div>
            </div>
            <p class="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-2">
              {{ allDone ? '¡Cuenta lista!' : 'Activando tu cuenta' }}
            </p>
            <h2 id="activation-title" class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tighter leading-tight">
              {{ activeStep ? activeStep.title : (allDone ? 'Todo listo, redirigiendo…' : 'Conectando…') }}
            </h2>
            <p class="text-sm text-slate-500 mt-2 leading-relaxed">
              {{ activeStep?.description || (allDone ? 'Te llevamos a tu dashboard en un segundo.' : '') }}
            </p>
          </div>

          <!-- Lista de pasos -->
          <div class="rounded-2xl bg-slate-50/60 border border-slate-200 p-5">
            <ul class="space-y-3">
              <li
                v-for="(step, i) in steps"
                :key="step.key"
                class="flex items-start gap-3 transition-all"
                :class="{ 'opacity-60': step.status === 'pending' }"
              >
                <!-- Status icon -->
                <span
                  class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all"
                  :class="{
                    'bg-emerald-500 text-white': step.status === 'done',
                    'bg-primary/10 text-primary': step.status === 'doing',
                    'bg-slate-100 text-slate-400': step.status === 'pending',
                  }"
                >
                  <Check v-if="step.status === 'done'" class="w-3.5 h-3.5" stroke-width="3" />
                  <span
                    v-else-if="step.status === 'doing'"
                    class="w-3 h-3 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
                  ></span>
                  <span v-else class="text-[10px] font-black tabular-nums">{{ i + 1 }}</span>
                </span>

                <div class="flex-1 min-w-0 pt-0.5">
                  <p
                    class="text-sm font-bold leading-tight transition-colors"
                    :class="step.status === 'done' || step.status === 'doing' ? 'text-slate-900' : 'text-slate-400'"
                  >
                    {{ step.title }}
                  </p>
                  <p
                    v-if="step.status === 'doing' || step.status === 'done'"
                    class="text-[11px] text-slate-500 mt-0.5 leading-snug"
                  >
                    <template v-if="step.status === 'done' && step.doneText">
                      <Check class="w-2.5 h-2.5 inline -mt-0.5 mr-0.5 text-emerald-500" stroke-width="3" />
                      {{ step.doneText }}
                    </template>
                    <template v-else-if="step.status === 'doing'">
                      {{ step.description }}
                    </template>
                  </p>
                </div>

                <span
                  v-if="step.status === 'doing'"
                  class="text-[10px] font-bold text-slate-400 tabular-nums uppercase tracking-widest mt-1.5 whitespace-nowrap"
                >
                  ~{{ step.estimatedSec }}s
                </span>
                <span
                  v-else-if="step.status === 'done'"
                  class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1.5 whitespace-nowrap"
                >
                  Listo
                </span>
              </li>
            </ul>

            <!-- Progress bar -->
            <div class="mt-5 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                class="h-full rounded-full bg-primary transition-all duration-500"
                :style="{ width: progressPct + '%' }"
              ></div>
            </div>
            <div class="mt-2.5 flex items-center justify-between gap-3">
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest tabular-nums">
                {{ doneCount }}/{{ steps.length }} pasos
              </p>
              <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest tabular-nums">
                {{ remainingSec }}s restantes
              </p>
            </div>
          </div>

          <p class="mt-5 text-center text-[11px] text-slate-400 leading-relaxed">
            <template v-if="allDone">
              ¡Listo! Redirigiéndote al dashboard…
            </template>
            <template v-else>
              No cierres la pestaña. En {{ remainingSec || '~5' }} segundos
              estás operando.
            </template>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
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
  // Wow-moment-first: este primer paso era "Procesando pago con MercadoPago" en
  // el modelo viejo (StepTrial pedía tarjeta antes del overlay). Ahora la
  // activación es SIN tarjeta — el primer paso es la reserva del trial gratis.
  // El paywall de MercadoPago se mueve al dashboard, después que cargue menú.
  {
    key: 'trial',
    title: 'Reservando tu trial gratis',
    description: 'Activando los 14 días sin tarjeta…',
    doneText: 'Trial activo. Sin cargo hasta el día 15.',
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
// Cuando todos los pasos están done, mostramos copy distinto en el header y
// footer en vez de seguir diciendo "Conectando…" o "En 0 segundos estás
// operando" (el fallback `|| '~5'` aplicaba solo si remainingSec era 0 falsy,
// pero el copy "Activando tu cuenta" igual quedaba inconsistente).
const allDone = computed(() => doneCount.value === steps.value.length)
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
          // Todos done, esperá un beat para que el usuario vea el 100%
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
