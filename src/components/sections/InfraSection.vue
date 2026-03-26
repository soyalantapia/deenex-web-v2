<template>
  <section id="infraestructura" class="py-24 px-6 sm:px-12 relative overflow-hidden bg-white">
    <div class="max-w-6xl mx-auto">

      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
          Un solo sistema para vender <br/>
          <span class="text-primary italic font-light">en todos tus locales y canales.</span>
        </h2>
        <div class="hidden lg:block max-w-[320px] text-right relative lg:ml-auto">
          <div class="absolute -left-10 top-0 bottom-0 w-px bg-slate-200/60"></div>
          <p class="text-slate-400 text-sm leading-relaxed pr-2">
            "Tus clientes piden desde tu propia app. Vos operás todo desde un solo panel."
          </p>
        </div>
      </div>

      <!-- Carrusel -->
      <div
        ref="carouselRef"
        class="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-hidden pb-6 md:pb-0 scrollbar-hide snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0"
        @scroll="onScroll"
        @touchstart="isPaused = true"
        @touchend="resumeAuto"
      >
        <div
          v-for="(item, index) in features"
          :key="item.title"
          class="relative min-w-[280px] sm:min-w-[300px] md:min-w-0 border border-slate-200 hover:border-slate-300 rounded-2xl p-7 snap-center transition-colors duration-200 flex flex-col"
        >
          <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mb-5">
            <component :is="item.icon" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-base font-semibold text-slate-900 mb-2 leading-tight">{{ item.title }}</h3>
          <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
          <span class="absolute bottom-5 right-6 text-[2.5rem] font-bold text-slate-100 select-none leading-none">0{{ index + 1 }}</span>
        </div>
      </div>

      <!-- Dots — solo mobile, con auto-scroll -->
      <div class="flex justify-center gap-2 mt-4 md:hidden">
        <button
          v-for="(_, i) in features"
          :key="i"
          @click="scrollToCard(i)"
          class="transition-all duration-300 rounded-full"
          :class="activeIndex === i ? 'bg-primary w-6 h-2' : 'bg-slate-300 w-2 h-2'"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Layers, ShoppingBag, Users } from 'lucide-vue-next'

const features = [
  {
    title: 'App Web & Stores',
    desc: 'Publicamos tu propia web y apps oficiales en App Store y Play Store bajo tu marca. Sin comisiones por venta, con total soberanía sobre tus clientes.',
    icon: Layers,
  },
  {
    title: 'Omnicanal Real',
    desc: 'Mesa, Take Away y Delivery integrados en un solo flujo. Tus clientes eligen cómo pedir; vos operás todo desde el mismo sistema.',
    icon: ShoppingBag,
  },
  {
    title: 'Clientes Registrados',
    desc: 'Convertí visitas en registros que luego vas a poder activar con campañas. El proceso de registro es 100% personalizable.',
    icon: Users,
  },
]

const carouselRef = ref(null)
const activeIndex = ref(0)
let autoTimer = null
let isPaused = false

function onScroll() {
  const el = carouselRef.value
  if (!el) return
  activeIndex.value = Math.round(el.scrollLeft / (el.scrollWidth / features.length))
}

function scrollToCard(i) {
  const el = carouselRef.value
  if (!el) return
  el.scrollTo({ left: (el.scrollWidth / features.length) * i, behavior: 'smooth' })
  activeIndex.value = i
}

function resumeAuto() {
  setTimeout(() => { isPaused = false }, 3000)
}

function tick() {
  if (isPaused) return
  scrollToCard((activeIndex.value + 1) % features.length)
}

onMounted(() => { autoTimer = setInterval(tick, 3000) })
onUnmounted(() => { clearInterval(autoTimer) })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
