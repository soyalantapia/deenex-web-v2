<template>
  <section id="success-case" class="py-24 px-6 sm:px-12">
    <div class="max-w-6xl mx-auto">

      <!-- Header — mismo patrón que la sección marketing -->
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
          El impacto real <br />
          <span class="text-primary italic font-light">de una gran entrega.</span>
        </h2>
        <div class="hidden lg:block max-w-[280px] text-right relative lg:ml-auto">
          <div class="absolute -left-10 top-0 bottom-0 w-px bg-slate-200/60"></div>
          <p class="text-slate-400 text-sm leading-relaxed pr-2">
            "Cuando los números hablan solos, no hace falta convencer a nadie."
          </p>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid lg:grid-cols-2 lg:items-stretch gap-0 lg:gap-24">

        <!-- Features col -->
        <div class="flex flex-col gap-3 order-1 pt-4 lg:pt-0">

          <!-- Cita estilo card con barra primary -->
          <blockquote class="relative border border-slate-200 rounded-2xl p-5 pl-6 bg-white shadow-sm">
            <div class="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-primary" />
            <p class="text-sm text-slate-500 leading-relaxed italic">
              "Deenex superó nuestras expectativas. Estamos recuperando clientes que compraban por apps de terceros y
              volviendo a fidelizarlos en nuestro propio ámbito."
            </p>
            <footer class="mt-2 text-[11px] text-slate-400 tracking-wide uppercase font-semibold">
              — Marcos Aldazábal, Socio y Fundador
            </footer>
          </blockquote>

          <!-- Feature cards — idénticas a las de marketing -->
          <div v-for="item in successFeatures" :key="item.title"
            class="flex items-start gap-4 border border-slate-200 hover:border-slate-300 rounded-2xl p-5 bg-white transition-colors">
            <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-0.5">
              <component :is="item.icon" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 mb-1 leading-tight">{{ item.title }}</h3>
              <p class="text-xs text-slate-500 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>

          <!-- Métricas -->
          <div class="flex border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="flex-1 px-5 py-4 bg-white hover:bg-slate-50 transition-colors">
              <p class="text-2xl font-extrabold tracking-tighter text-slate-900 uppercase">2X</p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fidelización</p>
            </div>
            <div class="flex-1 px-5 py-4 bg-white border-l border-slate-200 hover:bg-slate-50 transition-colors">
              <p class="text-2xl font-extrabold tracking-tighter text-slate-900">+40%</p>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Clientes Recuperados</p>
            </div>
          </div>

        </div>

        <!-- Video — Dentro de Mockup iPhone 14 Pro Deep Purple -->
        <div class="flex items-center justify-center order-2 lg:order-2 lg:pl-12 mt-5 lg:mt-0">
          <div class="relative w-full max-w-[300px] cursor-pointer group" @click="togglePlay">
            <!-- Mockup PNG con mix-blend-mode para quitar el fondo blanco -->
            <img src="https://mockuphone.com/images/devices_picture/apple-iphone14pro-deeppurple-portrait.png"
              class="relative z-20 w-full h-auto pointer-events-none mix-blend-multiply" alt="iPhone 14 Pro Mockup" />

            <!-- Contenedor del Video — Ajustado para tapar bordes blancos -->
            <div
              class="absolute top-[2.2%] left-[6.1%] right-[6.1%] bottom-[2.2%] z-10 rounded-[2.5rem] sm:rounded-[2.8rem] overflow-hidden bg-black">
              <video ref="videoRef" class="w-full h-full object-cover" loop playsinline preload="metadata">
                <source src="@/assets/video/testimonio.mp4#t=1" type="video/mp4" />
              </video>

              <!-- Botón de Play Central -->
              <div v-if="!isPlaying"
                class="absolute inset-0 flex items-center justify-center bg-black/30 z-40 transition-opacity">
                <div
                  class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Play class="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              <!-- Fade inferior mejorado para el frame del celular -->
              <div
                class="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-black/80 to-transparent z-40 pointer-events-none" />
            </div>

            <!-- Efecto Glow de fondo (Deep Purple) -->
            <div
              class="absolute inset-10 bg-purple-600/20 blur-[80px] -z-10 group-hover:bg-purple-600/30 transition-all duration-700">
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MessageSquare, Heart, Repeat, Play, Volume2 } from 'lucide-vue-next'

const videoRef = ref(null)
const isPlaying = ref(false)

const successFeatures = [
  {
    title: 'Menú digital empático',
    desc: 'Una interfaz amena y fácil para que el cliente haga sus pedidos diariamente colaborando con la gestión.',
    icon: Heart,
  },
  {
    title: 'Soporte y respuesta ágil',
    desc: 'La atención personalizada y la diversidad de recursos de Deenex superaron nuestras expectativas.',
    icon: MessageSquare,
  },
  {
    title: 'Recuperación de clientes',
    desc: 'Volvimos a fidelizar clientes que antes hacían sus pedidos por apps externas como Rappi o PedidosYa.',
    icon: Repeat,
  },
]

function togglePlay() {
  if (!videoRef.value) return

  if (videoRef.value.paused) {
    videoRef.value.play()
    isPlaying.value = true
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
}

onMounted(() => {
  if (videoRef.value) {
    videoRef.value.volume = 0.3 // Sonido bajo por defecto
  }
})
</script>