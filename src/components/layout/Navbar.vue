<template>
  <div class="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center px-4">

    <!-- Nav bar -->
    <nav class="w-full max-w-6xl transition-all duration-500 px-4" :class="scrolled ? 'nav-scrolled' : 'nav-top'">

      <div class="flex items-center justify-between h-13">

        <!-- Logo -->
        <a href="#" @click="scrollToTop" class="shrink-0">
          <img src="../../assets/images/nav-logo.webp" alt="Deenex" class="h-[22px] w-auto transition-all duration-500"
            :class="scrolled ? 'brightness-0 invert' : ''" />
        </a>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-1">
          <a v-for="link in navLinks" :key="link.label" :href="link.href"
            class="px-3.5 py-2 text-[0.82rem] font-semibold rounded-xl transition-all duration-200" :class="scrolled
              ? activeSection === link.href.slice(1)
                ? 'text-white bg-white/15'
                : 'text-white/65 hover:text-white hover:bg-white/10'
              : activeSection === link.href.slice(1)
                ? 'text-primary'
                : 'text-slate-600 hover:text-slate-900'">{{ link.label }}</a>
        </div>

        <!-- Desktop CTA + Mobile hamburger -->
        <div class="flex items-center gap-3">
          <a href="#agendar"
            @click="trackEvent('click_agendar_demo')"
            class="hidden md:inline-flex items-center gap-2 text-[0.82rem] font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shrink-0"
            :class="scrolled
              ? 'bg-white text-primary hover:bg-slate-50'
              : 'bg-primary text-white hover:bg-[#3c1fc9] shadow-md shadow-primary/25'">
            Agendar Demo
          </a>

          <!-- Hamburger -->
          <button @click="isMenuOpen = !isMenuOpen"
            class="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-xl transition-all"
            aria-label="Menú">
            <span class="block w-[18px] h-[1.5px] rounded-full transition-all duration-300 origin-center"
              :class="[isMenuOpen ? 'rotate-45 translate-y-[6.5px]' : '', scrolled ? 'bg-white' : 'bg-slate-800']"></span>
            <span class="block w-[18px] h-[1.5px] rounded-full transition-all duration-300"
              :class="[isMenuOpen ? 'opacity-0 scale-x-0' : '', scrolled ? 'bg-white' : 'bg-slate-800']"></span>
            <span class="block w-[18px] h-[1.5px] rounded-full transition-all duration-300 origin-center"
              :class="[isMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : '', scrolled ? 'bg-white' : 'bg-slate-800']"></span>
          </button>
        </div>

      </div>
    </nav>

    <!-- Mobile dropdown - card separada debajo del pill -->
    <Transition name="menu">
      <div v-if="isMenuOpen"
        class="md:hidden w-full max-w-[1000px] mt-2 bg-white rounded-2xl overflow-hidden shadow-xl shadow-slate-900/12 border border-slate-100">
        <div class="p-2.5">
          <a v-for="link in navLinks" :key="link.label" :href="link.href" @click="isMenuOpen = false"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
            :class="activeSection === link.href.slice(1)
              ? 'text-primary bg-primary/6'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'">
            {{ link.label }}
            <span v-if="activeSection === link.href.slice(1)" class="w-1.5 h-1.5 rounded-full bg-primary"></span>
          </a>
        </div>
        <div class="px-2.5 pb-2.5">
          <a href="#agendar" @click="isMenuOpen = false; trackEvent('click_agendar_demo')"
            class="flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl bg-primary text-white hover:bg-[#3c1fc9] transition-colors shadow-md shadow-primary/20">
            Agendar Demo
            <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { trackEvent } from '@/utils/analytics'

const isMenuOpen = ref(false)
const scrolled = ref(false)
const activeSection = ref('')

const navLinks = [
  { label: 'Infraestructura', href: '#infraestructura' },
  { label: 'Delivery', href: '#logistica' },
  { label: 'Loyalty', href: '#fidelizacion' },
  { label: 'Marketing', href: '#marketing' },
  { label: 'Producto', href: '#demo' },
  // { label: 'Precios', href: '#precios' },
]

function onScroll() {
  scrolled.value = window.scrollY > 60
}

function scrollToTop(e) {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let observer = null

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.documentElement.style.scrollBehavior = 'smooth'

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 })

  navLinks.forEach(link => {
    const el = document.querySelector(link.href)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
/* Sin fondo por defecto - pill flotante */
.nav-top {
  background: transparent;
  border-radius: 1.25rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

/* Con fondo al hacer scroll - pill con color */
.nav-scrolled {
  background: var(--primary);
  border-radius: 1rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

/* Mobile menu */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>
