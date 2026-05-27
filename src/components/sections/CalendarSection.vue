<template>
  <section id="agendar" class="py-24 px-6">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div>
          <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
            {{ headlineLine1 }}<br/>
            <span class="text-primary italic font-light">{{ headlineLine2 }}</span>
          </h2>
        </div>
        <p class="text-slate-500 text-sm leading-relaxed max-w-xs lg:text-right font-medium">
          {{ subtitle }}
        </p>
      </div>

      <!-- Iframe container -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <iframe
          :src="calendarUrl"
          width="100%"
          height="auto"
          frameborder="0"
          scrolling="no"
          class="block w-full h-[1330px] sm:h-[750px]"
          title="Agendar Demo Deenex"
        ></iframe>
      </div>


    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { trackEvent } from '@/utils/analytics'

const props = defineProps({
  content: { type: Object, default: () => ({}) },
})

const headlineLine1 = computed(() => props.content.headlineLine1 ?? 'Elegí el día y hora')
const headlineLine2 = computed(() => props.content.headlineLine2 ?? 'que mejor te quede.')
const subtitle = computed(
  () => props.content.subtitle ?? 'Reunión de 30 minutos con el equipo de Deenex. Sin compromiso de contratación.',
)

const calendarUrl = import.meta.env.VITE_CALENDAR_URL

const handleCalendarMessage = (e) => {
  // Common patterns for calendar providers (Calendly, Cal.com, etc.)
  const isScheduled = e.data.event === 'calendly.event_scheduled' || 
                      e.data.event === 'scheduled' ||
                      (typeof e.data === 'string' && e.data.includes('event_scheduled'))

  if (isScheduled) {
    trackEvent('agenda_demo_completado')
  }
}

onMounted(() => {
  window.addEventListener('message', handleCalendarMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleCalendarMessage)
})
</script>

