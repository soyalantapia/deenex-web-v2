<template>
  <!--
    Pricing Model 2026, Bundle único escalonado.

    Antes este componente mostraba 4 componentes separados (Presencial,
    Pedidos, Loyalty, Suite) + una opción "sin pago mensual / solo comisión".
    Esa opción NO existe en el modelo real (siempre es fee + comisión), y
    confundía al lead.

    Ahora: un solo Bundle "Deenex Full Suite" que arranca en USD 69 / 300
    pedidos/mes y escala automáticamente al pasar el volumen. Esto:
    - Elimina la decisión "qué componente elegir" → menos fricción.
    - Hace explícito que el precio CRECE CON VOS, no de golpe.
    - Mantiene la honestidad: siempre fee + commission, sin truco.
  -->
  <section :id="content.sectionId" class="py-24 px-6 bg-gradient-to-b from-white via-slate-50/40 to-white relative overflow-hidden">
    <!-- Glow decorativo de fondo -->
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[440px] bg-gradient-to-b from-primary/[0.05] to-transparent"></div>

    <div class="max-w-6xl mx-auto relative">
      <!-- Header ─────────────────────────────────────────────────────── -->
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles class="w-3 h-3" />
          {{ content.kicker }}
        </span>
        <h2 class="text-[clamp(2rem,4.5vw,3rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-4">
          {{ content.title }}<br />
          <span class="text-primary italic font-light">{{ content.titleAccent }}</span>
        </h2>
        <p class="text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          {{ content.subtitle }}
        </p>
      </div>

      <!-- Hero del Bundle inicial, punto de entrada ───────────────── -->
      <div class="relative rounded-3xl bg-slate-900 text-white p-7 sm:p-10 mb-8 overflow-hidden">
        <!-- Glow circular -->
        <div class="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>

        <div class="relative grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <Rocket class="w-3 h-3" />
              {{ content.starterEyebrow }}
            </span>
            <h3 class="text-3xl sm:text-4xl font-extrabold tracking-tighter leading-tight mb-3">
              {{ content.starterTitle }}<br />
              <span class="text-primary italic font-light">{{ content.starterTitleAccent }}</span>
            </h3>
            <p class="text-sm sm:text-base text-white/70 leading-relaxed max-w-md mb-5">
              {{ content.starterDescription }}
            </p>
            <ul class="space-y-2 mb-1">
              <li v-for="f in content.starterIncludes" :key="f" class="flex items-start gap-2 text-sm text-white/85">
                <Check class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" stroke-width="3" />
                <span>{{ f }}</span>
              </li>
            </ul>
          </div>

          <!-- Tarjeta del precio inicial, limpia, sin calc inline.
               El cálculo detallado está en la sección "calculadora-deenex"
               más abajo, vinculada con el anchor secundario. -->
          <div class="rounded-2xl bg-white text-slate-900 p-6 shadow-2xl shadow-slate-900/40">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Empezás con
            </p>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-5xl sm:text-6xl font-black tabular-nums tracking-tighter text-slate-900">
                USD {{ content.starterPrice }}
              </span>
              <span class="text-sm text-slate-500">/ mes</span>
            </div>
            <p class="text-sm font-bold text-primary mb-4 flex items-center gap-1 flex-wrap">
              <span>+ {{ content.starterCommission }}% comisión</span>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">{{ content.starterCommissionScope }}</span>
            </p>

            <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-3 mb-4">
              <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                Incluye hasta
              </p>
              <p class="text-base font-extrabold text-emerald-700 tabular-nums">
                {{ content.starterOrders.toLocaleString('es-AR') }} pedidos/mes
              </p>
              <p class="text-[11px] text-emerald-600/80 leading-snug mt-0.5">
                Si crecés, escalás automático al próximo tier.
              </p>
            </div>

            <RouterLink
              :to="{ path: '/comenzar', query: { from: 'cadenas_pricing' } }"
              class="block text-center bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-4 py-3.5 text-sm transition-all shadow-md shadow-primary/20 mb-2"
            >
              {{ content.starterCtaLabel }}
            </RouterLink>
            <a
              href="#calculadora-deenex"
              class="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-500 hover:text-primary transition-colors py-2"
            >
              <Calculator class="w-3.5 h-3.5" />
              <span>Calcular mi ahorro real</span>
              <ArrowRight class="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <!-- ═══ Callout: Cómo funciona Marketing AI ═══════════════════════
           El lead debe entender ANTES de la calculadora por qué el % de MAI
           no es un cobro extra arbitrario sino un modelo performance: solo
           pagás sobre las ventas EXTRAS que generamos con nuestras campañas. -->
      <div class="mb-10 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-7 relative overflow-hidden">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none"></div>
        <div class="relative grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-6 items-start">
          <div class="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Sparkles class="w-6 h-6" />
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1.5">
              Marketing AI · Performance
            </p>
            <h3 class="text-xl sm:text-2xl font-extrabold tracking-tighter text-slate-900 leading-tight mb-2">
              Solo cobramos cuando generamos recompras.
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Está <span class="font-bold text-slate-900">incluido en tu bundle</span>: corremos campañas de WhatsApp, push y email para reactivar a tus clientes inactivos. Si las campañas generan recompras, cobramos el porcentaje del tier <span class="font-bold tabular-nums">solo sobre esas ventas extras</span>. Sin uplift no hay fee. Cero riesgo upfront, cero costo fijo de marketing.
            </p>
          </div>
        </div>
      </div>

      <!-- ═══ Calculadora rediseñada: Sin Deenex vs Con Deenex ═════════
           3 inputs simples (locales, facturación mensual, % delivery) →
           comparativa side-by-side de costos actuales vs con Deenex →
           hero verde con ganancia neta mensual/anual + ROI.
           Filosofía: el lead VE su número en <10 segundos. -->
      <div id="calculadora-deenex" class="mb-12 scroll-mt-24">
        <div class="text-center mb-8">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4">
            <Calculator class="w-3 h-3" />
            {{ content.calculatorEyebrow }}
          </span>
          <h3 class="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-3">
            {{ content.calculatorTitle }}
          </h3>
          <p class="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {{ content.calculatorSubtitle }}
          </p>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-sm">
          <!-- ═══ INPUTS — 3 preguntas simples ════════════════════════════ -->
          <div class="grid sm:grid-cols-3 gap-5 sm:gap-8 mb-8 pb-8 border-b border-slate-200">
            <!-- Input 1: Locales (chips clickeables + custom) -->
            <div>
              <label class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Store class="w-3 h-3 text-primary" />
                ¿Cuántos locales tenés?
              </label>
              <div class="flex flex-wrap gap-1.5 mb-2">
                <button
                  v-for="opt in locationsPresets"
                  :key="opt"
                  type="button"
                  @click="calc.locations = opt"
                  class="px-3 py-1.5 rounded-lg text-sm font-bold tabular-nums transition-all"
                  :class="calc.locations === opt
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                >
                  {{ opt }}
                </button>
              </div>
              <input
                v-model.number="calc.locations"
                type="number"
                min="1"
                max="500"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                aria-label="Cantidad de locales custom"
              />
            </div>

            <!-- Input 2: Facturación mensual (USD, input + slider grueso) -->
            <div>
              <label for="calc-revenue" class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CircleDollarSign class="w-3 h-3 text-primary" />
                ¿Cuánto facturás por mes?
              </label>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs text-slate-500 font-semibold">USD</span>
                <input
                  id="calc-revenue"
                  v-model.number="calc.monthlyRevenueUsd"
                  type="number"
                  min="1000"
                  max="10000000"
                  step="1000"
                  class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-base font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  aria-label="Facturación mensual"
                />
              </div>
              <input
                v-model.number="calc.monthlyRevenueUsd"
                type="range"
                min="5000"
                max="500000"
                step="1000"
                class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                aria-label="Facturación slider"
              />
              <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold tabular-nums">
                <span>USD 5k</span>
                <span>USD 100k</span>
                <span>USD 500k</span>
              </div>
            </div>

            <!-- Input 3: % delivery (slider con %) -->
            <div>
              <label for="calc-pct-delivery" class="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Bike class="w-3 h-3 text-primary" />
                ¿Qué % es delivery?
              </label>
              <div class="flex items-center gap-2 mb-2">
                <input
                  id="calc-pct-delivery"
                  v-model.number="calc.pctDelivery"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  class="w-16 px-2 py-2 border border-slate-300 rounded-lg text-base font-bold tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <span class="text-xs text-slate-500 font-semibold">% del total</span>
              </div>
              <input
                v-model.number="calc.pctDelivery"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                aria-label="% delivery slider"
              />
              <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold tabular-nums">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <!-- ═══ Tu tier badge (resumen rápido del tier asignado) ════════ -->
          <div class="flex items-center justify-center gap-2 flex-wrap mb-6 text-sm">
            <span class="text-slate-500">Con tu volumen, caés en</span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white font-bold tabular-nums">
              <Sparkles class="w-3 h-3" />
              {{ calcTier.name }}
            </span>
            <span class="text-slate-400 tabular-nums">{{ fmt(totalOrders) }} pedidos/mes estimados</span>
          </div>

          <!-- ═══ COMPARATIVA Sin vs Con Deenex ═══════════════════════════ -->
          <div class="grid lg:grid-cols-2 gap-4 mb-6">
            <!-- SIN DEENEX (rojo) -->
            <div class="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-5 sm:p-6">
              <div class="flex items-start justify-between gap-2 mb-4">
                <div>
                  <p class="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <X class="w-3 h-3" />
                    Sin Deenex (hoy)
                  </p>
                  <h4 class="text-lg font-bold text-slate-900 leading-tight">Tus costos actuales</h4>
                </div>
                <span class="text-[10px] font-black text-rose-700 bg-rose-200/60 px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Sin canal propio
                </span>
              </div>

              <ul class="space-y-3 mb-4">
                <li class="flex items-baseline justify-between gap-3 pb-2 border-b border-rose-100">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-700">POS típico</p>
                    <p class="text-[11px] text-slate-400">USD {{ POS_INDUSTRY_COST }}/local × {{ calc.locations }} locales</p>
                  </div>
                  <span class="text-base font-bold text-slate-700 tabular-nums whitespace-nowrap">
                    {{ fmtUsd(sinDeenexPosCost) }}
                  </span>
                </li>
                <li class="flex items-baseline justify-between gap-3 pb-2 border-b border-rose-100">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-700">Comisión apps de delivery</p>
                    <p class="text-[11px] text-slate-400">{{ calc.pctCommissionApps }}% sobre tu delivery</p>
                  </div>
                  <span class="text-base font-bold text-slate-700 tabular-nums whitespace-nowrap">
                    {{ fmtUsd(sinDeenexAppsCost) }}
                  </span>
                </li>
                <li class="flex items-baseline justify-between gap-3 text-[11px] text-rose-700/80">
                  <span class="flex items-center gap-1.5">
                    <X class="w-3 h-3 shrink-0" />
                    Sin recompras ni data de cliente
                  </span>
                  <span class="font-semibold whitespace-nowrap">USD 0 extra</span>
                </li>
              </ul>

              <div class="pt-3 border-t-2 border-rose-200">
                <div class="flex items-baseline justify-between gap-2 mb-1">
                  <span class="text-sm font-bold text-rose-700">Te cuesta hoy</span>
                  <span class="text-2xl font-black text-rose-700 tabular-nums">{{ fmtUsd(sinDeenexTotal) }}<span class="text-xs font-bold">/mes</span></span>
                </div>
                <p class="text-[11px] text-rose-600/80 leading-snug">
                  Sin contar el margen que perdés por no tener data de cliente ni recompras propias.
                </p>
              </div>
            </div>

            <!-- CON DEENEX (verde) -->
            <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 sm:p-6 relative overflow-hidden">
              <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-emerald-200/40 blur-2xl pointer-events-none"></div>
              <div class="relative">
                <div class="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Check class="w-3 h-3" stroke-width="3" />
                      Con Deenex ({{ calcTier.name }})
                    </p>
                    <h4 class="text-lg font-bold text-slate-900 leading-tight">Tu inversión mensual</h4>
                  </div>
                  <span class="text-[10px] font-black text-emerald-700 bg-emerald-200/70 px-2 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Canal propio + AI
                  </span>
                </div>

                <ul class="space-y-3 mb-4">
                  <li class="flex items-baseline justify-between gap-3 pb-2 border-b border-emerald-100">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-700">Bundle Full Suite</p>
                      <p class="text-[11px] text-slate-400">App + Loyalty + canal propio</p>
                    </div>
                    <span class="text-base font-bold text-slate-700 tabular-nums whitespace-nowrap">
                      <template v-if="calcTier.fee !== null">{{ fmtUsd(calcTier.fee) }}</template>
                      <template v-else>A medida</template>
                    </span>
                  </li>
                  <li class="flex items-baseline justify-between gap-3 pb-2 border-b border-emerald-100">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-700">Comisión delivery</p>
                      <p class="text-[11px] text-slate-400">{{ calcTier.commissionLabel }} sobre tu delivery</p>
                    </div>
                    <span class="text-base font-bold text-slate-700 tabular-nums whitespace-nowrap">
                      {{ fmtUsd(conDeenexDeliveryCommission) }}
                    </span>
                  </li>
                  <li class="flex items-baseline justify-between gap-3 pb-2 border-b border-emerald-100">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        Marketing AI
                        <span class="text-[9px] font-black text-emerald-700 bg-emerald-200/70 px-1.5 py-0.5 rounded uppercase tracking-wider">Performance</span>
                      </p>
                      <p class="text-[11px] text-slate-400">{{ calcTier.marketingAiPct }}% solo sobre recompras extras</p>
                    </div>
                    <span class="text-base font-bold text-slate-700 tabular-nums whitespace-nowrap">
                      {{ fmtUsd(marketingAiFee) }}
                    </span>
                  </li>
                  <li class="flex items-baseline justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-700">POS integrado</p>
                      <p class="text-[11px] text-slate-400">USD {{ calcTier.posPerLocation }}/local × {{ calc.locations }} locales</p>
                    </div>
                    <span class="text-base font-bold text-slate-700 tabular-nums whitespace-nowrap">
                      {{ fmtUsd(conDeenexPosCost) }}
                    </span>
                  </li>
                </ul>

                <div class="pt-3 border-t-2 border-emerald-300">
                  <div class="flex items-baseline justify-between gap-2 mb-1">
                    <span class="text-sm font-bold text-emerald-700">Tu inversión Deenex</span>
                    <span class="text-2xl font-black text-emerald-700 tabular-nums">{{ fmtUsd(conDeenexTotal) }}<span class="text-xs font-bold">/mes</span></span>
                  </div>
                  <p class="text-[11px] text-emerald-700/80 leading-snug">
                    Incluye canal propio, app branded, loyalty, campañas AI y data 100% tuya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ═══ HERO: Tu inversión se paga sola ════════════════════════ -->
          <div
            v-if="conDeenexTotal !== null"
            class="rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white p-6 sm:p-8 relative overflow-hidden mb-6"
          >
            <div class="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            <div class="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none"></div>

            <div class="relative grid sm:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p class="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <TrendingUp class="w-3 h-3" />
                  Tu inversión se paga sola
                </p>
                <h3 class="text-3xl sm:text-4xl font-extrabold tracking-tighter leading-tight mb-2">
                  Ganás <span class="tabular-nums">{{ fmtUsd(totalMonthlyBenefit) }}</span> netos / mes
                </h3>
                <p class="text-base text-white/90 leading-relaxed mb-4">
                  <span class="font-bold tabular-nums">{{ fmtUsd(totalAnnualBenefit) }}</span> al año en tu bolsillo entre ahorro de costos y crecimiento adicional.
                </p>

                <ul class="space-y-1.5 text-sm">
                  <li class="flex items-baseline justify-between gap-2">
                    <span class="text-white/85 flex items-center gap-1.5">
                      <PiggyBank class="w-3.5 h-3.5 shrink-0" />
                      Ahorro vs costos actuales
                    </span>
                    <span class="font-bold tabular-nums whitespace-nowrap">{{ fmtUsd(monthlyCostSavings) }}</span>
                  </li>
                  <li class="flex items-baseline justify-between gap-2">
                    <span class="text-white/85 flex items-center gap-1.5">
                      <Repeat class="w-3.5 h-3.5 shrink-0" />
                      Recompras por Loyalty (neto MAI)
                    </span>
                    <span class="font-bold tabular-nums whitespace-nowrap">{{ fmtUsd(loyaltyGainNet) }}</span>
                  </li>
                  <li class="flex items-baseline justify-between gap-2">
                    <span class="text-white/85 flex items-center gap-1.5">
                      <Ticket class="w-3.5 h-3.5 shrink-0" />
                      Ticket promedio extra (+15%)
                    </span>
                    <span class="font-bold tabular-nums whitespace-nowrap">{{ fmtUsd(ticketUplift) }}</span>
                  </li>
                </ul>
              </div>

              <!-- ROI sidebox -->
              <div class="bg-white/10 border border-white/20 rounded-2xl p-5 text-center backdrop-blur-sm min-w-[180px]">
                <p class="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">
                  Cada USD que invertís
                </p>
                <p class="text-5xl sm:text-6xl font-black tabular-nums tracking-tighter leading-none mb-1">
                  {{ roiMultiple }}x
                </p>
                <p class="text-[11px] text-white/80 leading-snug">
                  Te vuelve en ganancia
                </p>
                <p class="text-[10px] text-emerald-200 mt-3 pt-3 border-t border-white/20 font-bold uppercase tracking-wider">
                  Payback: día 1
                </p>
              </div>
            </div>
          </div>

          <!-- Caso Enterprise: bloque distinto -->
          <div
            v-else
            class="rounded-3xl bg-slate-900 text-white p-7 mb-6 relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none"></div>
            <div class="relative">
              <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Sparkles class="w-3 h-3" />
                Volumen Enterprise
              </p>
              <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter mb-3">
                Tu volumen requiere un acuerdo dedicado.
              </h3>
              <p class="text-sm text-white/80 leading-relaxed">
                Te asignamos un CSM dedicado que arma tu pricing custom en menos de 24h. Comisión desde 1,75%, Marketing AI desde 7%, POS a medida. ROI típico: 15x a 30x mensual.
              </p>
            </div>
          </div>

          <!-- ═══ CTA prominente ═════════════════════════════════════════ -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <RouterLink
              :to="{ path: '/comenzar', query: { from: 'cadenas_calculator' } }"
              class="inline-flex items-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-6 py-4 text-base transition-all shadow-md shadow-primary/20"
            >
              {{ content.starterCtaLabel }}
              <ArrowRight class="w-4 h-4" />
            </RouterLink>
            <a
              :href="content.ctaSecondaryHref"
              class="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors px-4 py-3"
            >
              Hablar con ventas
            </a>
          </div>

          <!-- ═══ Avanzado colapsable (ajustar supuestos) ════════════════ -->
          <details class="rounded-xl bg-slate-50 border border-slate-200 mb-4">
            <summary class="px-4 py-3 cursor-pointer text-sm font-bold text-slate-700 hover:text-slate-900 flex items-center gap-2 select-none">
              <ChevronDown class="w-3.5 h-3.5 transition-transform" />
              Ajustar supuestos (avanzado)
            </summary>
            <div class="px-4 pb-4 pt-2 grid sm:grid-cols-3 gap-4 border-t border-slate-200">
              <div>
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                  Ticket promedio (USD)
                </label>
                <input
                  v-model.number="calc.avgTicket"
                  type="number"
                  min="1"
                  max="500"
                  class="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p class="text-[10px] text-slate-400 mt-1 leading-snug">
                  Para estimar pedidos = facturación / ticket
                </p>
              </div>
              <div>
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                  % comisión que cobran las apps
                </label>
                <input
                  v-model.number="calc.pctCommissionApps"
                  type="number"
                  min="0"
                  max="60"
                  step="1"
                  class="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p class="text-[10px] text-slate-400 mt-1 leading-snug">
                  Rappi/PedidosYa típico AR: 25-35%
                </p>
              </div>
              <div>
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                  % de tu delivery que va por apps hoy
                </label>
                <input
                  v-model.number="calc.pctDeliveryViaApps"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  class="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p class="text-[10px] text-slate-400 mt-1 leading-snug">
                  Default 80%: dependés mucho de Rappi
                </p>
              </div>
            </div>
          </details>

          <p class="text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
            <Info class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{{ content.calculatorFootnote }}</span>
          </p>
        </div>
      </div>

      <!-- ═══ Cómo empezar ═════════════════════════════════════════════
           Cierra la calculadora: el lead ya vio su número, ahora le
           mostramos los 3 pasos concretos para activar la cuenta. -->
      <div class="mb-12">
        <div class="text-center mb-8">
          <p class="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-2">
            {{ content.calculatorHowToStartEyebrow }}
          </p>
          <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 mb-3">
            {{ content.calculatorHowToStartTitle }}
          </h3>
          <p class="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            {{ content.calculatorHowToStartSubtitle }}
          </p>
        </div>

        <div class="grid sm:grid-cols-3 gap-4 mb-8">
          <div
            v-for="(step, i) in content.calculatorSteps"
            :key="step.num"
            class="relative rounded-2xl border border-slate-200 bg-white p-5 hover:border-primary/30 transition-colors"
          >
            <!-- Línea conectora entre pasos (desktop, no en último) -->
            <span
              v-if="i < content.calculatorSteps.length - 1"
              class="hidden sm:block absolute top-1/2 -right-2 w-4 h-0.5 bg-slate-200"
              aria-hidden="true"
            ></span>
            <div class="flex items-start justify-between gap-2 mb-3">
              <span class="text-xl font-black text-primary/30 tabular-nums tracking-tighter">{{ step.num }}</span>
              <span class="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                {{ step.durationLabel }}
              </span>
            </div>
            <h4 class="text-base font-bold text-slate-900 leading-tight mb-1.5">{{ step.title }}</h4>
            <p class="text-sm text-slate-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>

        <!-- CTAs de cierre de la calculadora -->
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <RouterLink
            :to="{ path: '/comenzar', query: { from: 'cadenas_calculator' } }"
            class="inline-flex items-center gap-2 bg-primary hover:bg-[#3c1fc9] text-white font-bold rounded-xl px-6 py-3.5 text-sm transition-all shadow-md shadow-primary/20"
          >
            {{ content.calculatorCtaPrimaryLabel }}
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
          <a
            :href="content.ctaSecondaryHref"
            class="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors px-4 py-3"
          >
            {{ content.calculatorCtaSecondaryLabel }}
          </a>
        </div>
      </div>

      <!-- Escalera de crecimiento ────────────────────────────────────── -->
      <div class="mb-8">
        <div class="text-center mb-8">
          <p class="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-2">
            {{ content.scaleEyebrow }}
          </p>
          <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900 mb-2">
            {{ content.scaleTitle }}
          </h3>
          <p class="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            {{ content.scaleSubtitle }}
          </p>
        </div>

        <!-- Escalera de tiers, cards stacked con el MISMO estilo que StepPlan.
             Cada tier es una card con border-2 + padding generoso. La row
             highlighted (`tier.highlight = true` desde el content) marca el
             tier "Más común" en violeta. "Estás acá" siempre apunta al primer
             tier (Inicio, USD 69) porque es donde TODOS arrancan. Esto da
             coherencia visual entre /cadenas-gastronomicas y /comenzar/plan. -->
        <div class="space-y-2.5">
          <div
            v-for="(tier, i) in content.scaleTiers"
            :key="tier.name"
            class="rounded-2xl border-2 px-5 py-4 transition-colors"
            :class="[
              i === 0
                ? 'border-primary bg-primary/[0.04]'
                : tier.highlight
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-white',
            ]"
          >
            <!-- Línea 1: nombre del tier + badges -->
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :class="i === 0
                  ? 'bg-primary'
                  : tier.highlight
                    ? 'bg-emerald-500'
                    : 'bg-slate-300'"
                aria-hidden="true"
              ></span>
              <span class="text-base font-bold text-slate-900">{{ tier.name }}</span>
              <span
                v-if="i === 0"
                class="text-[10px] font-black text-white bg-primary px-2.5 py-0.5 rounded-full uppercase tracking-widest"
              >
                Empezás acá
              </span>
              <span
                v-else-if="tier.highlight"
                class="text-[10px] font-black text-white bg-emerald-500 px-2.5 py-0.5 rounded-full uppercase tracking-widest"
              >
                {{ content.scaleHighlightLabel }}
              </span>
            </div>

            <!-- Tagline corto (descriptivo del tipo de marca que entra acá) -->
            <p class="text-[12px] text-slate-500 leading-snug mb-3 pl-4">{{ tier.tagline }}</p>

            <!-- Línea 2: stats con mucho aire (Pedidos / Fee / Comisión) -->
            <div class="flex items-baseline gap-x-6 gap-y-2 flex-wrap pl-4">
              <!-- Pedidos -->
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Pedidos/mes
                </p>
                <p class="text-sm font-bold text-slate-700 tabular-nums">
                  {{ tier.ordersLabel }}
                </p>
              </div>
              <!-- Fee -->
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Fee mensual
                </p>
                <p class="text-sm font-bold text-slate-900 tabular-nums whitespace-nowrap">
                  <template v-if="tier.fee !== null">USD {{ tier.fee }}</template>
                  <template v-else>A medida</template>
                </p>
              </div>
              <!-- Comisión delivery -->
              <div class="min-w-0">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Comisión delivery
                </p>
                <p class="text-sm font-bold tabular-nums whitespace-nowrap" :class="i === 0 ? 'text-primary' : 'text-slate-700'">
                  {{ tier.commissionLabel }} en delivery
                </p>
              </div>
              <!-- Marketing AI: INCLUIDO performance — Deenex corre campañas
                   y cobra X% solo sobre recompras EXTRAS que genera. -->
              <div v-if="tier.marketingAiPct" class="min-w-0">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Marketing AI
                </p>
                <p class="text-sm font-bold text-slate-700 tabular-nums whitespace-nowrap">
                  {{ tier.marketingAiPct }}% performance
                </p>
              </div>
              <!-- POS por local (opcional, baja con tier) -->
              <div v-if="tier.posPerLocation" class="min-w-0">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  POS / local
                </p>
                <p class="text-sm font-bold text-slate-700 tabular-nums whitespace-nowrap">
                  USD {{ tier.posPerLocation }}/mes
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con disclaimer, fuera de las cards, mismo tratamiento que
             la nota informativa del StepPlan. -->
        <p class="text-[11px] text-slate-500 leading-relaxed mt-4 flex items-start gap-2">
          <Info class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{{ content.scaleFootnote }}</span>
        </p>
      </div>

      <!-- "Cómo crecemos juntos", narrativa ───────────────────────── -->
      <div class="grid lg:grid-cols-3 gap-4 mb-8">
        <div
          v-for="(promise, i) in content.growthPromises"
          :key="promise.title"
          class="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div class="flex items-center gap-3 mb-3">
            <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
              {{ i + 1 }}
            </span>
            <h4 class="text-sm font-bold text-slate-900 leading-tight">{{ promise.title }}</h4>
          </div>
          <p class="text-sm text-slate-500 leading-relaxed">{{ promise.body }}</p>
        </div>
      </div>

      <!-- Footer-CTA + guarantees -->
      <div class="rounded-3xl bg-gradient-to-br from-primary to-[#3c1fc9] text-white p-7 sm:p-10 relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div class="relative grid lg:grid-cols-[1.3fr_1fr] gap-6 items-center">
          <div>
            <p class="text-[11px] font-black text-white/60 uppercase tracking-[0.25em] mb-3">
              Listo para empezar
            </p>
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tighter leading-tight mb-3">
              {{ content.ctaTitle }}
            </h3>
            <p class="text-sm text-white/85 leading-relaxed mb-5 max-w-md">
              {{ content.ctaSubtitle }}
            </p>
            <div class="flex items-center gap-3 flex-wrap">
              <RouterLink
                :to="{ path: '/comenzar', query: { from: 'cadenas_pricing_footer' } }"
                class="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-5 py-3 text-sm font-bold transition-colors"
              >
                {{ content.ctaPrimaryLabel }}
                <ArrowRight class="w-3.5 h-3.5" />
              </RouterLink>
              <a
                :href="content.ctaSecondaryHref"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 text-sm font-bold text-white/85 hover:text-white transition-colors"
              >
                {{ content.ctaSecondaryLabel }}
              </a>
            </div>
          </div>
          <ul class="grid gap-2 text-sm">
            <li v-for="g in content.ctaGuarantees" :key="g" class="flex items-start gap-2 text-white/85">
              <ShieldCheck class="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
              <span>{{ g }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Sparkles, Rocket, Check, Info, ArrowRight, ShieldCheck, Calculator, TrendingUp, Zap, PiggyBank, Repeat, Ticket, Cpu, Store, CircleDollarSign, Bike, X, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
})

// ═══ Calculadora detallada ═══════════════════════════════════════════
// 4 inputs editables vía slider o numeric input. Todos los outputs son
// computeds reactivos que se actualizan en vivo a medida que el lead
// mueve los sliders.
//
// Modelo de cálculo:
//   pedidos_totales = locales × pedidos_por_local
//   GMV (gross merchandise value) = pedidos_totales × ticket_promedio
//   tier = primer scaleTiers[i] cuyo maxOrders >= pedidos_totales
//   costo_deenex = tier.fee + (GMV × tier.commissionPct / 100)
//   costo_apps   = (GMV × pctViaApps/100) × APPS_COMMISSION_PCT/100
//   ahorro_mes   = max(0, costo_apps - costo_deenex)
//
// APPS_COMMISSION_PCT viene del content para que sea auditable y editable
// sin tocar código.

// Modelo 2026 v3 — Calculadora rediseñada (Sin Deenex vs Con Deenex):
//   3 inputs principales: locations, monthlyRevenueUsd, pctDelivery.
//   3 inputs avanzados (colapsables): avgTicket, pctCommissionApps,
//   pctDeliveryViaApps (qué % del delivery actualmente va por apps).
//   Output: dos cards comparativas con desglose + hero de ganancia neta.
const locationsPresets = [1, 3, 5, 10, 25, 50]

const calc = reactive({
  locations: props.content.calculatorDefaults?.locations ?? 5,
  monthlyRevenueUsd: props.content.calculatorDefaults?.monthlyRevenueUsd ?? 50000,
  pctDelivery: props.content.calculatorDefaults?.pctDelivery ?? 40,
  // ── Avanzado (colapsable) ───────────────────────────────────────
  // avgTicket: para estimar pedidos totales = revenue / ticket.
  avgTicket: props.content.calculatorDefaults?.avgTicket ?? 15,
  // pctCommissionApps: lo que cobra Rappi/PedidosYa (típico AR 25-35%).
  pctCommissionApps: props.content.calculatorDefaults?.pctCommissionApps ?? 30,
  // pctDeliveryViaApps: del delivery del lead, qué % va por apps HOY.
  // Default 80 — la mayoría de marcas sin canal propio dependen mucho de apps.
  pctDeliveryViaApps: props.content.calculatorDefaults?.pctDeliveryViaApps ?? 80,
})

const POS_INDUSTRY_COST = props.content.posIndustryCostPerLocation ?? 20

// ── Métricas derivadas ──────────────────────────────────────────────
// gmvUsd = facturación mensual ingresada por el lead (es el input directo).
const gmvUsd = computed(() => Math.max(0, Number(calc.monthlyRevenueUsd) || 0))

// totalOrders = facturación / ticket promedio. Estimación para mapear tier.
const totalOrders = computed(() => {
  const ticket = Math.max(1, Number(calc.avgTicket) || 15)
  return Math.round(gmvUsd.value / ticket)
})

// deliveryGmv = porción del GMV que es delivery (de cualquier canal).
const deliveryGmv = computed(() => {
  const pct = Math.max(0, Math.min(100, Number(calc.pctDelivery) || 0))
  return gmvUsd.value * (pct / 100)
})

// ── Tier asignado según pedidos totales ─────────────────────────────
const calcTier = computed(() => {
  const n = totalOrders.value
  const tiers = props.content.scaleTiers || []
  return tiers.find((t) => t.maxOrders === null || n <= t.maxOrders) || tiers[0]
})

// ═══ SIN DEENEX (estado actual del lead) ════════════════════════════
// El lead hoy paga POS típico ($20/local) + comisión a apps de delivery
// sobre la porción de su delivery que efectivamente pasa por Rappi/PedidosYa.
const sinDeenexPosCost = computed(() => {
  const locations = Math.max(0, Number(calc.locations) || 0)
  return locations * POS_INDUSTRY_COST
})

const sinDeenexAppsCost = computed(() => {
  const pctViaApps = Math.max(0, Math.min(100, Number(calc.pctDeliveryViaApps) || 0))
  const commPct = Math.max(0, Math.min(100, Number(calc.pctCommissionApps) || 0))
  return deliveryGmv.value * (pctViaApps / 100) * (commPct / 100)
})

const sinDeenexTotal = computed(() => sinDeenexPosCost.value + sinDeenexAppsCost.value)

// ═══ CON DEENEX (4 componentes del costo) ═══════════════════════════
// Comisión Deenex aplica sobre el delivery total (canal propio + reemplaza apps).
const conDeenexDeliveryCommission = computed(() => {
  const tier = calcTier.value
  if (tier.fee === null || tier.commissionPct == null) return 0
  return deliveryGmv.value * (tier.commissionPct / 100)
})

// Loyalty uplift = recompras extras generadas por Marketing AI + Loyalty.
const loyaltyUplift = computed(() => {
  const pct = props.content.valueAssumptions?.recurrenceUpliftPct ?? 20
  return gmvUsd.value * (pct / 100)
})

// Marketing AI Fee (performance) = % sobre loyaltyUplift. Sin uplift = sin fee.
const marketingAiFee = computed(() => {
  const tier = calcTier.value
  if (tier.marketingAiPct == null) return 0
  return loyaltyUplift.value * (tier.marketingAiPct / 100)
})

// POS integrado con Deenex (escala por tier de USD 20 a USD 7).
const conDeenexPosCost = computed(() => {
  const tier = calcTier.value
  const perLoc = Math.max(0, Number(tier.posPerLocation) || 0)
  const locations = Math.max(0, Number(calc.locations) || 0)
  return locations * perLoc
})

// Total Deenex monthly = bundle + delivery commission + MAI fee + POS.
// null si Enterprise → muestra bloque "a medida" separado.
const conDeenexTotal = computed(() => {
  const tier = calcTier.value
  if (tier.fee === null) return null
  return tier.fee + conDeenexDeliveryCommission.value + marketingAiFee.value + conDeenexPosCost.value
})

// ═══ GANANCIA NETA = ahorro + uplift loyalty (neto MAI) + uplift ticket ══
const monthlyCostSavings = computed(() => {
  if (conDeenexTotal.value === null) return 0
  return Math.max(0, sinDeenexTotal.value - conDeenexTotal.value)
})

const loyaltyGainNet = computed(() => Math.max(0, loyaltyUplift.value - marketingAiFee.value))

const ticketUplift = computed(() => {
  const pct = props.content.valueAssumptions?.ticketUpliftPct ?? 15
  return gmvUsd.value * (pct / 100)
})

const totalMonthlyBenefit = computed(() => {
  if (conDeenexTotal.value === null) return 0
  return monthlyCostSavings.value + loyaltyGainNet.value + ticketUplift.value
})

const totalAnnualBenefit = computed(() => Math.round(totalMonthlyBenefit.value) * 12)

// ROI multiple = cada USD invertido en Deenex te vuelve Xx en ganancia neta.
// Useful frame para que el lead vea el ratio inversión/retorno.
const roiMultiple = computed(() => {
  if (conDeenexTotal.value === null || conDeenexTotal.value <= 0) return '—'
  const ratio = totalMonthlyBenefit.value / conDeenexTotal.value
  if (!isFinite(ratio) || ratio <= 0) return '—'
  return ratio.toFixed(1)
})

// ── Formatters ──────────────────────────────────────────────────────
function fmt(n) {
  if (n == null || Number.isNaN(n)) return '0'
  return Math.round(n).toLocaleString('es-AR')
}
function fmtUsd(n) {
  if (n === null) return 'A medida'
  if (n == null || Number.isNaN(n)) return 'USD 0'
  return 'USD ' + Math.round(n).toLocaleString('es-AR')
}
</script>
