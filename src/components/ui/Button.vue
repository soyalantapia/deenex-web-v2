<template>
  <button
    class="relative inline-flex items-center justify-center gap-2 overflow-hidden bg-primary px-7 py-3.5 text-[15px] font-semibold tracking-tight text-white sm:px-9 sm:py-4 sm:text-[16px]"
    style="letter-spacing: -0.015em; border-radius: 8px; box-shadow: 0 4px 12px rgba(var(--primary-rgb, 100, 100, 255), 0.2);"
  >
    <slot />
  </button>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
/* Transición suave para interactividad premium */
button:hover {
  box-shadow: 0 6px 16px rgba(var(--primary-rgb, 100, 100, 255), 0.3);
}

button:active {
  transform: translateY(0);
}
</style>
