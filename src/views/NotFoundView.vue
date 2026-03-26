<template>
  <div class="min-h-screen bg-secondary flex items-center justify-center font-body">
    <div class="text-center px-6 max-w-md">
      <h1 class="text-8xl font-heading font-bold text-title mb-4">404</h1>
      <p class="text-3xl text-tertiary mb-6">Página no encontrada</p>
      <p class="text-tertiary mb-10">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>

      <button
        @click="goHome"
        class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all hover:scale-105 active:scale-95"
      >
        ← Volver al Inicio
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFoundView',
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push({ name: 'home' })
    }

    return { goHome }
  },
}
</script>
