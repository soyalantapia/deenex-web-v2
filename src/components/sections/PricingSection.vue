<template>
  <section id="precios" class="py-24 px-6 bg-white relative">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
        <div class="max-w-xl">
          <h2
            class="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900"
          >
            Pagás por lo que usás.<br />
            <span class="text-primary italic font-light">Sin comisiones por pedido.</span>
          </h2>
        </div>
        <button
          @click="openModal"
          class="group shrink-0 inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all"
        >
          <Calculator class="w-4 h-4" />
          Calcular mi cotización
          <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <!-- Planes principales: carrusel en mobile, grid en desktop -->
      <div class="relative mb-6">
        <!-- Carrusel mobile -->
        <div
          ref="plansRef"
          class="flex lg:grid lg:grid-cols-3 gap-2 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide -mx-6 px-4 lg:mx-0 lg:px-0 pt-4 pb-6 lg:pb-0"
          @scroll="onPlansScroll"
        >
          <!-- Canal Presencial -->
          <div
            class="plan-card flex-shrink-0 w-[78vw] sm:w-[340px] lg:w-auto snap-center border border-slate-200 rounded-2xl p-6 flex flex-col bg-white"
            :class="activePlan === 0 ? 'plan-active' : 'plan-behind'"
          >
            <div class="flex items-start justify-between mb-5">
              <div>
                <h3 class="text-lg font-bold text-slate-900 mb-0.5">Mesa/Para llevar</h3>
                <p class="text-xs text-slate-400 font-medium">Canal Presencial</p>
              </div>
              <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Store class="w-4 h-4 text-white" />
              </div>
            </div>
            <div class="flex items-baseline gap-1 mb-5">
              <span class="text-3xl font-bold text-slate-900">USD 25</span>
              <span class="text-slate-400 text-sm">/ local · mes</span>
            </div>
            <p class="text-slate-500 text-sm leading-relaxed mb-6">
              Digitalizá tu salón con QR dinámico o gestioná los pedidos de retiro en tienda. Cada
              módulo se activa por separado.
            </p>
            <ul class="space-y-2.5 mt-auto">
              <li class="flex items-center gap-2.5 text-sm text-slate-600">
                <Check class="w-3.5 h-3.5 text-primary shrink-0" />Menú digital interactivo QR
              </li>
              <li class="flex items-center gap-2.5 text-sm text-slate-600">
                <Check class="w-3.5 h-3.5 text-primary shrink-0" />Cobro integrado en mesa y Para
                llevar
              </li>
              <li class="flex items-center gap-2.5 text-sm text-slate-600">
                <Check class="w-3.5 h-3.5 text-primary shrink-0" />Panel de comandas en tiempo real
              </li>
            </ul>
          </div>

          <!-- Pack Completo -->
          <div
            class="plan-card flex-shrink-0 w-[78vw] sm:w-[340px] lg:w-auto snap-center rounded-2xl p-6 flex flex-col relative bg-primary lg:border-2 lg:border-primary"
            :class="activePlan === 1 ? 'plan-active' : 'plan-behind'"
          >
            <div class="absolute -top-3 left-7">
              <span class="bg-white text-primary text-[11px] font-semibold px-3 py-1 rounded-full"
                >Recomendado</span
              >
            </div>
            <div class="absolute -top-3 right-7">
              <span
                class="bg-emerald-400 text-white text-xs font-black px-3 py-1 rounded-full tracking-tight"
                >20% OFF</span
              >
            </div>
            <div class="flex items-start justify-between mb-5 mt-2">
              <div>
                <h3 class="text-lg font-bold text-white mb-0.5">Pack Completo</h3>
                <p class="text-xs text-white/60 font-semibold">Pack completo</p>
              </div>
              <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Layers class="w-4 h-4 text-white" />
              </div>
            </div>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-bold text-white">USD 40</span>
              <span class="text-white/60 text-sm">/ local · mes</span>
              <span class="text-white/40 line-through text-sm font-medium">USD 50</span>
            </div>
            <p class="text-white/50 text-xs mb-5">vs USD 50 comprando los 3 módulos por separado</p>
            <p class="text-white/80 text-sm leading-relaxed mb-6">
              Mesa, Para llevar y Delivery Propio integrados en un único sistema. Gestión unificada
              de todos tus canales de venta.
            </p>
            <ul class="space-y-2.5 mt-auto">
              <li class="flex items-center gap-2.5 text-sm text-white/90">
                <Check class="w-3.5 h-3.5 text-white shrink-0" />Los 3 canales integrados
              </li>
              <li class="flex items-center gap-2.5 text-sm text-white/90">
                <Check class="w-3.5 h-3.5 text-white shrink-0" />Gestión unificada de ventas
              </li>
              <li class="flex items-center gap-2.5 text-sm text-white/90">
                <Check class="w-3.5 h-3.5 text-white shrink-0" />Soporte comercial prioritario
              </li>
            </ul>
            <button
              @click="openModal"
              class="mt-8 w-full bg-white hover:bg-slate-100 text-primary py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Calcular mi cotización
            </button>
          </div>

          <!-- Delivery Propio -->
          <div
            class="plan-card flex-shrink-0 w-[78vw] sm:w-[340px] lg:w-auto snap-center border border-slate-200 rounded-2xl p-6 flex flex-col bg-white"
            :class="activePlan === 2 ? 'plan-active' : 'plan-behind'"
          >
            <div class="flex items-start justify-between mb-5">
              <div>
                <h3 class="text-lg font-bold text-slate-900 mb-0.5">Delivery Propio</h3>
                <p class="text-xs text-slate-400 font-medium">Módulo Delivery</p>
              </div>
              <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Bike class="w-4 h-4 text-white" />
              </div>
            </div>
            <div class="flex items-baseline gap-1 mb-2">
              <span class="text-3xl font-bold text-slate-900">USD 25</span>
              <span class="text-slate-400 text-sm">/ local · mes</span>
            </div>

            <p class="text-slate-500 text-sm leading-relaxed mb-6">
              Tu propio canal de delivery sin comisiones de terceros. Pagos online y gestión
              completa de tu flota.
            </p>
            <ul class="space-y-2.5 mt-auto">
              <li class="flex items-center gap-2.5 text-sm text-slate-600">
                <Check class="w-3.5 h-3.5 text-primary shrink-0" />Comisiones Cero
              </li>
              <li class="flex items-center gap-2.5 text-sm text-slate-600">
                <Check class="w-3.5 h-3.5 text-primary shrink-0" />Pasarela de pago integrada
              </li>
              <li class="flex items-center gap-2.5 text-sm text-slate-600">
                <Check class="w-3.5 h-3.5 text-primary shrink-0" />Zonas y repartidores propios
              </li>
            </ul>
          </div>
        </div>

        <!-- Dots mobile -->
        <div class="flex lg:hidden items-center justify-center gap-2 mt-4">
          <button
            v-for="(_, i) in 3"
            :key="i"
            @click="scrollToPlan(i)"
            class="transition-all duration-300 rounded-full"
            :class="activePlan === i ? 'bg-primary w-6 h-2' : 'bg-slate-300 w-2 h-2'"
          />
        </div>
      </div>

      <!-- Módulos opcionales + Descuentos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Fidelización destacada -->
        <div class="border border-slate-200 rounded-2xl p-6 flex flex-col relative overflow-hidden">
          <!-- Fondo decorativo sutil -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none"
          ></div>
          <!-- Icono arriba -->
          <div
            class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mb-4 relative shadow-lg shadow-primary/10"
          >
            <Sparkles class="w-4 h-4 text-white" />
          </div>
          <div class="relative">
            <h4 class="font-bold text-slate-900 mb-0.5">Fidelización</h4>
            <p class="text-slate-400 text-sm mb-4">
              Potenciá la recurrencia de tus clientes habituales.
            </p>
            <div class="space-y-4">
              <!-- Loyalty Engine -->
              <div
                class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 rounded-2xl bg-primary/5 border border-primary/10"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"
                  >
                    <Check class="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p class="text-slate-900 font-bold text-sm leading-none mb-1">
                      Módulo Fidelización
                    </p>
                    <span
                      class="text-[9px] font-black uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full shrink-0"
                      >ACCESO TOTAL</span
                    >
                  </div>
                </div>
                <div class="flex items-baseline gap-1 text-primary">
                  <span class="text-xs font-bold">+ USD</span>
                  <span class="text-xl font-black">15</span>
                  <span class="text-[10px] font-bold opacity-60">/ local</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-400 leading-relaxed px-1 font-medium italic">
                Puntos, cupones, categorías de beneficio y sistema tipo Starbucks para marcas que
                buscan recurrencia.
              </p>
            </div>
          </div>
        </div>

        <!-- Descuentos por volumen -->
        <div class="border border-slate-200 rounded-2xl p-6 flex flex-col">
          <!-- Icono arriba -->
          <div class="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mb-4">
            <TrendingDown class="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-0.5">Descuentos por volumen</h4>
            <p class="text-slate-400 text-sm mb-4">
              Se aplican automáticamente sobre el total mensual.
            </p>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded w-10 text-center"
                  >-10%</span
                >
                <span class="text-slate-600">A partir de 25 locales (Growth)</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded w-10 text-center"
                  >-20%</span
                >
                <span class="text-slate-600">A partir de 70 locales (Scale)</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span
                  class="bg-emerald-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded w-10 text-center"
                  >-30%</span
                >
                <span class="text-slate-600">A partir de 150 locales (Enterprise)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marketing Suite -->
      <div class="border border-slate-200 rounded-2xl overflow-hidden">
        <div class="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 uppercase tracking-tight">SUITE DE MARKETING</h3>
            <p class="text-slate-400 text-sm mt-0.5">
              Campañas con IA. ¡Activá tu base de datos con campañas de manera super fácil!
            </p>
          </div>
          <span
            class="bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-3 py-1 rounded-full border border-indigo-100 shrink-0 ml-4"
            >Complemento</span
          >
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100"
        >
          <!-- Pago por uso -->
          <div class="px-7 py-6">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              1. Pago por uso
            </p>
            <p class="text-xl font-bold text-slate-900 mb-3">Packs de créditos</p>
            <p class="text-slate-500 text-sm leading-relaxed mb-4">
              Pagás por Packs de créditos. Sin compromiso mensual. Ideal para campañas ocasionales.
            </p>
            <div class="text-xs text-slate-400 italic font-medium">Precio de lista por crédito</div>
          </div>

          <!-- Start -->
          <div class="px-7 py-6 bg-indigo-50/40 relative">
            <div class="absolute top-4 right-4">
              <span
                class="bg-indigo-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >Popular</span
              >
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              2. USD 45 INICIAL
            </p>
            <div class="flex items-center flex-wrap gap-2 mb-3">
              <div class="flex items-baseline gap-1">
                <p class="text-xl font-bold text-slate-900">USD 45</p>
                <span class="text-slate-400 text-sm font-normal">/ mes</span>
              </div>
              <span
                class="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                INCLUYE 1000 CREDITOS
              </span>
            </div>
            <!-- Descuento badge -->
            <div
              class="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-3"
            >
              -20% OFF x crédito
            </div>
            <p class="text-slate-400 text-xs mb-3 font-medium">Ideal para primeras campañas</p>
            <p class="text-slate-500 text-sm leading-relaxed">
              Ideal para primeras campañas de activación. Uso moderado, validación inicial del
              canal.
            </p>
          </div>

          <!-- Scale -->
          <div class="px-7 py-6 relative">
            <div class="absolute top-4 right-4">
              <span
                class="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >Mejor valor</span
              >
            </div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              3. USD 200 AVANZADO
            </p>
            <div class="flex items-center flex-wrap gap-2 mb-3">
              <div class="flex items-baseline gap-1">
                <p class="text-xl font-bold text-slate-900">USD 200</p>
                <span class="text-slate-400 text-sm font-normal">/ mes</span>
              </div>
              <span
                class="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                INCLUYE 5000 CREDITOS
              </span>
            </div>
            <!-- Descuento badge -->
            <div
              class="inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black px-2.5 py-0.5 rounded-full mb-3"
            >
              <span>-30% OFF x crédito</span>
              <span class="text-[9px] bg-emerald-600 text-white px-1.5 py-0 rounded-sm"
                >MEJOR VALOR</span
              >
            </div>
            <p class="text-slate-400 text-xs mb-3 font-medium text-balance">
              Campañas frecuentes · Mejor valor por crédito
            </p>
            <p class="text-slate-500 text-sm leading-relaxed">
              Ideal para marcas con más volumen, campañas frecuentes, reactivación y recurrencia.
            </p>
          </div>
        </div>
        <!-- Botón Marketing WhatsApp -->
        <div class="px-7 py-8 bg-white border-t border-slate-100 flex justify-center">
          <a
            :href="`https://wa.me/${whatsappNumber}?text=${marketingWhatsappMessage}`"
            target="_blank"
            class="group inline-flex items-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 relative overflow-hidden uppercase"
          >
            <MessageCircle class="w-4 h-4 flex-shrink-0" />
            <span>ACTIVAR MARKETING AHORA</span>
          </a>
        </div>
      </div>
    </div>

    <!-- ── MODAL COTIZADOR (VISTA ÚNICA SCROLLABLE EN MOBILE Y DESKTOP) ── -->
    <Teleport to="body">
      <Transition name="modal-overlay">
        <div
          v-if="showModal"
          class="fixed inset-0 z-[9998] bg-slate-900/60 backdrop-blur-sm"
          @click="closeModal"
        ></div>
      </Transition>

      <Transition name="modal-content">
        <div
          v-if="showModal"
          class="fixed inset-0 z-[9999] flex justify-center p-3 items-center"
        >
          <div
            class="relative w-full max-h-[78svh] sm:max-h-[90vh] max-w-[1000px] bg-white rounded-[2.25rem] shadow-2xl flex flex-col overflow-hidden"
          >
            <!-- Header Fijo (Mobile & Desktop) -->
            <div
              class="z-[60] bg-white border-b border-slate-100 px-5 py-4 sm:px-8 lg:px-10 lg:py-6 flex items-center justify-between shrink-0"
            >
              <div class="flex items-center gap-2.5 sm:gap-3">
                <div
                  class="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"
                >
                  <Settings2 class="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div class="flex flex-col">
                  <h2
                    class="text-base sm:text-xl font-black text-slate-900 leading-tight"
                  >
                    Calculá tu plan
                  </h2>
                  <p class="text-[10px] sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
                    Cotizador a medida
                  </p>
                </div>
              </div>

              <!-- Botón Cerrar Global -->
              <button
                @click="closeModal"
                class="w-9 h-9 sm:w-8 sm:h-8 rounded-full text-slate-900 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-all border border-slate-200 sm:border-none sm:bg-transparent shrink-0"
              >
                <X class="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            </div>

            <!-- Contenedor general que scrollea -->
            <div
              class="flex-1 min-h-0 flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden"
            >
              <!-- ── Columna Izquierda: Configuración ── -->
              <div
                class="flex-1 p-8 sm:p-8 lg:p-10 lg:pr-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-white flex flex-col lg:min-h-0 lg:overflow-y-auto"
              >
                <div class="space-y-8 sm:space-y-10">
                  <!-- Locales -->
                  <section>
                    <div class="flex items-baseline justify-between mb-4">
                      <h3 class="text-sm font-bold text-slate-900 uppercase tracking-widest">
                        1. Volumen de locales
                      </h3>
                      <span class="text-xs font-medium text-slate-400 hidden sm:block"
                        >Descuentos automáticos</span
                      >
                    </div>

                    <div class="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                          <input
                            type="number"
                            v-model.number="locales"
                            class="text-4xl font-black text-primary bg-transparent border-none outline-none w-24 tabular-nums tracking-tighter hover:bg-slate-100/50 focus:bg-white rounded-lg px-2 transition-colors"
                            min="1"
                            max="500"
                          />
                          <span class="text-sm font-semibold text-slate-500"
                            >local{{ locales > 1 ? 'es' : '' }}</span
                          >
                        </div>

                        <!-- Badge descuento in-line -->
                        <Transition name="fade" mode="out-in">
                          <div
                            v-if="descuentoInfo.pct > 0"
                            class="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg"
                          >
                            <TrendingDown class="w-3.5 h-3.5" />
                            -{{ descuentoInfo.pct * 100 }}% OFF
                          </div>
                          <div v-else class="text-xs text-slate-400 font-medium">
                            1 a 24 locales
                          </div>
                        </Transition>
                      </div>

                      <div class="relative py-4 mb-2">
                        <div
                          class="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-slate-200 rounded-full w-full"
                        ></div>
                        <div
                          class="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-primary rounded-full transition-all duration-150"
                          :style="{ width: `${Math.min((locales / 200) * 100, 100)}%` }"
                        ></div>
                        <input
                          type="range"
                          min="1"
                          max="200"
                          v-model.number="locales"
                          class="w-full h-2 appearance-none bg-transparent cursor-pointer relative z-10 custom-range"
                        />
                      </div>
                    </div>
                  </section>

                  <!-- Canales -->
                  <section>
                    <div class="mb-4">
                      <h3 class="text-sm font-bold text-slate-900 uppercase tracking-widest">
                        2. Canales de venta
                      </h3>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        class="relative flex p-4 border-2 rounded-3xl cursor-pointer transition-all hover:bg-slate-50"
                        :class="
                          selectedVenta.presencial && !selectedVenta.delivery
                            ? 'border-primary bg-primary/[0.02]'
                            : 'border-slate-200'
                        "
                        @click.prevent="setCanal('presencial')"
                      >
                        <input
                          type="radio"
                          :checked="selectedVenta.presencial && !selectedVenta.delivery"
                          class="sr-only"
                        />
                        <div class="flex flex-col gap-1 w-full">
                          <div class="flex items-center justify-between mb-1">
                            <Store
                              class="w-5 h-5"
                              :class="
                                selectedVenta.presencial && !selectedVenta.delivery
                                  ? 'text-primary'
                                  : 'text-slate-400'
                              "
                            />
                            <div
                              class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                              :class="
                                selectedVenta.presencial && !selectedVenta.delivery
                                  ? 'bg-primary border-primary'
                                  : 'border-slate-300'
                              "
                            >
                              <Check
                                v-if="selectedVenta.presencial && !selectedVenta.delivery"
                                class="w-3 h-3 text-white"
                              />
                            </div>
                          </div>
                          <span class="font-bold text-slate-900 text-sm">Mesa/Para llevar</span>
                          <span class="text-xs text-slate-500">Canal Presencial</span>
                          <span class="mt-auto pt-2 text-xs font-bold text-primary"
                            >USD 25 / local</span
                          >
                        </div>
                      </label>

                      <label
                        class="relative flex p-4 border-2 rounded-3xl cursor-pointer transition-all hover:bg-slate-50"
                        :class="
                          selectedVenta.delivery && !selectedVenta.presencial
                            ? 'border-primary bg-primary/[0.02]'
                            : 'border-slate-200'
                        "
                        @click.prevent="setCanal('delivery')"
                      >
                        <input
                          type="radio"
                          :checked="selectedVenta.delivery && !selectedVenta.presencial"
                          class="sr-only"
                        />
                        <div class="flex flex-col gap-1 w-full">
                          <div class="flex items-center justify-between mb-1">
                            <Bike
                              class="w-5 h-5"
                              :class="
                                selectedVenta.delivery && !selectedVenta.presencial
                                  ? 'text-primary'
                                  : 'text-slate-400'
                              "
                            />
                            <div
                              class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                              :class="
                                selectedVenta.delivery && !selectedVenta.presencial
                                  ? 'bg-primary border-primary'
                                  : 'border-slate-300'
                              "
                            >
                              <Check
                                v-if="selectedVenta.delivery && !selectedVenta.presencial"
                                class="w-3 h-3 text-white"
                              />
                            </div>
                          </div>
                          <span class="font-bold text-slate-900 text-sm">Delivery Propio</span>
                          <span class="text-xs text-slate-500">Sin comisiones</span>
                          <span class="mt-auto pt-2 text-xs font-bold text-primary"
                            >USD 25 / local</span
                          >
                        </div>
                      </label>

                      <label
                        class="relative flex p-4 border-2 rounded-3xl cursor-pointer transition-all hover:bg-slate-50 sm:col-span-2"
                        :class="
                          selectedVenta.presencial && selectedVenta.delivery
                            ? 'border-primary bg-primary/[0.02]'
                            : 'border-slate-200'
                        "
                        @click.prevent="setCanal('pack')"
                      >
                        <input
                          type="radio"
                          :checked="selectedVenta.presencial && selectedVenta.delivery"
                          class="sr-only"
                        />
                        <div class="flex flex-col gap-1 w-full">
                          <div class="flex items-center justify-between mb-1">
                            <Layers
                              class="w-5 h-5"
                              :class="
                                selectedVenta.presencial && selectedVenta.delivery
                                  ? 'text-primary'
                                  : 'text-slate-400'
                              "
                            />
                            <div
                              class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                              :class="
                                selectedVenta.presencial && selectedVenta.delivery
                                  ? 'bg-primary border-primary'
                                  : 'border-slate-300'
                              "
                            >
                              <Check
                                v-if="selectedVenta.presencial && selectedVenta.delivery"
                                class="w-3 h-3 text-white"
                              />
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            <span class="font-bold text-slate-900 text-sm">Pack Completo</span>
                            <span
                              class="text-[9px] font-black uppercase tracking-wider bg-primary text-white px-1.5 py-0.5 rounded"
                              >20% OFF</span
                            >
                          </div>
                          <span class="text-xs text-slate-500 hidden sm:block"
                            >Mesa, Para llevar y Delivery Propio integrados.</span
                          >
                          <div class="mt-auto pt-2 flex items-baseline gap-2">
                            <span class="text-xs font-bold text-primary">USD 40 / local</span>
                            <span class="text-xs text-slate-400 line-through">USD 50</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </section>

                  <!-- Módulos Extra -->
                  <section>
                    <div class="mb-4">
                      <h3 class="text-sm font-bold text-slate-900 uppercase tracking-widest">
                        3. Módulos Adicionales
                      </h3>
                    </div>

                    <label
                      class="relative flex items-center p-4 border-2 rounded-3xl cursor-pointer transition-all hover:bg-slate-50"
                      :class="
                        addFidelizacion ? 'border-primary bg-primary/[0.02]' : 'border-slate-200'
                      "
                    >
                      <input type="checkbox" v-model="addFidelizacion" class="sr-only" />
                      <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mr-4 transition-colors"
                        :class="
                          addFidelizacion ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                        "
                      >
                        <Sparkles class="w-5 h-5" />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-0.5">
                          <span class="font-bold text-slate-900 text-sm">Fidelización</span>
                        </div>
                        <p class="text-xs text-slate-500 leading-tight hidden sm:block">
                          Puntos, cupones y niveles VIP para tus clientes.
                        </p>
                      </div>
                      <div class="flex flex-col items-end ml-4 shrink-0">
                        <span class="text-xs font-bold text-primary mb-1">+ USD 15</span>
                        <!-- Toggle switch visual -->
                        <div
                          class="w-9 h-5 rounded-full p-0.5 transition-colors"
                          :class="addFidelizacion ? 'bg-primary' : 'bg-slate-300'"
                        >
                          <div
                            class="w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
                            :class="addFidelizacion ? 'translate-x-4' : 'translate-x-0'"
                          ></div>
                        </div>
                      </div>
                    </label>
                  </section>
                </div>
              </div>
              <!-- Fin Columna Izquierda -->

              <!-- ── Columna Derecha: Resumen y CTA ── -->
              <div
                class="flex-1 lg:max-w-sm bg-slate-50 flex flex-col border-t lg:border-t-0 border-slate-200 lg:min-h-0 lg:overflow-y-auto"
              >
                <div class="p-8 sm:p-8 lg:p-10 flex-1 lg:pt-8">
                  <!-- Ticket Resumen -->
                  <div
                    class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8"
                  >
                    <!-- Items -->
                    <div class="p-5 space-y-4">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="text-sm font-semibold text-slate-900">Canales de venta</p>
                          <p class="text-xs text-slate-500 mt-0.5">
                            {{ locales }} local{{ locales > 1 ? 'es' : '' }}
                          </p>
                        </div>
                        <span class="text-sm font-bold text-slate-900"
                          >USD {{ (precioBaseVenta * locales).toLocaleString() }}</span
                        >
                      </div>

                      <div v-if="addFidelizacion" class="flex justify-between items-start">
                        <div>
                          <p class="text-sm font-semibold text-slate-900">Módulo Fidelización</p>
                        </div>
                        <span class="text-sm font-bold text-slate-900"
                          >+ USD {{ (15 * locales).toLocaleString() }}</span
                        >
                      </div>

                      <div
                        v-if="descuentoInfo.pct > 0"
                        class="flex justify-between items-start pt-2 border-t border-slate-100"
                      >
                        <div>
                          <p class="text-sm font-bold text-emerald-600">Descuento volumen</p>
                          <p class="text-xs text-emerald-600/70 mt-0.5">
                            Nivel {{ descuentoInfo.nivel }} (-{{ descuentoInfo.pct * 100 }}%)
                          </p>
                        </div>
                        <span class="text-sm font-black text-emerald-600"
                          >− USD {{ Math.round(ahorroEscala).toLocaleString() }}</span
                        >
                      </div>
                    </div>

                    <!-- Totales -->
                    <div class="bg-primary p-5 text-white">
                      <div class="flex items-end justify-between mb-1">
                        <div>
                          <p
                            class="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1"
                          >
                            Costo por local
                          </p>
                          <p class="text-white/90 text-[10px] font-semibold">
                            {{ locales }} local{{ locales > 1 ? 'es' : '' }} operativos
                          </p>
                        </div>
                        <div class="text-right">
                          <div class="flex items-baseline justify-end gap-1">
                            <span class="text-white/60 text-sm font-bold">USD</span>
                            <p class="text-4xl font-black text-white tracking-tighter leading-none">
                              {{
                                locales > 0 ? Math.round(totalFinal / locales).toLocaleString() : 0
                              }}
                            </p>
                          </div>
                          <p class="text-white/50 text-[10px] font-semibold mt-1">
                            / mes · por local
                          </p>
                        </div>
                      </div>

                      <div
                        class="flex justify-between items-center text-[11px] pt-3 border-t border-white/10 mt-3"
                      >
                        <span class="text-white/50 uppercase tracking-widest font-semibold"
                          >Inversión mensual total</span
                        >
                        <span class="text-white/60 text-sm font-bold"
                          >USD {{ Math.round(totalFinal).toLocaleString() }}
                          <span class="text-[9px] opacity-50">Total</span></span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- CTAs -->
                  <div class="space-y-3">
                    <p class="text-xs text-slate-500 font-medium text-center mb-4">
                      ¿Listo para avanzar? Hablemos sobre tu negocio.
                    </p>

                    <a
                      :href="`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`"
                      target="_blank"
                      rel="noopener"
                      class="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20"
                    >
                      <MessageCircle class="w-4 h-4" />
                      Contactar por WhatsApp
                    </a>

                    <a
                      :href="calendarUrl"
                      target="_blank"
                      rel="noopener"
                      class="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <CalendarDays class="w-4 h-4 text-slate-400" />
                      Agendar Demo
                    </a>
                  </div>
                </div>
              </div>
              <!-- Fin Columna Derecha -->
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import {
  Check,
  Sparkles,
  Monitor,
  Calculator,
  Settings2,
  TrendingDown,
  Layers,
  ArrowLeft,
  ArrowRight,
  X,
  CalendarDays,
  Store,
  Bike,
  LayoutGrid,
  ShoppingBag,
  Truck,
  MessageCircle,
} from 'lucide-vue-next'

const showModal = ref(false)

function openModal() {
  showModal.value = true
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
}

// Limpiar overflow al desmontar
onUnmounted(() => {
  document.body.style.overflow = ''
})

const locales = ref(1)
const selectedVenta = ref({ presencial: true, delivery: true })
const addFidelizacion = ref(false)

function setCanal(canal) {
  const isPresencialOnly = selectedVenta.value.presencial && !selectedVenta.value.delivery
  const isDeliveryOnly = !selectedVenta.value.presencial && selectedVenta.value.delivery
  const isPack = selectedVenta.value.presencial && selectedVenta.value.delivery

  if (canal === 'presencial') {
    if (isPresencialOnly) {
      selectedVenta.value = { presencial: false, delivery: false }
    } else {
      selectedVenta.value = { presencial: true, delivery: false }
    }
  } else if (canal === 'delivery') {
    if (isDeliveryOnly) {
      selectedVenta.value = { presencial: false, delivery: false }
    } else {
      selectedVenta.value = { presencial: false, delivery: true }
    }
  } else if (canal === 'pack') {
    if (isPack) {
      selectedVenta.value = { presencial: false, delivery: false }
    } else {
      selectedVenta.value = { presencial: true, delivery: true }
    }
  }
}

const precioBaseVenta = computed(() => {
  if (selectedVenta.value.presencial && selectedVenta.value.delivery) return 40 // Pack Completo
  if (selectedVenta.value.presencial) return 25 // Solo Presencial
  if (selectedVenta.value.delivery) return 25 // Solo Delivery
  return 0
})

const precioPorLocal = computed(() => precioBaseVenta.value + (addFidelizacion.value ? 15 : 0))

const subtotalMensual = computed(() => precioPorLocal.value * locales.value)

const descuentoInfo = computed(() => {
  if (locales.value > 150) return { pct: 0.3, nivel: 'Empresa' }
  if (locales.value >= 70) return { pct: 0.2, nivel: 'Escala' }
  if (locales.value >= 25) return { pct: 0.1, nivel: 'Crecimiento' }
  return { pct: 0, nivel: 'Inicial' }
})

const ahorroEscala = computed(() => subtotalMensual.value * descuentoInfo.value.pct)
const totalFinal = computed(() => subtotalMensual.value - ahorroEscala.value)

const calendarUrl = import.meta.env.VITE_CALENDAR_URL
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER

const marketingWhatsappMessage = computed(() => {
  const text = `Hola! Me gustaría activar el módulo de "Marketing Suite" en mi plan de Deenex. ¿Podrían asesorarme?`
  return encodeURIComponent(text)
})

const whatsappMessage = computed(() => {
  let text = `Hola! Estuve usando el cotizador de Deenex y me gustaría hablar con ventas.\n\n`
  text += `*Configuración:* \n`
  text += `- Locales: ${locales.value}\n`

  const canalesArr = []
  if (selectedVenta.value.presencial && selectedVenta.value.delivery) {
    canalesArr.push('Pack Completo (Presencial + Delivery)')
  } else {
    if (selectedVenta.value.presencial) canalesArr.push('Presencial')
    if (selectedVenta.value.delivery) canalesArr.push('Delivery')
  }

  text += `- Canales: ${canalesArr.length > 0 ? canalesArr.join(' y ') : 'Ninguno'}\n`
  text += `- Fidelización: ${addFidelizacion.value ? 'Sí' : 'No'}\n\n`
  text += `- Total mensual: USD ${Math.round(totalFinal.value)}\n\n`
  text += `A la espera de su contacto. Gracias!`
  return encodeURIComponent(text)
})

// ── Carrusel de planes (mobile) ──
const plansRef = ref(null)
const activePlan = ref(1) // empieza en Pack Completo (índice 1)

function onPlansScroll() {
  const el = plansRef.value
  if (!el) return
  // Calculamos el índice basado en el scroll
  const cardWidth = el.scrollWidth / 3
  activePlan.value = Math.round(el.scrollLeft / cardWidth)
}

function scrollToPlan(i) {
  const el = plansRef.value
  if (!el) return
  const cardWidth = el.scrollWidth / 3
  el.scrollTo({ left: cardWidth * i, behavior: 'smooth' })
  activePlan.value = i
}

onMounted(() => {
  // Posiciona en Pack Completo al cargar
  nextTick(() => {
    const el = plansRef.value
    if (el) {
      const cardWidth = el.scrollWidth / 3
      el.scrollLeft = cardWidth
    }
  })
})
</script>

<style scoped>
/* Fix touch action for slider in drawer */
input[type='range'] {
  touch-action: none;
}

/* Range slider */
.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  background: white;
  border: 3px solid var(--primary);
  border-radius: 50%;
  box-shadow: 0 4px 15px -3px hsla(var(--primary-hsl), 0.4);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.custom-range:active::-webkit-slider-thumb {
  transform: scale(1.15);
}

/* Slider box */
.slider-box {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Overlay transitions */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.modal-overlay-enter-from,
.modal-overlay-leave-to {
  opacity: 0;
}

/* Content transitions */
.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.97);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Depth effect for pricing plans on mobile */
@media (max-width: 1024px) {
  .plan-card {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .plan-active {
    transform: scale(1);
    opacity: 1;
    z-index: 20;
    filter: none;
  }

  .plan-behind {
    transform: scale(0.92);
    opacity: 0.8;
    z-index: 10;
  }
}
/* Hide number arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
