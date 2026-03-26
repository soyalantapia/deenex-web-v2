<template>
  <section id="fidelizacion" class="py-24 px-6 sm:px-12 bg-white overflow-hidden">
    <div class="max-w-6xl mx-auto relative">
      
      <div class="text-left mb-16 lg:mb-24">
        <h2 class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900">
          Tu propia máquina de <br/>
          <span class="text-primary italic font-light">recurrencia y lealtad.</span>
        </h2>
      </div>

      <!-- Desktop View -->
      <div class="hidden lg:grid grid-cols-[1fr_500px_1fr] items-center relative">
        
        <div class="flex flex-col gap-14 pr-12">
          <div v-for="(f, i) in leftFeatures" :key="i" class="flex flex-col items-end text-right relative">
            <span class="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">{{ f.label }}</span>
            <h3 class="text-xl font-black text-slate-900 tracking-tighter uppercase mb-2 leading-tight">{{ f.title }}</h3>
            <p class="text-[0.85rem] text-slate-500 leading-relaxed font-medium">
              {{ f.desc }}
            </p>
            <div class="absolute -right-20 top-1/2 w-16 h-px bg-slate-200"></div>
          </div>
        </div>

        <div class="relative flex justify-center z-10 perspective-1000 px-4">
          <div class="w-[480px] h-[300px] rounded-2xl overflow-hidden  relative border border-white/20">
            <img 
              src="@/assets/images/card.png" 
              class="w-full h-full object-cover pointer-events-none scale-[1.01]"
              alt="Deenex Membership Card"
            />
          </div>
        </div>

        <div class="flex flex-col gap-14 pl-12">
          <div v-for="(m, i) in rightMetrics" :key="i" class="flex flex-col items-start text-left relative">
            <span class="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">{{ m.label }}</span>
            <h3 class="text-xl font-bold text-slate-900 tracking-tighter uppercase mb-1 leading-tight">{{ m.title }}</h3>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black text-primary tracking-tighter">{{ m.value }}</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ m.sub }}</span>
            </div>
            <div class="absolute -left-20 top-1/2 w-16 h-px bg-slate-200"></div>
          </div>
        </div>
      </div>

      <!-- Mobile View -->
      <div class="lg:hidden flex flex-col gap-12">
        <div class="flex justify-center mb-4">
          <div class="w-full max-w-[340px] h-auto aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl relative border border-white/20">
            <img 
              src="@/assets/images/card.png" 
              class="w-full h-full object-cover scale-[1.01]"
              alt="Deenex Card"
            />
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div v-for="f in leftFeatures" :key="f.title" class="flex flex-col border-l-4 border-primary pl-5">
            <span class="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{{ f.label }}</span>
            <h3 class="text-lg font-black text-slate-900 tracking-tight mb-2 uppercase">{{ f.title }}</h3>
            <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 sm:gap-6 pt-10 border-t border-slate-100">
          <div v-for="m in rightMetrics" :key="m.label" class="flex flex-col items-center text-center">
            <span class="text-xl sm:text-3xl font-black text-primary tracking-tighter leading-none mb-1">{{ m.value }}</span>
            <span class="text-[7px] sm:text-[10px] font-black text-slate-800 uppercase tracking-widest leading-tight block">{{ m.title }}</span>
            <span class="text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase mt-1">{{ m.sub }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const leftFeatures = [
  { 
    label: 'Ecosistema', 
    title: 'Puntos y Cupones', 
    desc: 'Sistema de beneficios 100% parametrizable por productos y por usuarios. Sistema tipo Starbucks.' 
  },
  { 
    label: 'Soberanía', 
    title: 'CRM y DATOS', 
    desc: 'Fomentá la lealtad con beneficios exclusivos y niveles VIP 100% automáticos.' 
  },
  { 
    label: 'Red Unificada', 
    title: 'CLEARING UNIFICADO', 
    desc: 'Toda la información y perfiles de tus clientes bajo control total de la marca.' 
  }
]

const rightMetrics = [
  { 
    label: 'Impacto en ROI', 
    title: 'Frecuencia Real', 
    value: '4.2x', 
    sub: 'MÁS RECOMPRA DETECTADA' 
  },
  { 
    label: 'Growth', 
    title: 'Crecimiento Red', 
    value: '+300k', 
    sub: 'REGISTROS GENERADOS' 
  },
  { 
    label: 'Retention', 
    title: 'Retención Real', 
    value: '+28%', 
    sub: 'DE BASE' 
  }
]
</script>