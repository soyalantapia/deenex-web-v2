<template>
  <!--
    404 con doble salida: CTA primaria al home, secundaria al trial.
    El lead que cae acá por error de tipeo no se pierde; le ofrecemos
    el path de conversión más fuerte como segunda opción.
  -->
  <div class="min-h-screen bg-white flex items-center justify-center px-6 py-12">
    <div class="text-center max-w-md">
      <!-- Glow de fondo sutil -->
      <div class="relative">
        <div class="absolute -inset-12 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
        <p class="relative text-[clamp(5rem,12vw,8rem)] font-black text-primary leading-none tracking-tighter mb-2">
          404
        </p>
      </div>

      <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 mb-3">
        Esta página no existe.
      </h1>
      <p class="text-base text-slate-500 leading-relaxed mb-8">
        Puede que la hayas escrito mal o que la hayamos movido.
        Probá una de estas opciones:
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          @click="goHome"
          class="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-6 py-3 text-sm transition-all shadow-md shadow-primary/20"
        >
          ← Ir al inicio
        </button>
        <button
          @click="goTrial"
          class="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl px-6 py-3 text-sm transition-colors border border-slate-200"
        >
          Empezar 14 días gratis →
        </button>
      </div>

      <p class="mt-8 text-[11px] text-slate-400 leading-relaxed">
        Si llegaste por un link de email roto, escribinos a
        <a :href="`mailto:${CONTACT_EMAIL}`" class="underline hover:text-slate-600">{{ CONTACT_EMAIL }}</a>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { CONTACT_EMAIL } from '@/utils/contact'

const router = useRouter()
const goHome = () => router.push({ name: 'home' })
const goTrial = () => router.push({ path: '/comenzar', query: { from: 'not_found' } })
</script>
