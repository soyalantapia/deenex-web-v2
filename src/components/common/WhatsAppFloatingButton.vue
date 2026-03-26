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

const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER
const message = '¡Hola! Me gustaría saber más sobre Deenex.'
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
</script>


<style scoped>
/* No styles needed — using utility classes */
</style>

