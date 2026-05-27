<template>
  <div class="whatsapp-btn-wrapper fixed bottom-6 right-6 z-50">
    <!-- Main Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/30 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <!-- Message icon -->
      <MessageCircle class="h-8 w-8 transition-transform" />
    </a>

  </div>
</template>

<script setup>
import { MessageCircle } from 'lucide-vue-next'
import { whatsappLink } from '@/utils/contact'

// Single-source-of-truth: lee el número desde utils/contact.js (que ya combina
// env + fallback hardcoded). Antes leíamos VITE_WHATSAPP_NUMBER directo y
// podía divergir del número expuesto en FAQSection y otros lugares.
const whatsappUrl = whatsappLink('¡Hola! Me gustaría saber más sobre Deenex.')
</script>


<style scoped>
/* No styles needed, using utility classes */
</style>

