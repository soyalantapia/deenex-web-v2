<template>
  <section id="marketing" class="py-24 px-6 sm:px-12 relative overflow-hidden">
    <div class="max-w-6xl mx-auto">

      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
          Tus campañas segmentadas <br/>
          <span class="text-primary italic font-light">en un solo lugar.</span>
        </h2>
        <div class="hidden lg:block max-w-[320px] text-right relative lg:ml-auto">
          <div class="absolute -left-10 top-0 bottom-0 w-px bg-slate-200/60"></div>
          <p class="text-slate-400 text-sm leading-relaxed pr-2">
            "Tus clientes reciben mensajes personalizados mientras vos operás todo desde un solo panel."
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 lg:items-stretch gap-0 lg:gap-24">

        <div class="relative bg-white rounded-t-[2.5rem] lg:rounded-[2rem] overflow-hidden order-1 h-[440px] sm:h-[480px] lg:h-full lg:min-h-[400px]">
          <div class="absolute inset-x-0 top-0 bottom-0 flex items-start justify-center pointer-events-none px-6">
            <img
              src="@/assets/images/marketing.webp"
              class="w-[110%] lg:w-full h-auto object-contain origin-top scale-[1.1] sm:scale-100 lg:scale-[0.9] pt-4 lg:pt-0"
              alt="Marketing Automation Preview"
            />
          </div>
          <div class="absolute inset-x-0 bottom-0 h-[160px] lg:h-[100px] bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
        </div>

        <!-- Carrusel, estructura original intacta, solo se agrega ref y eventos -->
        <div
          ref="carouselRef"
          class="flex flex-row lg:flex-col gap-4 lg:gap-3 order-2 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide pb-6 lg:pb-0 pt-4 lg:pt-0 -mx-6 px-6 lg:mx-0 lg:px-0 -mt-14 lg:mt-0 relative z-30"
          @scroll="onScroll"
          @touchstart="isPaused = true"
          @touchend="resumeAuto"
        >
          <div
            v-for="item in marketingFeatures" :key="item.title"
            class="flex-shrink-0 w-[88vw] sm:w-[340px] lg:w-auto snap-center flex items-start gap-4 border border-slate-200 hover:border-slate-300 rounded-2xl p-5 bg-white transition-colors"
          >
            <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-0.5">
              <component :is="item.icon" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 mb-1 leading-tight">{{ item.title }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Dots indicadores, solo mobile, fuera del grid para no romper el layout -->
      <div class="flex lg:hidden items-center justify-center gap-2 mt-4">
        <button
          v-for="(_, i) in marketingFeatures"
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
import { Sparkles, Send, Bell } from 'lucide-vue-next'

const marketingFeatures = [
  {
    title: 'Segmentación con IA',
    desc: 'Generá audiencias inteligentes de forma simple basándose en el comportamiento real de tus clientes.',
    icon: Sparkles,
  },
  {
    title: 'WhatsApp Marketing',
    desc: 'Campañas personalizadas directas al canal más efectivo con altísimos niveles de lectura y retorno.',
    icon: Send,
  },
  {
    title: 'Push Inteligente',
    desc: 'Notificaciones contextuales para activar usuarios en el momento exacto de su jornada de compra.',
    icon: Bell,
  },
]

const carouselRef = ref(null)
const activeIndex = ref(0)
let autoTimer = null
let isPaused = false

function onScroll() {
  const el = carouselRef.value
  if (!el) return
  // Detecta el card visible por posición de scroll relativa al ancho total
  activeIndex.value = Math.round((el.scrollLeft) / (el.scrollWidth / marketingFeatures.length))
}

function scrollToCard(i) {
  const el = carouselRef.value
  if (!el) return
  const cardWidth = el.scrollWidth / marketingFeatures.length
  el.scrollTo({ left: cardWidth * i, behavior: 'smooth' })
  activeIndex.value = i
}

function resumeAuto() {
  setTimeout(() => { isPaused = false }, 3000)
}

function tick() {
  if (isPaused) return
  const next = (activeIndex.value + 1) % marketingFeatures.length
  scrollToCard(next)
}

onMounted(() => { autoTimer = setInterval(tick, 3200) })
onUnmounted(() => { clearInterval(autoTimer) })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>