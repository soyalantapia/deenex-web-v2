<template>
  <!--
    Cookie consent banner, GDPR (UE) y Ley 25.326 (Argentina).

    Por defecto el index.html carga gtag con consent='denied' para todo.
    Este banner es la SUPERFICIE donde el lead da opt-in explícito; al
    aceptar, llamamos gtag('consent', 'update', {...granted}) y persistimos
    la elección en localStorage para no volver a mostrarlo.

    UX:
    - Mostramos abajo, no como modal bloqueante (mejor conversion).
    - Botón principal "Aceptar todo", secundario "Solo necesarias", terciario
      "Personalizar" (collapse con detalles).
    - Link a política de privacidad inline.

    Diseño consciente: el banner pisa la parte inferior del viewport por
    sólo ~150px, así que no rompe el primer scroll del lead. Si rechaza,
    el flow funciona igual pero los events no salen a GA4.
  -->
  <Transition name="consent">
    <div
      v-if="visible"
      class="fixed bottom-0 inset-x-0 z-[9990] bg-slate-900 text-white shadow-2xl shadow-slate-900/40 border-t border-slate-700"
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div v-if="!detailsOpen" class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-1 min-w-0">
            <h3 id="consent-title" class="text-sm sm:text-base font-bold leading-tight mb-1">
              🍪 Cookies y datos
            </h3>
            <p id="consent-body" class="text-xs sm:text-sm text-slate-300 leading-snug">
              Usamos cookies y analytics (GA4) para mejorar tu experiencia. Podés
              <button type="button" @click="detailsOpen = true" class="underline hover:text-white font-semibold">
                personalizar
              </button>
              o leer nuestra
              <RouterLink to="/privacidad" class="underline hover:text-white font-semibold">
                política de privacidad
              </RouterLink>.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              type="button"
              @click="rejectAll"
              class="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Solo necesarias
            </button>
            <button
              type="button"
              @click="acceptAll"
              class="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-primary hover:bg-[#3c1fc9] text-white transition-colors"
            >
              Aceptar todo
            </button>
          </div>
        </div>

        <!-- Detalles expandidos: permite opt-in granular por categoría. -->
        <div v-else class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-sm font-bold leading-tight">Personalizá tu consentimiento</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">Elegí qué datos podemos usar para mejorar tu experiencia.</p>
            </div>
            <button type="button" @click="detailsOpen = false" class="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest shrink-0">
              Cerrar
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label class="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/60 border border-slate-700 cursor-not-allowed opacity-90">
              <input type="checkbox" checked disabled class="mt-0.5" />
              <div class="min-w-0">
                <p class="text-xs font-bold leading-tight">Necesarias</p>
                <p class="text-[10px] text-slate-400 mt-0.5 leading-snug">Login, preferencias, progreso del onboarding. Siempre activas.</p>
              </div>
            </label>
            <label class="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/60 border border-slate-700 cursor-pointer hover:border-primary">
              <input v-model="granularConsent.analytics" type="checkbox" class="mt-0.5" />
              <div class="min-w-0">
                <p class="text-xs font-bold leading-tight">Analítica</p>
                <p class="text-[10px] text-slate-400 mt-0.5 leading-snug">Google Analytics 4, nos ayuda a saber qué funciona y qué no.</p>
              </div>
            </label>
            <label class="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/60 border border-slate-700 cursor-pointer hover:border-primary">
              <input v-model="granularConsent.marketing" type="checkbox" class="mt-0.5" />
              <div class="min-w-0">
                <p class="text-xs font-bold leading-tight">Marketing</p>
                <p class="text-[10px] text-slate-400 mt-0.5 leading-snug">Personalización de avisos en Meta / Google Ads.</p>
              </div>
            </label>
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <button type="button" @click="rejectAll" class="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Rechazar todo
            </button>
            <button type="button" @click="acceptGranular" class="px-5 py-2.5 rounded-lg text-xs font-bold bg-primary hover:bg-[#3c1fc9] text-white transition-colors">
              Guardar elección
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const CONSENT_KEY = 'deenex_consent_v1'
const CONSENT_GRANULAR_KEY = 'deenex_consent_granular_v1'

const visible = ref(false)
const detailsOpen = ref(false)

// Granular opt-in (defaults: analytics OFF, marketing OFF, el lead lo activa).
const granularConsent = reactive({
  analytics: false,
  marketing: false,
})

function readStoredConsent() {
  try { return localStorage.getItem(CONSENT_KEY) } catch { return null }
}

function persistConsent(state, granular) {
  try {
    localStorage.setItem(CONSENT_KEY, state)
    if (granular) localStorage.setItem(CONSENT_GRANULAR_KEY, JSON.stringify(granular))
  } catch { /* private mode, el flow sigue funcionando */ }
}

function applyConsentToGtag(consent) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('consent', 'update', consent)
}

function acceptAll() {
  visible.value = false
  persistConsent('granted', { analytics: true, marketing: true })
  applyConsentToGtag({
    ad_storage: 'granted',
    analytics_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  })
  // Trackeamos el opt-in ahora que está habilitado.
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'consent_accepted', { mode: 'all' })
  }
}

function rejectAll() {
  visible.value = false
  persistConsent('denied', { analytics: false, marketing: false })
  applyConsentToGtag({
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
}

function acceptGranular() {
  visible.value = false
  const mode = granularConsent.analytics && granularConsent.marketing ? 'granted' : 'partial'
  persistConsent(mode === 'granted' ? 'granted' : 'partial', { ...granularConsent })
  applyConsentToGtag({
    analytics_storage: granularConsent.analytics ? 'granted' : 'denied',
    ad_storage: granularConsent.marketing ? 'granted' : 'denied',
    ad_user_data: granularConsent.marketing ? 'granted' : 'denied',
    ad_personalization: granularConsent.marketing ? 'granted' : 'denied',
  })
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'consent_accepted', { mode: 'granular', analytics: granularConsent.analytics, marketing: granularConsent.marketing })
  }
}

onMounted(() => {
  // Solo mostramos si el lead nunca eligió antes.
  const prev = readStoredConsent()
  if (!prev) {
    // Damos un beat para no chocar con el LoadingScreen.
    setTimeout(() => { visible.value = true }, 1200)
  }
})
</script>

<style scoped>
.consent-enter-active,
.consent-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
