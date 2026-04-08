<template>
  <div class="relative">
    <!-- Contenedor con fondo sutil y gradiente -->
    <div
      class="bg-gradient-to-br from-slate-50/80 to-white border border-slate-100/80 backdrop-blur-sm rounded-[2.5rem] p-8 sm:p-12 overflow-hidden shadow-sm">
      <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        <!-- Texto explicativo -->
        <div class="lg:w-1/3 text-center lg:text-left">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Ecosistema & Alianzas
          </div>
          <p class="text-[1.05rem] text-slate-600 font-medium leading-relaxed">
            Potenciamos tu negocio a través de alianzas con empresas que aportan
            <span class="text-slate-900 font-bold">valor diferencial</span> y soluciones integrales.
          </p>
        </div>

        <!-- Separador (Solo Desktop) -->
        <div class="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

        <!-- Logos (Grid más limpio y espaciado) -->
        <div class="lg:flex-1 w-full">
          <div class="grid grid-cols-3 sm:grid-cols-3 gap-6 sm:gap-10">
            <div v-for="partner in partners" :key="partner.src"
              class="group flex items-center justify-center p-2 transition-all duration-300">
              <img :src="partner.src"
                :class="[partner.class, 'w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500']" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decoración sutil -->
    <div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
    <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
  </div>
</template>

<script setup>
const partners = [
  { src: new URL('../../assets/images/clients/pimenton.png', import.meta.url).href, class: 'h-10 sm:h-12' },
  { src: new URL('../../assets/images/clients/sportclub.png', import.meta.url).href, class: 'h-16 sm:h-[6rem]' },
  { src: new URL('../../assets/images/clients/mp.png', import.meta.url).href, class: 'h-14 sm:h-[6rem]' },
  { src: new URL('../../assets/images/clients/Odoo.webp', import.meta.url).href, class: 'h-10 sm:h-12' },
  { src: new URL('../../assets/images/clients/ayres.webp', import.meta.url).href, class: 'h-10 sm:h-12' },
  { src: new URL('../../assets/images/clients/Maxirest.webp', import.meta.url).href, class: 'h-10 sm:h-12' },
]
</script>