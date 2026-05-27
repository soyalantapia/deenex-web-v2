<template>
  <div
    v-if="!hidden"
    id="loader"
    class="loader-container fixed inset-0 z-[99999] flex items-center justify-center bg-[#f8f9fb] overflow-hidden"
  >
    <!-- Background grid -->
    <div class="loader-bg-grid opacity-100"></div>
    <!-- Noise texture (v. subtle for texture) -->
    <div class="loader-noise opacity-[0.015]"></div>

    <!-- Logo container -->
    <div class="relative z-10 flex items-center justify-center w-full h-full p-6">
      <div id="loader-logo" class="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-[90vw] md:max-w-none">

        <!-- Icon part: dots + D -->
        <div class="w-[18vw] max-w-[80px] md:w-[140px] aspect-[205/138] flex-shrink-0">
          <svg viewBox="0 0 205 138" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <rect id="dot-1" x="0" y="36" width="23" height="23" fill="#695EDE" class="logo-part dot"/>
            <rect id="dot-2" x="35" y="53" width="28" height="28" fill="#695EDE" class="logo-part dot"/>
            <rect id="dot-3" x="6" y="82" width="18" height="18" fill="#695EDE" class="logo-part dot"/>
            <path id="line-1" d="M8 98H42" stroke="#695EDE" stroke-width="7" stroke-linecap="round" class="logo-part line"/>
            <path id="line-2" d="M8 82H42" stroke="#695EDE" stroke-width="7" stroke-linecap="round" class="logo-part line"/>
            <path id="line-3" d="M8 44H42" stroke="#695EDE" stroke-width="7" stroke-linecap="round" class="logo-part line"/>

            <path id="logo-d" d="M202.054 68.6051C202.054 16.7663 170.775 0.554199 123.656 0.554199H31.2217V35.3802H119.846C148.117 35.3802 159.947 41.9852 159.947 68.6051C159.947 95.6253 148.117 102.23 119.846 102.23H31.2217V137.056H123.656C170.374 137.056 202.054 122.045 202.054 68.6051Z" fill="#695EDE" class="logo-part d-path"/>
          </svg>
        </div>

        <!-- Word part: EENEX -->
        <div class="w-[45vw] max-w-[200px] md:w-[450px]  aspect-[464/70] flex-shrink-0 ml-[0.4rem] md:ml-[-1.2rem]">



          <svg viewBox="228 35 464 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <path
              id="logo-eenex"
              d="M307.497 99.8052H228.728V40.7717H307.497V54.5347H246.299V64.3159H305.852V75.6551H246.299V86.0422H307.497V99.8052ZM394.732 99.8052H315.963V40.7717H394.732V54.5347H333.535V64.3159H393.088V75.6551H333.535V86.0422H394.732V99.8052ZM420.771 99.8052H403.199V40.7717H423.281L474.005 80.6756V40.7717H491.576V99.8052H471.927L420.771 59.2089V99.8052ZM579.685 99.8052H500.916V40.7717H579.685V54.5347H518.488V64.3159H578.041V75.6551H518.488V86.0422H579.685V99.8052ZM586.161 40.7717H612.562L637.231 61.0266L662.074 40.7717H687.435L651.081 70.2019L687.782 99.8052H661.121L636.885 79.81L612.215 99.8052H586.075L622.862 70.4616L586.161 40.7717Z"
              fill="#695EDE"
              class="logo-part eenex-path"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])
const hidden = ref(false)

// Solo mostramos el loading completo (2.2s) la primera vez por sesión.
// Returning visitors lo ven en 600ms para no frustrarlos con un splash
// largo en cada navegación. Antes era siempre 2200ms — UX cansador.
const SESSION_KEY = 'deenex_loading_shown_v1'
let shownBefore = false
try {
  shownBefore = sessionStorage.getItem(SESSION_KEY) === '1'
} catch { /* sessionStorage bloqueado */ }

const duration = shownBefore ? 600 : 2200

onMounted(() => {
  setTimeout(() => {
    hidden.value = true
    emit('done')
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* */ }
  }, duration)
})
</script>

<style scoped>
.loader-container {
  background: #f8f9fb;
}

.loader-bg-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.05) 1.5px, transparent 1.5px);
  background-size: 32px 32px;
  mask-image: radial-gradient(circle at center, black, transparent 95%);
}

.loader-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23a)'/%3E%3C/svg%3E");
}

/* Animations for logo parts */
.logo-part {
  opacity: 0;
  transform: scale(0.8);
  transform-origin: center;
}

.dot {
  animation: reveal-dot 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
#dot-1 { animation-delay: 0.2s; }
#dot-2 { animation-delay: 0.28s; }
#dot-3 { animation-delay: 0.36s; }

.line {
  animation: reveal-line 0.3s ease-out forwards;
}
#line-1 { animation-delay: 0.44s; }
#line-2 { animation-delay: 0.52s; }
#line-3 { animation-delay: 0.6s; }

.d-path {
  animation: reveal-d 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.65s;
}

.eenex-path {
  animation: reveal-eenex 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.8s;
}

@keyframes reveal-dot {
  to { opacity: 1; transform: scale(1); }
}

@keyframes reveal-line {
  to { opacity: 1; transform: scale(1); }
}

@keyframes reveal-d {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes reveal-eenex {
  from { opacity: 0; transform: translateX(10px); filter: blur(10px); }
  to { opacity: 1; transform: translateX(0); filter: blur(0px); }
}

/* Exit animation for the whole loader */
.loader-container {
  animation: exit-loader 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 1.8s;
}

@keyframes exit-loader {
  to { opacity: 0; transform: scale(1.05); visibility: hidden; }
}
</style>
>
