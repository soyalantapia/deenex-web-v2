<template>
  <footer class="relative mt-20 border-t border-white/10 bg-primary text-white overflow-hidden">

    <!-- ambient glow -->
    <div class="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-white/10 to-transparent blur-2xl opacity-30"></div>

    <div class="max-w-6xl mx-auto px-6 py-10">
      
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <!-- Logo + tagline -->
        <div class="flex items-center gap-4">
          <img 
            src="@/assets/images/nav-logo.webp" 
            alt="Deenex" 
            class="h-5 w-auto brightness-0 invert opacity-90"
          />

          <div class="hidden sm:block h-4 w-px bg-white/10"></div>
        </div>

        <!-- Copyright -->
        <p class="text-[11px] text-white/40 tracking-wider">
          © {{ currentYear }} Deenex - Todos los derechos reservados
        </p>

      </div>

    </div>

    <!-- bottom fade -->
    <div class="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>