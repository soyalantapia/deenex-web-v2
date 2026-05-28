<template>
  <!--
    Cross-device sync: botón que aparece SOLO en desktop, genera un QR con
    el resume token, y el lead lo escanea para seguir en mobile (con el state
    restored via ?resume=token).

    UX para cadenas gastronómicas: muchos gerentes empiezan en la PC del local
    pero terminan completando el form en su celular (a la salida del local, en
    el auto, etc). Este QR elimina la fricción de "te mando el link por email".
  -->
  <div class="hidden lg:block">
    <button
      type="button"
      @click="open = true"
      class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      :aria-label="'Continuar en otro dispositivo'"
    >
      <Smartphone class="w-3 h-3" />
      Seguir en celu
    </button>

    <Teleport to="body">
      <Transition name="qr-overlay">
        <div
          v-if="open"
          class="fixed inset-0 z-[9997] bg-slate-900/50 backdrop-blur-sm"
          @click="open = false"
          aria-hidden="true"
        ></div>
      </Transition>
      <Transition name="qr-modal">
        <div
          v-if="open"
          class="fixed inset-0 z-[9998] flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            ref="modalRef"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-modal-title"
            class="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-7 pointer-events-auto"
          >
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5" aria-hidden="true">
              <Smartphone class="w-6 h-6 text-primary" />
            </div>
            <h3 id="qr-modal-title" class="text-xl font-extrabold tracking-tight text-slate-900 mb-2">
              Continuá en tu celular
            </h3>
            <p class="text-sm text-slate-500 leading-relaxed mb-5">
              Escaneá el código y retomás exactamente donde estás ahora, sin
              perder progreso, sin tener que volver a llenar nada.
            </p>
            <!-- QR generado 100% local (sin fetch a 3rd parties).
                 Antes usábamos api.qrserver.com → leak de datos del lead
                 (email en el resume token) a un tercero sin DPA, violación
                 de GDPR / Ley 25.326. Ahora SVG inline. -->
            <div class="flex justify-center mb-4">
              <div
                class="rounded-2xl border border-slate-200 p-2 bg-white"
                v-html="qrSvg"
                :aria-label="`Código QR para resume token ${tokenPreview}`"
                role="img"
              ></div>
            </div>
            <div class="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 mb-4">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                O copiá el link
              </p>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-[11px] font-mono text-slate-700 truncate">{{ resumeUrl }}</code>
                <button
                  type="button"
                  @click="copyLink"
                  class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md transition-colors shrink-0"
                  :class="copyFailed
                    ? 'bg-rose-500 text-white'
                    : copied ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:bg-[#3c1fc9]'"
                >
                  {{ copyFailed ? 'Error' : (copied ? '✓ Copiado' : 'Copiar') }}
                </button>
              </div>
              <!-- Mensaje fallback si copy falla (browser sin permisos, HTTP).
                   Le decimos al lead que seleccione manualmente. role=alert
                   para que el SR lo anuncie sin requerir foco. -->
              <p v-if="copyFailed" role="alert" class="mt-1 text-[10px] text-rose-600 leading-snug">
                No pudimos copiar automáticamente. Seleccioná el link arriba y copiá con Ctrl/Cmd+C.
              </p>
            </div>
            <p class="text-[10px] text-slate-400 leading-relaxed mb-5 text-center">
              El link expira en 24 horas.
            </p>
            <button
              type="button"
              @click="open = false"
              class="block w-full text-center px-5 py-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Smartphone } from 'lucide-vue-next'
import { useOnboarding } from '@/composables/useOnboarding'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { generateQrSvg } from '@/utils/qrcode'

const onboarding = useOnboarding()
const open = ref(false)
const copied = ref(false)
const copyFailed = ref(false)
const modalRef = ref(null)

// a11y: foco-on-open, restore-on-close, Tab cycling. Mismo composable que
// usan el save modal, exit intent, exit confirm y ResumeModal.
useFocusTrap(open, modalRef)

// Token "resume". En producción sería un JWT firmado por el backend con TTL
// y revocación; el frontend solo lo pide al backend al abrir el modal.
// Stub local: hash DETERMINÍSTICO de email + startedAt. Antes incluía
// Date.now() en el hash → cada apertura del modal generaba un token distinto,
// contradicción con la doc original. Ahora dos aperturas dan el mismo QR
// (mientras email/startedAt no cambien) y el link es estable para compartir.
const resumeToken = computed(() => {
  const email = onboarding.state.identity.email || ''
  const started = onboarding.state.meta.startedAt || ''
  return btoa(`${email}|${started}`).replace(/[^A-Za-z0-9]/g, '').slice(0, 24)
})

const tokenPreview = computed(() => resumeToken.value.slice(0, 6) + '…')

const resumeUrl = computed(() => {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://deenex.tech'
  return `${base}/comenzar?resume=${resumeToken.value}`
})

// QR generado 100% local, SVG inline. Sin fetch a 3rd parties, sin leak
// de datos del lead. Cuando el modal se abre por primera vez se genera al
// vuelo; si el resumeUrl cambia, el computed reactúa.
const qrSvg = computed(() => generateQrSvg(resumeUrl.value, { size: 192, margin: 2 }))

async function copyLink() {
  // Reset error state en cada intento.
  copyFailed.value = false
  try {
    // navigator.clipboard requiere HTTPS o localhost. Si la página corre en
    // HTTP plain o el browser bloquea, fallback a un truco con textarea +
    // execCommand para no dejar al lead sin recurso.
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(resumeUrl.value)
    } else {
      // Fallback legacy: textarea oculto + execCommand. Deprecated pero
      // soportado por todos los browsers actuales como último recurso.
      const ta = document.createElement('textarea')
      ta.value = resumeUrl.value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      if (!ok) throw new Error('execCommand failed')
    }
    copied.value = true
    onboarding.track('cross_device_link_copied')
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Le avisamos al lead que falló y mostramos el link plain para que lo
    // pueda copiar manualmente. Antes el error se tragaba en silencio →
    // botón "Copiar" no daba feedback y el lead quedaba bailando.
    copyFailed.value = true
    onboarding.track('cross_device_copy_failed')
    setTimeout(() => { copyFailed.value = false }, 4000)
  }
}
</script>

<style scoped>
.qr-overlay-enter-active,
.qr-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.qr-overlay-enter-from,
.qr-overlay-leave-to {
  opacity: 0;
}
.qr-modal-enter-active,
.qr-modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.qr-modal-enter-from,
.qr-modal-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
