<template>
  <section id="partners" class="py-12 overflow-hidden" aria-label="Clientes activos en Deenex">
    <div class="max-w-6xl mx-auto">
      <Vue3Marquee :duration="15" :gradient="true" :clone="true">
        <div v-for="client in clients" :key="client.src" class="mx-8 sm:mx-16 flex items-center justify-center">
          <img :src="client.src" :alt="client.name" loading="lazy"
            class="h-14 sm:h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
        </div>
      </Vue3Marquee>
    </div>
  </section>
</template>

<script setup>
import { Vue3Marquee } from 'vue3-marquee'

// `name` se usa como alt para a11y. Antes el alt era la URL completa (`:alt="img"`),
// que los SR leían como "https://.../coquitos.webp" — ruido inútil. Ahora cada
// logo se anuncia por la marca real. La marquee duplica los elementos (clone=true)
// y el SR lee solo el original gracias al `aria-label` del <section>.
const clients = [
  { src: new URL('../../assets/images/clients/coquitos.webp', import.meta.url).href, name: 'Coquitos' },
  { src: new URL('../../assets/images/clients/la-fabrica.webp', import.meta.url).href, name: 'La Fábrica' },
  { src: new URL('../../assets/images/clients/monti.webp', import.meta.url).href, name: 'Monti' },
  { src: new URL('../../assets/images/clients/quem.webp', import.meta.url).href, name: 'QUEM' },
  { src: new URL('../../assets/images/clients/palta.webp', import.meta.url).href, name: 'Palta' },
  { src: new URL('../../assets/images/clients/emplatame.webp', import.meta.url).href, name: 'Emplatame' },
  { src: new URL('../../assets/images/clients/glorias.webp', import.meta.url).href, name: 'Glorias' },
  { src: new URL('../../assets/images/clients/hatsu.webp', import.meta.url).href, name: 'Hatsu' },
  { src: new URL('../../assets/images/clients/konex.webp', import.meta.url).href, name: 'Konex' },
]
</script>