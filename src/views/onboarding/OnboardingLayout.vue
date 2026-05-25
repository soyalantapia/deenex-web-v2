<template>
  <div class="onboarding-shell min-h-screen bg-white">
    <!-- Connectivity banner: offline + save errors -->
    <ConnectivityBanner />
    <!-- Social proof live counter (top of page) -->
    <div class="bg-slate-900 text-white py-1.5 px-4 text-center">
      <p class="text-[11px] font-medium leading-snug">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5 -mt-0.5"></span>
        <span class="font-bold text-emerald-400 tabular-nums">+{{ liveActivations }}</span>
        cadenas activaron Deenex {{ activationWindow }}
      </p>
    </div>

    <!-- Top bar -->
    <header class="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <!-- Mobile: header compacto. Solo logo, progress fina y counter. -->
      <div class="sm:hidden px-4 py-3 flex items-center justify-between gap-3">
        <button type="button" @click="onExit" class="shrink-0">
          <img src="@/assets/images/nav-logo.webp" alt="Deenex" class="h-4 w-auto" />
        </button>
        <div class="flex-1 flex items-center gap-1">
          <div
            v-for="(step, i) in steps"
            :key="step.key"
            class="h-0.5 flex-1 rounded-full transition-colors"
            :class="i <= activeStepIndex ? 'bg-primary' : 'bg-slate-200'"
          />
        </div>
        <div class="text-[10px] font-bold text-slate-500 tabular-nums shrink-0">
          {{ activeStepIndex + 1 }}<span class="text-slate-300">/{{ steps.length }}</span>
        </div>
      </div>

      <!-- Desktop: header normal con todo expuesto. -->
      <div class="hidden sm:flex max-w-6xl mx-auto px-6 py-4 items-center justify-between gap-4">
        <button type="button" @click="onExit" class="flex items-center gap-2 shrink-0 group">
          <img src="@/assets/images/nav-logo.webp" alt="Deenex" class="h-5 w-auto" />
        </button>

        <div class="flex-1 max-w-md mx-auto flex items-center gap-1.5">
          <div
            v-for="(step, i) in steps"
            :key="step.key"
            class="h-1 flex-1 rounded-full transition-colors"
            :class="i <= activeStepIndex ? 'bg-primary' : 'bg-slate-200'"
          />
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <!-- Auto-save indicator: aparece sólo cuando "saving" o "saved", evita
               ruido visual cuando no pasó nada. Le da al lead la tranquilidad
               de que su progreso no se pierde. -->
          <Transition name="save-status">
            <span
              v-if="onboarding.saveStatus.value === 'saving'"
              class="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
            >
              <span class="w-2.5 h-2.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></span>
              Guardando
            </span>
            <span
              v-else-if="onboarding.saveStatus.value === 'saved'"
              class="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest"
            >
              <Check class="w-3 h-3" stroke-width="3" />
              Guardado
            </span>
            <span
              v-else-if="onboarding.saveStatus.value === 'error'"
              class="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-widest"
              :title="'Hubo un problema guardando. Si tu navegador está en modo privado, los datos podrían no persistir.'"
            >
              ⚠ Sin guardar
            </span>
          </Transition>

          <!-- Cross-device QR: solo aparece en desktop, permite escanear y
               retomar en celular. Solo cuando el lead tiene progreso real. -->
          <CrossDeviceQR v-if="canSaveAndExit" />
          <button
            v-if="canSaveAndExit"
            type="button"
            @click="showSaveModal = true"
            class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Save class="w-3 h-3" />
            Guardar y seguir después
          </button>
          <div class="text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-2">
            <span>{{ completionPct }}%</span>
            <span class="inline-block w-px h-3 bg-slate-200"></span>
            <span class="text-slate-900">{{ activeStepIndex + 1 }}</span>
            <span class="text-slate-400">/{{ steps.length }}</span>
          </div>
        </div>
      </div>

      <!-- Save&Exit mobile button: separado, en su propia fila bajo el header -->
      <div v-if="canSaveAndExit" class="sm:hidden border-t border-slate-100 px-4 py-2 flex justify-end">
        <button
          type="button"
          @click="showSaveModal = true"
          class="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Save class="w-3 h-3" />
          Guardar y seguir después
        </button>
      </div>
    </header>

    <!-- Body -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div class="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start">
        <!-- Main column -->
        <div class="max-w-xl">
          <RouterView v-slot="{ Component }">
            <Transition name="step" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </div>

        <!-- Side panel: contenido cambia según el step activo -->
        <SidePanel
          :mode="currentMode"
          :has-progress="hasProgress"
          :recommended-plan-commission="planCommissionLabel"
        />
      </div>
    </main>

    <!-- Save & exit modal — guarda progreso y manda magic link al email -->
    <Teleport to="body">
      <Transition name="exit-overlay">
        <div
          v-if="showSaveModal"
          class="fixed inset-0 z-[9997] bg-slate-900/50 backdrop-blur-sm"
          @click="showSaveModal = false"
        ></div>
      </Transition>
      <Transition name="exit-modal">
        <div
          v-if="showSaveModal"
          class="fixed inset-0 z-[9998] flex items-center justify-center p-4 pointer-events-none"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 pointer-events-auto">
            <div v-if="!saveSent">
              <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Save class="w-6 h-6 text-primary" />
              </div>
              <h3 class="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
                Te mandamos un link para retomar
              </h3>
              <p class="text-sm text-slate-500 leading-relaxed mb-5">
                Te enviamos un link único a tu email. Lo abrís cuando quieras y
                volvés exactamente donde lo dejaste — desde cualquier dispositivo.
              </p>
              <input
                v-model="saveEmail"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="tu@email.com"
                class="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-primary text-base text-slate-900 placeholder-slate-300 mb-4 focus:outline-none"
              />
              <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
                <button
                  type="button"
                  @click="showSaveModal = false"
                  class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  @click="sendSaveLink"
                  :disabled="!validSaveEmail"
                  class="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-[#3c1fc9] transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Mandarme el link →
                </button>
              </div>
            </div>
            <div v-else>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-5">
                <Check class="w-6 h-6 text-white" stroke-width="3" />
              </div>
              <h3 class="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
                ¡Listo!
              </h3>
              <p class="text-sm text-slate-500 leading-relaxed mb-5">
                Te mandamos el link a
                <span class="font-bold text-slate-900">{{ saveEmail }}</span>.
                Si no lo ves en 5 minutos, revisá spam.
              </p>
              <RouterLink
                to="/"
                @click="showSaveModal = false; saveSent = false"
                class="block w-full text-center px-5 py-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Salir al inicio
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Exit intent modal — aparece UNA vez si el lead mueve el mouse hacia
         arriba del viewport (típico cuando va a cerrar la tab) y tiene
         progreso parcial. Diferente al exit modal del logo: este es
         proactivo, lo dispara el detector. -->
    <Teleport to="body">
      <Transition name="exit-overlay">
        <div
          v-if="showExitIntent"
          class="fixed inset-0 z-[9997] bg-slate-900/60 backdrop-blur-sm"
          @click="dismissExitIntent"
        ></div>
      </Transition>
      <Transition name="exit-modal">
        <div
          v-if="showExitIntent"
          class="fixed inset-0 z-[9998] flex items-center justify-center p-4 pointer-events-none"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 pointer-events-auto">
            <div class="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl mb-5">
              👋
            </div>
            <h3 class="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
              Antes de irte, una cosa.
            </h3>
            <p class="text-sm text-slate-500 leading-relaxed mb-5">
              Ya completaste {{ onboarding.state.meta.completedSteps.length }}/{{ steps.length - 1 }} pasos.
              Si volvés en las próximas 48 horas y activás tu trial, te regalamos
              <span class="font-bold text-emerald-600">los primeros 30 días gratis</span>
              en vez de 15.
            </p>
            <div class="rounded-2xl bg-slate-50 border border-slate-200 p-3 mb-5 flex items-center gap-3">
              <Gift class="w-5 h-5 text-amber-500 shrink-0" />
              <code class="flex-1 text-xs font-mono text-slate-700 truncate">DEENEX30</code>
              <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest shrink-0">
                Código aplicado
              </span>
            </div>
            <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
              <button
                type="button"
                @click="dismissExitIntent"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Después
              </button>
              <button
                type="button"
                @click="continueWithBonus"
                class="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-[#3c1fc9] transition-colors"
              >
                Continuar con el bonus →
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Exit confirmation modal -->
    <Teleport to="body">
      <Transition name="exit-overlay">
        <div
          v-if="showExitModal"
          class="fixed inset-0 z-[9998] bg-slate-900/50 backdrop-blur-sm"
          @click="showExitModal = false"
        ></div>
      </Transition>
      <Transition name="exit-modal">
        <div
          v-if="showExitModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 pointer-events-auto">
            <h3 class="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
              ¿Salir del trial?
            </h3>
            <p class="text-sm text-slate-500 leading-relaxed mb-6">
              Tu progreso queda guardado. Cuando vuelvas, retomás donde lo dejaste.
            </p>
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                @click="showExitModal = false"
                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Quedarme acá
              </button>
              <RouterLink
                to="/"
                @click="onConfirmExit"
                class="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors text-center"
              >
                Salir al inicio
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { Gift, Save, Check } from 'lucide-vue-next'
// `Check` ya está importado — se usa en el modal Save & exit Y ahora también
// en el auto-save indicator (success state).
import SidePanel from '@/components/onboarding/SidePanel.vue'
import ConnectivityBanner from '@/components/onboarding/ConnectivityBanner.vue'
import CrossDeviceQR from '@/components/onboarding/CrossDeviceQR.vue'
import { useOnboarding } from '@/composables/useOnboarding'

const route = useRoute()
const onboarding = useOnboarding()

const steps = [
  { key: 'identity', label: 'Vos', path: '/comenzar' },
  { key: 'business', label: 'Tu marca', path: '/comenzar/negocio' },
  { key: 'plan', label: 'Plan', path: '/comenzar/plan' },
  { key: 'preview', label: 'Vista previa', path: '/comenzar/preview' },
  { key: 'trial', label: 'Activar', path: '/comenzar/activar' },
  { key: 'welcome', label: 'Listo', path: '/comenzar/listo' },
]

const activeStepIndex = computed(() => {
  const i = steps.findIndex((s) => s.path === route.path)
  return i === -1 ? 0 : i
})

const completionPct = computed(() => {
  return Math.round(((activeStepIndex.value + 1) / steps.length) * 100)
})

const hasProgress = computed(() => onboarding.state.meta.completedSteps.length > 0)

const currentMode = computed(() => steps[activeStepIndex.value]?.key || 'identity')

// Social proof: número aproximado de activaciones del día/semana. Es un
// valor frontend-only por ahora — cuando exista endpoint /api/onboarding/stats
// reemplazamos por live data. El número se "mueve" sutilmente para que se
// sienta vivo, pero queda estable durante la sesión del lead.
const liveActivations = ref(0)
const activationWindow = ref('esta semana')
// Guardamos el handle para cleanup en onUnmounted — antes era leak: el
// interval seguía vivo después de salir del onboarding.
let socialProofTimer = null
function initSocialProof() {
  // Base: 12 a 47 por día según horario. Determinístico por hora del día
  // para que no parpadee al refrescar.
  const hour = new Date().getHours()
  const dayBase = hour >= 18 ? 47 : hour >= 12 ? 32 : hour >= 9 ? 18 : 12
  // Pequeño jitter local pero estable durante toda la sesión (semilla = día)
  const day = new Date().getDate()
  const jitter = ((day * 17) % 11) - 5
  liveActivations.value = Math.max(8, dayBase + jitter)
  activationWindow.value = 'esta semana'

  // Cada 25-40s sumamos 1 activación para que parezca vivo si la sesión es larga.
  if (socialProofTimer) clearInterval(socialProofTimer)
  socialProofTimer = setInterval(() => {
    if (Math.random() < 0.55) liveActivations.value += 1
  }, 32_000)
}

// ── Exit intent: detecta cuando el mouse sale por arriba del viewport ──
// Solo dispara UNA vez por sesión (persistencia en sessionStorage) y solo
// si el lead tiene progreso parcial (no recién entró, no ya activó).
const showExitIntent = ref(false)

function onMouseLeave(e) {
  // Solo nos importa cuando el mouse sale por arriba (Y <= 0).
  if (e.clientY > 5) return
  if (typeof window !== 'undefined' && sessionStorage.getItem('deenex_exit_intent_shown')) return
  const completed = onboarding.state.meta.completedSteps
  // Solo si ya hizo algo pero no terminó el trial
  if (completed.length === 0 || completed.includes('trial')) return
  // Y solo si no está en welcome
  if (route.path === '/comenzar/listo') return

  showExitIntent.value = true
  try { sessionStorage.setItem('deenex_exit_intent_shown', '1') } catch {}
  onboarding.track('exit_intent_shown', { last_step: steps[activeStepIndex.value]?.key })
}

function dismissExitIntent() {
  showExitIntent.value = false
  onboarding.track('exit_intent_dismissed')
}

function continueWithBonus() {
  showExitIntent.value = false
  onboarding.track('exit_intent_bonus_accepted', { code: 'DEENEX30' })
  // Aplica el bonus REAL — el composable extiende trial a 30 días y todos los
  // computeds (firstChargeDate, días restantes) reactúan automáticamente.
  onboarding.markBonusApplied('DEENEX30')
}

const planCommissionLabel = computed(() => {
  const tier = onboarding.recommendedPlan.value
  // Devuelve string tipo "1,25%" — formato hispano para mostrar al lead.
  return `${String(tier?.commissionPct ?? 1.25).replace('.', ',')}%`
})

// ── Save & exit ───────────────────────────────────────────────────────────
// Solo mostramos el botón si el lead empezó pero todavía no terminó el trial,
// y no está en welcome (no tiene sentido guardar después de activar).
const canSaveAndExit = computed(() => {
  const completed = onboarding.state.meta.completedSteps
  return (
    completed.length > 0 &&
    !completed.includes('trial') &&
    route.path !== '/comenzar/listo'
  )
})

const showSaveModal = ref(false)
const saveEmail = ref(onboarding.state.identity.email || '')
const saveSent = ref(false)
const validSaveEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(saveEmail.value.trim()))

async function sendSaveLink() {
  if (!validSaveEmail.value) return
  onboarding.track('save_and_exit_requested', {
    email: saveEmail.value,
    last_step: steps[activeStepIndex.value]?.key,
  })
  /*
   * Backend integration:
   *   POST /api/onboarding/save-progress
   *   body: { email, snapshot: onboarding.state }
   *   response: { resumeUrl, expiresAt }
   *   El backend manda un email con un link único + token al resumeUrl.
   *
   * Hoy: simulamos el envío con un setTimeout y mostramos confirmación.
   */
  await new Promise((r) => setTimeout(r, 600))
  saveSent.value = true
}

const showExitModal = ref(false)
function onExit() {
  // Si está en Welcome (último paso), no abrimos modal — solo navegamos.
  if (route.path === '/comenzar/listo') {
    window.location.href = '/'
    return
  }
  showExitModal.value = true
  onboarding.track('exit_modal_shown', { from_step: steps[activeStepIndex.value]?.key })
}
function onConfirmExit() {
  onboarding.track('exit_confirmed', { from_step: steps[activeStepIndex.value]?.key })
  showExitModal.value = false
}

// ── <head> dinámico: title, robots, canonical ──────────────────────────
const previousMeta = {
  title: '',
  robots: '',
}

function applyStepHead() {
  const stepInfo = steps[activeStepIndex.value]
  const stepName = stepInfo?.key === 'identity' ? 'Tus datos'
    : stepInfo?.key === 'business' ? 'Tu marca'
    : stepInfo?.key === 'plan' ? 'Elegir plan'
    : stepInfo?.key === 'preview' ? 'Vista previa'
    : stepInfo?.key === 'trial' ? 'Activar trial'
    : 'Listo'
  document.title = `Paso ${activeStepIndex.value + 1}/${steps.length} · ${stepName} · Deenex`
}

watch(() => route.path, applyStepHead)

onMounted(() => {
  previousMeta.title = document.title
  const robotsTag = document.head.querySelector('meta[name="robots"]')
  previousMeta.robots = robotsTag?.getAttribute('content') || ''
  if (robotsTag) robotsTag.setAttribute('content', 'noindex, nofollow')

  applyStepHead()
  initSocialProof()

  const variant = route.query.from || ''
  onboarding.ensureStarted(variant)

  // Warning al cerrar la pestaña con progreso a medias + tracking de abandono
  window.addEventListener('beforeunload', onBeforeUnload)
  window.addEventListener('pagehide', onPageHide)
  document.addEventListener('visibilitychange', onVisibilityChange)
  document.addEventListener('mouseleave', onMouseLeave)
  // ESC cierra cualquier modal abierto. Es accesibilidad básica que faltaba.
  document.addEventListener('keydown', onKeyDown)
})

// ESC handler global — cierra modals con jerarquía: el más arriba primero.
function onKeyDown(e) {
  if (e.key !== 'Escape') return
  if (showSaveModal.value) {
    showSaveModal.value = false
    saveSent.value = false
    onboarding.track('save_modal_dismissed', { via: 'esc' })
  } else if (showExitIntent.value) {
    dismissExitIntent()
  } else if (showExitModal.value) {
    showExitModal.value = false
    onboarding.track('exit_modal_dismissed', { via: 'esc' })
  }
}

function onBeforeUnload(e) {
  const completed = onboarding.state.meta.completedSteps.length
  if (completed > 0 && completed < 4 && route.path !== '/comenzar/listo') {
    e.preventDefault()
    // Chrome ignora el mensaje custom pero el dialog igual aparece.
    e.returnValue = 'Tu progreso queda guardado pero estás por salir del onboarding.'
    return e.returnValue
  }
}

// pagehide es más confiable que beforeunload para trackear (especialmente en
// Safari y mobile). Lo usamos con sendBeacon-style tracking.
function onPageHide() {
  if (route.path === '/comenzar/listo') return
  const completed = onboarding.state.meta.completedSteps
  if (completed.length === 0 || completed.includes('trial')) return
  onboarding.track('abandoned', {
    last_step: steps[activeStepIndex.value]?.key,
    completed_steps: completed.length,
    persisted_in_storage: true,
  })
}

// Si el usuario tabbea fuera por más de un timeout (40s), tracking de inactividad.
let visibilityTimer = null
function onVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    visibilityTimer = setTimeout(() => {
      const completed = onboarding.state.meta.completedSteps
      if (completed.length > 0 && !completed.includes('trial') && route.path !== '/comenzar/listo') {
        onboarding.track('tab_hidden_long', {
          last_step: steps[activeStepIndex.value]?.key,
        })
      }
    }, 40000)
  } else if (visibilityTimer) {
    clearTimeout(visibilityTimer)
    visibilityTimer = null
  }
}

onUnmounted(() => {
  // Restauramos title + robots para que el resto de la app no quede contaminada.
  document.title = previousMeta.title || 'Deenex | Tu canal propio'
  const robotsTag = document.head.querySelector('meta[name="robots"]')
  if (robotsTag && previousMeta.robots) {
    robotsTag.setAttribute('content', previousMeta.robots)
  }
  window.removeEventListener('beforeunload', onBeforeUnload)
  window.removeEventListener('pagehide', onPageHide)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  document.removeEventListener('mouseleave', onMouseLeave)
  document.removeEventListener('keydown', onKeyDown)
  if (visibilityTimer) clearTimeout(visibilityTimer)
  if (socialProofTimer) clearInterval(socialProofTimer)
})
</script>

<style scoped>
.onboarding-shell {
  font-feature-settings: 'cv11', 'ss01';
}

/* Step transition: subtle slide-up */
.step-enter-active,
.step-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.step-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Exit modal transitions */
.exit-overlay-enter-active,
.exit-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.exit-overlay-enter-from,
.exit-overlay-leave-to {
  opacity: 0;
}
.exit-modal-enter-active,
.exit-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.exit-modal-enter-from,
.exit-modal-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}

/* Save status pill: fade rápido para que no sea distractor */
.save-status-enter-active,
.save-status-leave-active {
  transition: opacity 0.2s ease;
}
.save-status-enter-from,
.save-status-leave-to {
  opacity: 0;
}
</style>
