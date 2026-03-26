<template>
  <LoadingScreen @done="isReady = true" />
  <div class="relative min-h-screen transition-opacity duration-1000" :class="{ 'opacity-0': !isReady, 'opacity-100': isReady }">
    <RouterView />
    <WhatsAppFloatingButton v-if="isReady" />
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import WhatsAppFloatingButton from '@/components/common/WhatsAppFloatingButton.vue'

const isReady = ref(false)
</script>



