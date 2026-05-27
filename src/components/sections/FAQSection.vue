<template>
  <section id="faq" class="py-24 px-6 sm:px-12 bg-white overflow-hidden">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {{ eyebrow }}
          </div>
          <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
            {{ headlineLine1 }} <br />
            <span class="text-primary italic font-light">{{ headlineLine2 }}</span>
          </h2>
        </div>
        <div class="hidden lg:block max-w-[260px] text-right relative lg:ml-auto">
          <div class="absolute -left-10 top-0 bottom-0 w-px bg-slate-200/60"></div>
          <p class="text-slate-400 text-sm leading-relaxed pr-2">
            {{ sidequote }}
          </p>
        </div>
      </div>

      <!-- FAQ Grid -->
      <div class="grid lg:grid-cols-2 gap-4">
        <div
          v-for="(item, i) in faqs"
          :key="i"
          class="border border-slate-200 rounded-2xl bg-white overflow-hidden cursor-pointer group hover:border-primary/30 transition-colors duration-300"
          @click="toggle(i)"
        >
          <button class="w-full flex items-start justify-between gap-4 p-5 text-left">
            <span class="text-sm font-semibold text-slate-900 leading-snug group-hover:text-primary transition-colors">
              {{ item.q }}
            </span>
            <span
              class="flex-shrink-0 w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300"
              :class="open === i ? 'bg-primary border-primary text-white rotate-45' : 'text-slate-400'"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v8M1 5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
          </button>
          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="open === i ? 'max-h-48 pb-5' : 'max-h-0'"
          >
            <p class="px-5 text-sm text-slate-500 leading-relaxed">
              {{ item.a }}
            </p>
          </div>
        </div>
      </div>

      <!-- CTA footer -->
      <div class="mt-10 text-center">
        <p class="text-sm text-slate-500 mb-4">{{ ctaText }}</p>
        <a
          :href="csmWhatsappLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-emerald-500/20"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {{ ctaLabel }}
        </a>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { whatsappLink } from '@/utils/contact'

const props = defineProps({
  content: { type: Object, default: () => ({}) },
})

const open = ref(null)

const eyebrow = computed(() => props.content.eyebrow ?? 'Preguntas Frecuentes')
const headlineLine1 = computed(() => props.content.headlineLine1 ?? 'Todo lo que necesitás')
const headlineLine2 = computed(() => props.content.headlineLine2 ?? 'saber antes de arrancar.')
const sidequote = computed(() => props.content.sidequote ?? '"Si tenés dudas, es normal. Las respondemos todas."')
const ctaText = computed(() => props.content.ctaText ?? '¿Tenés una pregunta que no está acá?')
const ctaLabel = computed(() => props.content.ctaLabel ?? 'Escribinos por WhatsApp')

const csmWhatsappLink = computed(() =>
  whatsappLink(props.content.whatsappTemplate ?? 'Hola! Tengo una consulta sobre Deenex.'),
)

function toggle(i) {
  open.value = open.value === i ? null : i
}

const DEFAULT_FAQS = [
  {
    q: '¿Cuánto tarda la implementación?',
    a: 'El onboarding inicial toma entre 3 y 7 días hábiles. Nuestro equipo te acompaña en cada paso: configuración de la app, carga del menú, integración de pagos y capacitación del equipo operativo.',
  },
  {
    q: '¿Necesito cambiar mi POS o sistema actual?',
    a: 'No. Deenex se integra con los principales sistemas POS del mercado como Maxirest y Odoo. Si usás otro sistema, nuestro equipo lo evalúa sin costo antes de la contratación.',
  },
  {
    q: '¿Qué pasa si quiero cancelar?',
    a: 'No hay contratos de largo plazo ni penalidades. Cancelás en 1 click desde tu panel, sin permanencia. Tus datos son 100% tuyos y te los entregamos exportados.',
  },
  {
    q: '¿Funciona con Mercado Pago?',
    a: 'Sí. Tenemos integración nativa con Mercado Pago para cobros online. También soportamos otros medios de pago según la región de operación.',
  },
  {
    q: '¿Puedo usar Deenex si ya tengo delivery en Rappi o PedidosYa?',
    a: 'Completamente. Muchos de nuestros clientes operan en paralelo. Deenex no reemplaza esos canales de inmediato, los complementa mientras construís tu propia base de clientes registrados. Con el tiempo, la mayoría migra la mayor parte de sus pedidos al canal propio.',
  },
  {
    q: '¿Qué soporte incluye el plan?',
    a: 'Todos los planes incluyen soporte por WhatsApp en horario extendido, acceso a la base de conocimiento y acompañamiento en el onboarding. Los planes con mayor volumen de locales tienen un Customer Success Manager asignado.',
  },
]

const faqs = computed(() => props.content.items ?? DEFAULT_FAQS)
</script>
