<template>
  <section id="logistica" class="py-24 px-6 sm:px-12 relative overflow-hidden bg-white">
    <div class="max-w-6xl mx-auto">

      <div class="text-left mb-10">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
          Tu delivery, <br />
          <span class="text-primary italic font-light">sin comisiones.</span>
        </h2>
      </div>

      <div class="grid lg:grid-cols-2 lg:items-stretch gap-0 lg:gap-24">

        <!-- Carrusel — estructura original intacta, solo se agrega ref y eventos -->
        <div ref="carouselRef"
          class="flex flex-row lg:grid lg:grid-cols-2 gap-4 order-2 lg:order-1 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide pb-6 lg:pb-0 pt-4 lg:pt-0 -mx-6 px-6 lg:mx-0 lg:px-0 -mt-14 lg:mt-0 relative z-30 lg:content-center"
          @scroll="onScroll" @touchstart="isPaused = true" @touchend="resumeAuto">
          <div v-for="item in logisticsFeatures" :key="item.title"
            class="flex-shrink-0 w-[88vw] sm:w-[340px] lg:w-auto snap-center border border-slate-200 hover:border-slate-300 rounded-2xl p-6 bg-white transition-colors flex flex-col">
            <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mb-4">
              <component :is="item.icon" class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-sm font-semibold text-slate-900 mb-1.5 leading-tight">{{ item.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>

        <div
          class="relative rounded-t-[2.5rem] lg:rounded-[2rem] overflow-hidden order-1 lg:order-2 h-[440px] sm:h-[480px] lg:h-full lg:min-h-[500px]">
          <div class="absolute inset-x-0 top-0 bottom-0 flex items-start justify-center pointer-events-none px-6">
            <img src="@/assets/images/order-deenex.webp" alt="Deenex Mobile App"
              class="w-[125%] sm:w-[90%] lg:w-[130%] h-auto object-contain origin-top scale-[1.05] lg:scale-[0.85] pt-12 lg:pt-8" />
          </div>
          <div
            class="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-white via-white/70 to-transparent z-20 pointer-events-none">
          </div>

          <div class="absolute inset-0 pointer-events-none z-30">
            <div v-for="logo in partnerLogos" :key="logo.alt"
              :class="['absolute bg-white rounded-full shadow-lg border border-slate-100 overflow-hidden animate-float', logo.class]"
              :style="logo.style">
              <img :src="logo.src" :alt="logo.alt" class="w-full h-full object-contain p-1.5" />
            </div>
          </div>
        </div>

      </div>

      <Partners class="v-reveal mt-20" />

      <!-- Dots indicadores — solo mobile, fuera del grid para no romper el layout -->
      <div class="flex lg:hidden items-center justify-center gap-2 mt-3">
        <button v-for="(_, i) in logisticsFeatures" :key="i" @click="scrollToCard(i)"
          class="transition-all duration-300 rounded-full"
          :class="activeIndex === i ? 'bg-primary w-6 h-2' : 'bg-slate-300 w-2 h-2'" />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ShieldCheck, Truck, CircleDollarSign, BarChart3 } from 'lucide-vue-next'
import Partners from '@/components/sections/Partners.vue'
const logisticsFeatures = [
  {
    title: 'Marca Blanca',
    desc: 'Experiencia 100% bajo tu marca. Tus clientes acceden a tu club de beneficios desde su casa.',
    icon: ShieldCheck,
  },
  {
    title: 'Red Logística',
    desc: 'Partners líderes que orquestan el despacho basado en costo y eficiencia.',
    icon: Truck,
  },
  {
    title: 'Cero Comisiones',
    desc: 'Sin comisiones ocultas por venta. Todo el margen queda en tu negocio.',
    icon: CircleDollarSign,
  },
  {
    title: 'Control Total',
    desc: 'Los datos son 100% tuyos. Reimpactá a tus clientes sin intermediarios.',
    icon: BarChart3,
  },
]

const partnerLogos = [
  {
    src: new URL('@/assets/images/delivery/pedidosya.webp', import.meta.url).href,
    alt: 'Pedidos Ya',
    class: 'top-[8%] right-[5%] lg:top-[10%] lg:right-[8%] w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
    style: 'animation-duration:5.5s',
  },
  {
    src: new URL('@/assets/images/delivery/cargo.webp', import.meta.url).href,
    alt: 'Cargo by Rappi',
    class: 'top-[22%] left-[2%] lg:top-[18%] lg:left-[5%] w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
    style: 'animation-delay:0.8s;animation-duration:6s',
  },
  {
    src: new URL('@/assets/images/delivery/cabify.webp', import.meta.url).href,
    alt: 'Cabify',
    class: 'top-1/3 right-1/2 translate-x-[40%] lg:top-1/2 lg:left-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2',
    style: 'animation-delay:1.8s;animation-duration:7s',
  },
  {
    src: new URL('@/assets/images/delivery/rapiboy.webp', import.meta.url).href,
    alt: 'Rapi Boy',
    class: 'bottom-[28%] right-[8%] lg:bottom-[22%] lg:right-[6%] w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-2',
    style: 'animation-delay:1.2s;animation-duration:6.2s',
  },
  {
    src: new URL('@/assets/images/delivery/punni.webp', import.meta.url).href,
    alt: 'Punni',
    class: 'bottom-[35%] left-[8%] lg:bottom-[26%] lg:left-[8%] w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24',
    style: 'animation-delay:0.4s;animation-duration:5.2s',
  },
]

const carouselRef = ref(null)
const activeIndex = ref(0)
let autoTimer = null
let isPaused = false

function onScroll() {
  const el = carouselRef.value
  if (!el) return
  activeIndex.value = Math.round(el.scrollLeft / (el.scrollWidth / logisticsFeatures.length))
}

function scrollToCard(i) {
  const el = carouselRef.value
  if (!el) return
  el.scrollTo({ left: (el.scrollWidth / logisticsFeatures.length) * i, behavior: 'smooth' })
  activeIndex.value = i
}

function resumeAuto() {
  setTimeout(() => { isPaused = false }, 3000)
}

function tick() {
  if (isPaused) return
  scrollToCard((activeIndex.value + 1) % logisticsFeatures.length)
}

onMounted(() => { autoTimer = setInterval(tick, 3400) })
onUnmounted(() => { clearInterval(autoTimer) })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float ease-in-out infinite;
}
</style>