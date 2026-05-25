<template>
  <!--
    LoadingScreen + WhatsAppFloatingButton viven en la landing pública (/, secciones
    de marketing). En el flow de onboarding (/comenzar/*) los ocultamos: el lead
    tiene que poder llenar el form sin un splash de 2s entre cada step.
  -->
  <LoadingScreen v-if="showLanding" @done="isReady = true" />
  <div
    class="relative min-h-screen transition-opacity duration-1000"
    :class="{ 'opacity-0': showLanding && !isReady, 'opacity-100': !showLanding || isReady }"
  >
    <RouterView />
    <WhatsAppFloatingButton v-if="showLanding && isReady" />
    <!--
      TrialBanner: solo en landing. Aparece si el lead ya activó su trial pero
      todavía no llegó al primer cargo. El componente decide internamente si
      se muestra (lee state desde useOnboarding).
    -->
    <TrialBanner v-if="showLanding && isReady" />
    <!--
      CookieConsentBanner: GDPR + Ley 25.326. Aparece en cualquier ruta si el
      lead no eligió previamente. Pre-condición regulatoria — sin esto, multas
      potenciales de USD 100k+. Se muestra una sola vez por máquina.
    -->
    <CookieConsentBanner />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import WhatsAppFloatingButton from '@/components/common/WhatsAppFloatingButton.vue'
import TrialBanner from '@/components/common/TrialBanner.vue'
import CookieConsentBanner from '@/components/common/CookieConsentBanner.vue'

const isReady = ref(false)
const route = useRoute()

// Las rutas del onboarding usan un layout propio y no necesitan el LoadingScreen.
const showLanding = computed(() => !route.path.startsWith('/comenzar'))
</script>
