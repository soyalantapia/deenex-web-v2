<template>
  <section id="partners" class="py-12 bg-white overflow-hidden">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Layout Desktop (Sideways Grid) -->
      <div class="hidden lg:flex lg:flex-row lg:items-center lg:gap-20">
        <!-- Texto lateral -->
        <div class="lg:w-[350px] shrink-0 text-left">
          <h3 class="text-xs font-black text-primary uppercase tracking-[0.25em] mb-4">
            Ecosistema & Alianzas
          </h3>
          <p class="text-[1.1rem] text-slate-500 font-medium leading-relaxed">
            Nos aliamos con empresas que aportan
            <span class="text-slate-900 font-bold">valor diferencial</span> a nuestros clientes.
          </p>
        </div>

        <!-- Grilla con líneas difuminadas -->
        <div class="flex-1 relative pl-10">
          <div class="absolute inset-0 pointer-events-none opacity-60">
            <div
              class="absolute left-1/3 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"
            ></div>
            <div
              class="absolute left-2/3 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"
            ></div>
            <div
              class="absolute top-1/2 left-4 right-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
            ></div>
          </div>

          <div class="grid grid-cols-3 relative z-10">
            <div
              v-for="img in partners"
              :key="img"
              class="p-8 h-36 flex items-center justify-center transition-all"
            >
              <img :src="img" class="h-[60px] w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- Layout Mobile (Marquee like Clients) -->
      <div class="lg:hidden flex flex-col items-center">
        <div class="text-center mb-10 px-4">
          <h3 class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">
            Ecosistema & Alianzas
          </h3>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">
            Nos aliamos con empresas que aportan
            <span class="text-slate-900 font-bold">valor diferencial</span> a nuestros clientes.
          </p>
        </div>

        <div class="w-full">
          <Vue3Marquee :duration="20" gradient="true" :gradientColor="[255, 255, 255]" clone="true">
            <div v-for="img in partners" :key="img" class="mx-8 flex items-center justify-center">
              <img :src="img" :alt="img" class="h-9 w-auto object-contain" />
            </div>
          </Vue3Marquee>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Vue3Marquee } from 'vue3-marquee'

const partners = [
  new URL('../../assets/images/clients/pimenton.webp', import.meta.url).href,
  new URL('../../assets/images/clients/aamf.jpg', import.meta.url).href,
  new URL('../../assets/images/clients/puni.webp', import.meta.url).href,
  new URL('../../assets/images/clients/Odoo.webp', import.meta.url).href,
  new URL('../../assets/images/clients/ayres.webp', import.meta.url).href,
  new URL('../../assets/images/clients/Maxirest.webp', import.meta.url).href,
]
</script>
