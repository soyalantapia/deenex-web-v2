<template>
  <section class="py-16 border-b border-slate-100 bg-white overflow-hidden">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0 divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
        <div
          v-for="(stat, i) in stats"
          :key="i"
          class="flex flex-col items-center justify-center text-center px-6 py-8 bg-white hover:bg-slate-50 transition-colors duration-300"
        >
          <span class="text-[2.6rem] sm:text-[3rem] font-black tracking-tighter text-primary leading-none mb-1">
            {{ stat.value }}
          </span>
          <span class="text-[10px] font-bold text-slate-800 uppercase tracking-widest leading-tight block">
            {{ stat.label }}
          </span>
          <span class="text-[10px] font-medium text-slate-400 mt-1">
            {{ stat.sub }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const stats = [
  {
    value: '+500',
    label: 'Sucursales activas',
    sub: 'En toda la red Deenex',
  },
  {
    value: '0%',
    label: 'Comisiones por venta',
    sub: 'Todo el margen es tuyo',
  },
  {
    value: '2X',
    label: 'Más fidelización',
    sub: 'Vs. apps de terceros',
  },
  {
    value: '+40%',
    label: 'Clientes recuperados',
    sub: 'De Rappi y PedidosYa',
  },
]
</script>
