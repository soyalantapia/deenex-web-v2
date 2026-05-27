<template>
  <section id="partners" class="py-12 overflow-hidden">
    <div class="max-w-6xl mx-auto">
      <Vue3Marquee :duration="15" :gradient="true" :clone="true">
        <div v-for="img in imgArray" :key="img" class="mx-8 sm:mx-16 flex items-center justify-center">
          <img :src="img" :alt="img"
            class="h-14 sm:h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
        </div>
      </Vue3Marquee>
    </div>
  </section>
</template>

<script setup>
import { Vue3Marquee } from 'vue3-marquee'

const imgArray = [
  new URL('../../assets/images/clients/coquitos.webp', import.meta.url).href,
  new URL('../../assets/images/clients/la-fabrica.webp', import.meta.url).href,
  new URL('../../assets/images/clients/monti.webp', import.meta.url).href,
  new URL('../../assets/images/clients/quem.webp', import.meta.url).href,
  new URL('../../assets/images/clients/palta.webp', import.meta.url).href,
  new URL('../../assets/images/clients/emplatame.webp', import.meta.url).href,
  new URL('../../assets/images/clients/glorias.webp', import.meta.url).href,
  new URL('../../assets/images/clients/hatsu.webp', import.meta.url).href,
  new URL('../../assets/images/clients/konex.webp', import.meta.url).href,
]
</script>