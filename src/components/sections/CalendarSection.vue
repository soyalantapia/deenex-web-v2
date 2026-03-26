<template>
  <section id="agendar" class="py-24 px-6">
    <div class="max-w-6xl mx-auto">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div>
          <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
            Elegí el día y hora<br/>
            <span class="text-primary italic font-light">que mejor te quede.</span>
          </h2>
        </div>
        <p class="text-slate-500 text-sm leading-relaxed max-w-xs lg:text-right font-medium">
          Reunión de 30 minutos con el equipo de Deenex. Sin compromiso de contratación.
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
const calendarUrl = import.meta.env.VITE_CALENDAR_URL
</script>

