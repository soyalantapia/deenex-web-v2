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

      <!-- ═══ Calculadora detallada ═══════════════════════════════════════
           4 inputs (locales · pedidos/local · ticket · % via apps) con
           sliders + numerics. Output en vivo: tier asignado, costo Deenex
           vs costo apps, ahorro mensual y anual. El anchor #calculadora-deenex
           lo target el link "Calcular mi ahorro" del hero card. -->
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

        <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          <div class="grid lg:grid-cols-2 gap-10 lg:gap-14">
            <!-- ── INPUTS ──────────────────────────────────────────── -->
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">
                Tu operación actual
              </p>
              <div class="space-y-6">
                <!-- Locales -->
                <div>
                  <div class="flex items-center justify-between mb-2 gap-3">
                    <label for="calc-locations" class="text-sm font-bold text-slate-700">
                      Cantidad de locales
                    </label>
                    <div class="flex items-center gap-1.5">
                      <input
                        id="calc-locations"
                        v-model.number="calc.locations"
                        type="number"
                        min="1"
                        max="500"
                        class="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm font-bold tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                      <span class="text-[11px] text-slate-500">locales</span>
                    </div>
                  </div>
                  <input
                    v-model.number="calc.locations"
                    type="range"
                    min="1"
                    max="200"
                    step="1"
                    class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                    aria-label="Locales slider"
                  />
                  <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold tabular-nums">
                    <span>1</span>
                    <span>50</span>
                    <span>100</span>
                    <span>200+</span>
                  </div>
                </div>

                <!-- Pedidos por local -->
                <div>
                  <div class="flex items-center justify-between mb-2 gap-3">
                    <label for="calc-opl" class="text-sm font-bold text-slate-700">
                      Pedidos / local / mes
                    </label>
                    <div class="flex items-center gap-1.5">
                      <input
                        id="calc-opl"
                        v-model.number="calc.ordersPerLocation"
                        type="number"
                        min="0"
                        max="10000"
                        step="10"
                        class="w-20 px-2 py-1 border border-slate-300 rounded-lg text-sm font-bold tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                      <span class="text-[11px] text-slate-500">pedidos</span>
                    </div>
                  </div>
                  <input
                    v-model.number="calc.ordersPerLocation"
                    type="range"
                    min="0"
                    max="2500"
                    step="10"
                    class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                    aria-label="Pedidos por local slider"
                  />
                  <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold tabular-nums">
                    <span>0</span>
                    <span>500</span>
                    <span>1.500</span>
                    <span>2.500+</span>
                  </div>
                </div>

                <!-- Ticket promedio -->
                <div>
                  <div class="flex items-center justify-between mb-2 gap-3">
                    <label for="calc-ticket" class="text-sm font-bold text-slate-700">
                      Ticket promedio
                    </label>
                    <div class="flex items-center gap-1.5">
                      <span class="text-[11px] text-slate-500">USD</span>
                      <input
                        id="calc-ticket"
                        v-model.number="calc.avgTicket"
                        type="number"
                        min="1"
                        max="500"
                        step="1"
                        class="w-16 px-2 py-1 border border-slate-300 rounded-lg text-sm font-bold tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>
                  <input
                    v-model.number="calc.avgTicket"
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                    aria-label="Ticket promedio slider"
                  />
                  <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold tabular-nums">
                    <span>USD 5</span>
                    <span>USD 25</span>
                    <span>USD 50</span>
                    <span>USD 100+</span>
                  </div>
                </div>

                <!-- Mix de canales, agrupador visual con 2 sliders separados.
                     Modelo nuevo: comisión Deenex aplica SOLO a delivery propio,
                     y el lead controla el % de Rappi por separado (con su % de
                     comisión editable, porque varía 25-40% según país/segmento).
                     El % que no es ni delivery propio ni apps queda implícito
                     como mesa/takeaway presencial (sin comisión). -->
                <div class="rounded-xl bg-slate-50/50 border border-slate-200 p-3.5 space-y-4">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Repeat class="w-3 h-3" />
                    Mix de canales (% del GMV total)
                  </p>

                  <!-- % delivery (canal Deenex, todos los pedidos delivery) -->
                  <div>
                    <div class="flex items-center justify-between mb-2 gap-3">
                      <label for="calc-pct-delivery" class="text-sm font-bold text-slate-700 leading-tight">
                        % delivery (canal Deenex)
                      </label>
                      <div class="flex items-center gap-1.5">
                        <input
                          id="calc-pct-delivery"
                          v-model.number="calc.pctDeliveryPropio"
                          type="number"
                          min="0"
                          max="100"
                          step="5"
                          class="w-14 px-2 py-1 border border-slate-300 rounded-lg text-sm font-bold tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                        <span class="text-[11px] text-slate-500">%</span>
                      </div>
                    </div>
                    <input
                      v-model.number="calc.pctDeliveryPropio"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                      aria-label="% delivery propio slider"
                    />
                    <p class="text-[10px] text-slate-400 mt-1 font-medium">
                      La comisión Deenex (<span class="font-bold">{{ calcTier.commissionLabel }}</span>) aplica solo sobre este %.
                    </p>
                  </div>

                  <!-- % via apps -->
                  <div>
                    <div class="flex items-center justify-between mb-2 gap-3">
                      <label for="calc-pct-apps" class="text-sm font-bold text-slate-700 leading-tight">
                        % via Rappi / PedidosYa
                      </label>
                      <div class="flex items-center gap-1.5">
                        <input
                          id="calc-pct-apps"
                          v-model.number="calc.pctViaApps"
                          type="number"
                          min="0"
                          max="100"
                          step="5"
                          class="w-14 px-2 py-1 border border-slate-300 rounded-lg text-sm font-bold tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                        <span class="text-[11px] text-slate-500">%</span>
                      </div>
                    </div>
                    <input
                      v-model.number="calc.pctViaApps"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                      aria-label="% apps slider"
                    />
                    <!-- Sub-input: % comisión que cobran las apps (editable) -->
                    <div class="mt-2 flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                      <span>Comisión que te cobran:</span>
                      <div class="flex items-center gap-1">
                        <input
                          v-model.number="calc.pctCommissionApps"
                          type="number"
                          min="0"
                          max="60"
                          step="1"
                          class="w-12 px-1.5 py-0.5 border border-slate-300 rounded text-[11px] font-bold tabular-nums text-right focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                          aria-label="% comisión apps"
                        />
                        <span class="font-bold">%</span>
                      </div>
                      <span class="text-slate-400">(default 30% típico AR)</span>
                    </div>
                  </div>

                  <!-- Validación visual: muestra % presencial implícito -->
                  <p
                    v-if="pctPresencial > 0"
                    class="text-[10px] text-slate-400 leading-snug pt-2 border-t border-slate-200"
                  >
                    <span class="font-bold tabular-nums">{{ pctPresencial }}%</span> implícito en mesa/takeaway presencial (sin comisión).
                  </p>
                  <p
                    v-else-if="pctPresencial < 0"
                    class="text-[10px] text-rose-600 leading-snug pt-2 border-t border-rose-100 font-medium"
                  >
                    ⚠️ La suma supera el 100%. Ajustá los sliders para que delivery + apps ≤ 100%.
                  </p>
                </div>

                <!-- Toggle: ¿Tenés POS hoy? Compact UI, marcado por default
                     porque la mayoría de las cadenas SÍ usan POS. -->
                <label
                  for="calc-has-pos"
                  class="flex items-start gap-3 cursor-pointer rounded-xl border border-slate-200 hover:border-primary/40 transition-colors p-3.5"
                  :class="calc.hasPos ? 'bg-primary/[0.04] border-primary/30' : 'bg-white'"
                >
                  <input
                    id="calc-has-pos"
                    v-model="calc.hasPos"
                    type="checkbox"
                    class="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <Cpu class="w-3.5 h-3.5 text-primary shrink-0" />
                      <span class="text-sm font-bold text-slate-800">Ya uso un POS hoy</span>
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider">(Fudo · Maxirest · Bistrosoft…)</span>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug mt-1">
                      Hoy pagás ~USD {{ POS_INDUSTRY_COST }}/local. Con Deenex el POS se integra y el costo cae con cada tier.
                    </p>
                  </div>
                </label>
              </div>

              <p class="text-[11px] text-slate-400 leading-relaxed mt-6 flex items-start gap-1.5">
                <Info class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{{ content.calculatorFootnote }}</span>
              </p>
            </div>

            <!-- ── OUTPUTS ─────────────────────────────────────────── -->
            <div class="lg:border-l lg:border-slate-200 lg:pl-14">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">
                Tu cotización en vivo
              </p>

              <!-- Métricas de volumen -->
              <div class="grid grid-cols-2 gap-3 mb-5">
                <div class="rounded-xl bg-slate-50 p-3.5">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Pedidos / mes
                  </p>
                  <p class="text-2xl font-extrabold text-slate-900 tabular-nums leading-tight">
                    {{ fmt(totalOrders) }}
                  </p>
                </div>
                <div class="rounded-xl bg-slate-50 p-3.5">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    GMV / mes
                  </p>
                  <p class="text-2xl font-extrabold text-slate-900 tabular-nums leading-tight">
                    {{ fmtUsd(gmvUsd) }}
                  </p>
                </div>
              </div>

              <!-- Tier asignado (highlighted en violeta) con precio POS/local
                   incluido como línea complementaria si hasPos === true. -->
              <div class="rounded-xl bg-primary text-white p-4 mb-5 relative overflow-hidden">
                <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                <div class="relative">
                  <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Sparkles class="w-3 h-3" />
                    Tu tier en Deenex
                  </p>
                  <div class="flex items-baseline gap-2 flex-wrap">
                    <span class="text-2xl font-black tracking-tighter">{{ calcTier.name }}</span>
                    <span class="text-white/40">·</span>
                    <span class="text-xl font-bold tabular-nums">
                      <template v-if="calcTier.fee !== null">USD {{ calcTier.fee }}<span class="text-sm text-white/70 font-normal"> / mes</span></template>
                      <template v-else>A medida</template>
                    </span>
                  </div>
                  <p class="text-[12px] text-white/80 mt-1">
                    + <span class="font-bold tabular-nums">{{ calcTier.commissionLabel }}</span> de comisión <span class="text-white/60">solo en delivery</span>
                  </p>
                  <!-- Marketing AI: add-on opcional (% sobre venta atribuida) -->
                  <p
                    v-if="calcTier.marketingAiPct !== undefined && calcTier.marketingAiPct !== null"
                    class="text-[12px] text-white/80 mt-1 flex items-center gap-1.5"
                  >
                    <Sparkles class="w-3 h-3" />
                    Marketing AI opcional: <span class="font-bold tabular-nums">{{ calcTier.marketingAiPct }}%</span> sobre venta atribuida
                  </p>
                  <!-- POS / local en este tier (si aplica) -->
                  <p
                    v-if="calc.hasPos && posCostPerLocationCurrentTier !== null"
                    class="text-[12px] text-white/80 mt-1 flex items-center gap-1.5"
                  >
                    <Cpu class="w-3 h-3" />
                    POS integrado: <span class="font-bold tabular-nums">USD {{ posCostPerLocationCurrentTier }}/local</span>
                    <span
                      v-if="posCostPerLocationCurrentTier < POS_INDUSTRY_COST"
                      class="text-[10px] font-black bg-emerald-400 text-emerald-950 px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      −{{ Math.round((1 - posCostPerLocationCurrentTier / POS_INDUSTRY_COST) * 100) }}%
                    </span>
                  </p>
                </div>
              </div>

              <!-- Comparativa: Deenex vs apps de terceros.
                   La row de "apps" se oculta si pctViaApps === 0, sino genera
                   ruido visual (USD 0 tachado no aporta nada al lead). -->
              <div class="space-y-2.5 mb-5">
                <div class="flex items-baseline justify-between gap-3 pb-2.5 border-b border-slate-200">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-700">Tu costo con Deenex</p>
                    <p v-if="calcTier.fee !== null" class="text-[11px] text-slate-400 leading-snug">
                      USD {{ calcTier.fee }} bundle + {{ fmtUsd(commissionCost) }} comisión <span class="font-medium">({{ calcTier.commissionLabel }} sobre {{ calc.pctDeliveryPropio }}% delivery)</span>
                    </p>
                    <p v-else class="text-[11px] text-slate-400 leading-snug">
                      Volumen Enterprise, acuerdo dedicado
                    </p>
                  </div>
                  <span class="text-xl font-extrabold text-slate-900 tabular-nums whitespace-nowrap">
                    {{ fmtUsd(deenexMonthlyCost) }}<span v-if="deenexMonthlyCost !== null" class="text-xs text-slate-400 font-normal">/mes</span>
                  </span>
                </div>
                <div
                  v-if="calc.pctViaApps > 0"
                  class="flex items-baseline justify-between gap-3 pb-2.5 border-b border-slate-200"
                >
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-700">Comisión que pagás en apps de delivery</p>
                    <p class="text-[11px] text-slate-400 leading-snug">
                      {{ calc.pctViaApps }}% del GMV × {{ calc.pctCommissionApps }}% (Rappi/PedidosYa)
                    </p>
                  </div>
                  <span class="text-xl font-extrabold text-slate-400 line-through tabular-nums whitespace-nowrap">
                    {{ fmtUsd(appsMonthlyCost) }}<span class="text-xs font-normal">/mes</span>
                  </span>
                </div>
              </div>

              <!-- ═══ Bloque "Tu ganancia neta con Deenex" ════════════════
                   Suma 3 componentes:
                   1. Ahorro de comisión vs apps (si pctApps > 0)
                   2. Recompras extra (Loyalty +20% sobre GMV)
                   3. Ticket promedio +15% sobre GMV
                   Enterprise tiene su propio bloque (no aplica este cálculo). -->
              <div
                v-if="deenexMonthlyCost === null"
                class="rounded-xl bg-slate-50 border border-slate-200 p-4"
              >
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Sparkles class="w-3 h-3" />
                  Volumen Enterprise
                </p>
                <p class="text-sm text-slate-700 leading-relaxed">
                  A este volumen te asignamos un CSM dedicado que arma tu acuerdo comercial en menos de 24h. Comisión desde 0,5% + proyección de uplift dedicada.
                </p>
              </div>
              <div
                v-else
                class="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 p-5"
              >
                <!-- Hero del bloque: total mensual + anual -->
                <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <TrendingUp class="w-3 h-3" />
                  Tu ganancia neta con Deenex
                </p>
                <p class="text-4xl sm:text-5xl font-black text-emerald-700 tabular-nums tracking-tighter leading-none mb-1">
                  {{ fmtUsd(totalMonthlyValue) }}<span class="text-base text-emerald-700/70 font-bold"> / mes</span>
                </p>
                <p class="text-sm text-emerald-700/85 leading-relaxed mt-2 mb-4">
                  <span class="font-bold tabular-nums">{{ fmtUsd(totalAnnualValue) }}</span> al año combinando ahorro de comisión + recompras extra + uplift de ticket.
                </p>

                <!-- Desglose de los 4 componentes de valor -->
                <div class="space-y-2 pt-4 border-t border-emerald-200/60">
                  <div
                    v-if="monthlySavings > 0"
                    class="flex items-baseline justify-between gap-2 text-sm"
                  >
                    <span class="text-emerald-800/85 flex items-center gap-1.5 leading-snug">
                      <PiggyBank class="w-3.5 h-3.5 shrink-0" />
                      Ahorro de comisión vs apps
                    </span>
                    <span class="font-bold tabular-nums text-emerald-800 whitespace-nowrap">
                      {{ fmtUsd(monthlySavings) }}
                    </span>
                  </div>
                  <div class="flex items-baseline justify-between gap-2 text-sm">
                    <span class="text-emerald-800/85 flex items-center gap-1.5 leading-snug">
                      <Repeat class="w-3.5 h-3.5 shrink-0" />
                      Recompras extra · Loyalty +{{ content.valueAssumptions.recurrenceUpliftPct }}%
                    </span>
                    <span class="font-bold tabular-nums text-emerald-800 whitespace-nowrap">
                      {{ fmtUsd(loyaltyUplift) }}
                    </span>
                  </div>
                  <div class="flex items-baseline justify-between gap-2 text-sm">
                    <span class="text-emerald-800/85 flex items-center gap-1.5 leading-snug">
                      <Ticket class="w-3.5 h-3.5 shrink-0" />
                      Ticket promedio +{{ content.valueAssumptions.ticketUpliftPct }}% (cross-sell + campañas)
                    </span>
                    <span class="font-bold tabular-nums text-emerald-800 whitespace-nowrap">
                      {{ fmtUsd(ticketUplift) }}
                    </span>
                  </div>
                  <!-- Ahorro POS: solo si el lead tiene POS Y el tier ofrece
                       descuento vs mercado (tier ≠ Inicio donde hay paridad). -->
                  <div
                    v-if="posSavings > 0"
                    class="flex items-baseline justify-between gap-2 text-sm"
                  >
                    <span class="text-emerald-800/85 flex items-center gap-1.5 leading-snug">
                      <Cpu class="w-3.5 h-3.5 shrink-0" />
                      Ahorro de POS · USD {{ posCostPerLocationCurrentTier }}/local vs USD {{ POS_INDUSTRY_COST }} mercado
                    </span>
                    <span class="font-bold tabular-nums text-emerald-800 whitespace-nowrap">
                      {{ fmtUsd(posSavings) }}
                    </span>
                  </div>
                  <!-- Mensaje informativo en tier Inicio: paridad, no ahorro -->
                  <div
                    v-else-if="calc.hasPos && posCostPerLocationCurrentTier === POS_INDUSTRY_COST"
                    class="flex items-baseline justify-between gap-2 text-[11px] text-slate-500"
                  >
                    <span class="flex items-center gap-1.5 leading-snug">
                      <Cpu class="w-3 h-3 shrink-0 text-slate-400" />
                      POS integrado a paridad de mercado (sin descuento en tier Inicio)
                    </span>
                    <span class="tabular-nums whitespace-nowrap">USD 0</span>
                  </div>
                </div>

                <!-- Mensaje contextual para casos sin apps -->
                <p
                  v-if="calc.pctViaApps === 0"
                  class="text-[11px] text-emerald-700/70 leading-snug mt-4 pt-3 border-t border-emerald-200/60"
                >
                  <Zap class="w-3 h-3 inline -mt-0.5" />
                  Tu ganancia viene 100% de la palanca de canal propio (recompras + ticket). Cuando sumes algo de delivery por terceros, vas a ver también el ahorro de comisión.
                </p>
              </div>
            </div>
          </div>
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
              <!-- Marketing AI (opcional, add-on % sobre ventas atribuidas) -->
              <div v-if="tier.marketingAiPct" class="min-w-0">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Marketing AI
                </p>
                <p class="text-sm font-bold text-slate-700 tabular-nums whitespace-nowrap">
                  {{ tier.marketingAiPct }}% atribución
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
import { Sparkles, Rocket, Check, Info, ArrowRight, ShieldCheck, Calculator, TrendingUp, Zap, PiggyBank, Repeat, Ticket, Cpu } from 'lucide-vue-next'

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

const calc = reactive({
  locations: props.content.calculatorDefaults?.locations ?? 5,
  ordersPerLocation: props.content.calculatorDefaults?.ordersPerLocation ?? 300,
  avgTicket: props.content.calculatorDefaults?.avgTicket ?? 15,
  // Modelo 2026 v2: separamos canal en 2 inputs.
  // pctDeliveryPropio: % del GMV que es delivery propio (canal Deenex)
  //   → SOBRE este % aplica la comisión Deenex (3% solo en delivery).
  // pctViaApps: % del GMV que va por Rappi/PedidosYa
  //   → SOBRE este % aplica el costo de comisión de apps de terceros.
  // El resto (100 - delivery - apps) es mesa/takeaway presencial → sin comisión.
  pctDeliveryPropio: props.content.calculatorDefaults?.pctDeliveryPropio ?? 30,
  pctViaApps: props.content.calculatorDefaults?.pctViaApps ?? 30,
  // pctCommissionApps: % de comisión que el lead paga a Rappi/PedidosYa.
  // Editable porque varía 25-40% según país/segmento. Default 30 (típico AR).
  pctCommissionApps: props.content.calculatorDefaults?.pctCommissionApps ?? 30,
  // hasPos: si el lead ya tiene un sistema POS hoy (Fudo, Maxirest, etc.).
  // Default true porque la inmensa mayoría de cadenas gastronómicas SÍ tienen.
  // Toggleable para que el lead que no tiene POS no vea el ahorro irrelevante.
  hasPos: props.content.calculatorDefaults?.hasPos ?? true,
})

const POS_INDUSTRY_COST = props.content.posIndustryCostPerLocation ?? 20

// ── Métricas de volumen ─────────────────────────────────────────────
const totalOrders = computed(() => {
  const l = Math.max(0, Number(calc.locations) || 0)
  const o = Math.max(0, Number(calc.ordersPerLocation) || 0)
  return l * o
})

const gmvUsd = computed(() => {
  const t = Math.max(0, Number(calc.avgTicket) || 0)
  return totalOrders.value * t
})

// ── Tier asignado según pedidos totales ─────────────────────────────
const calcTier = computed(() => {
  const n = totalOrders.value
  const tiers = props.content.scaleTiers || []
  return tiers.find((t) => t.maxOrders === null || n <= t.maxOrders) || tiers[0]
})

// % presencial implícito = 100 - delivery propio - apps. Si negativo,
// significa que el lead puso una suma >100 entre los 2 sliders (error UX).
const pctPresencial = computed(() => {
  const del = Math.max(0, Number(calc.pctDeliveryPropio) || 0)
  const apps = Math.max(0, Number(calc.pctViaApps) || 0)
  return 100 - del - apps
})

// ── Costos mensuales ────────────────────────────────────────────────
// Comisión Deenex aplica SOLO al delivery propio (no al GMV total).
// Por eso multiplica por pctDeliveryPropio antes del % del tier.
// Útil para el desglose ("USD 119 fee + USD X comisión delivery").
const commissionCost = computed(() => {
  const tier = calcTier.value
  if (tier.fee === null || tier.commissionPct === undefined) return 0
  const pctDel = Math.max(0, Math.min(100, Number(calc.pctDeliveryPropio) || 0))
  return gmvUsd.value * (pctDel / 100) * (tier.commissionPct / 100)
})

const deenexMonthlyCost = computed(() => {
  const tier = calcTier.value
  // Enterprise → fee null → "a medida" (no calculamos un número).
  if (tier.fee === null) return null
  return tier.fee + commissionCost.value
})

// Costo de comisión de Rappi/PedidosYa. Aplica al % via apps del GMV
// usando el `pctCommissionApps` editable (default 30%, range 20-40).
const appsMonthlyCost = computed(() => {
  const pct = Math.max(0, Math.min(100, Number(calc.pctViaApps) || 0))
  const commPct = Math.max(0, Math.min(100, Number(calc.pctCommissionApps) || 0))
  return gmvUsd.value * (pct / 100) * (commPct / 100)
})

// ── Ahorro de comisión vs apps ──────────────────────────────────────
// 1er componente del valor total. Solo > 0 si el lead vende por apps hoy.
const monthlySavings = computed(() => {
  if (deenexMonthlyCost.value === null) return null
  return Math.max(0, appsMonthlyCost.value - deenexMonthlyCost.value)
})

// ── Uplift por Loyalty (recompras extra) ────────────────────────────
// 2do componente: GMV adicional generado por mayor recurrencia gracias
// a Loyalty (puntos, niveles VIP, cupones segmentados). Asumimos margen
// casi total sobre el uplift (porque la comisión Deenex es marginal vs el
// valor incremental). El usuario ve el % en el footnote para auditar.
const loyaltyUplift = computed(() => {
  const pct = props.content.valueAssumptions?.recurrenceUpliftPct ?? 20
  return gmvUsd.value * (pct / 100)
})

// ── Uplift por Ticket promedio ──────────────────────────────────────
// 3er componente: GMV extra por aumento del ticket promedio (cross-sell
// con cupones, campañas personalizadas, productos sugeridos en checkout).
const ticketUplift = computed(() => {
  const pct = props.content.valueAssumptions?.ticketUpliftPct ?? 15
  return gmvUsd.value * (pct / 100)
})

// ── Ahorro de POS por integración (4° componente) ───────────────────
// Si el lead ya tiene un POS hoy (Fudo/Maxirest/etc.) paga ~USD 20/local.
// Deenex tiene precio escalonado de POS por tier: arranca en USD 20/local
// (paridad Inicio) y cae progresivamente hasta USD 7/local (Pro). El
// ahorro = locales × (mercado - tier.posPerLocation). En tier Inicio
// el ahorro es 0 (paridad). En tier Pro es máximo (USD 13/local).
// Solo se computa si hasPos === true.
const posSavings = computed(() => {
  if (!calc.hasPos) return 0
  const tier = calcTier.value
  if (tier.posPerLocation === null || tier.posPerLocation === undefined) return 0
  const locations = Math.max(0, Number(calc.locations) || 0)
  return locations * Math.max(0, POS_INDUSTRY_COST - tier.posPerLocation)
})

// Precio del POS por local en el tier actual (para mostrar en la card del tier).
// Null si Enterprise.
const posCostPerLocationCurrentTier = computed(() => {
  return calcTier.value.posPerLocation ?? null
})

// ── Ganancia total mensual con Deenex (suma de los 4 componentes) ───
// Esto es lo que realmente importa al lead: cuánto MÁS dinero le entra
// (o deja de salir) cada mes activando Deenex.
const totalMonthlyValue = computed(() => {
  if (deenexMonthlyCost.value === null) return null
  const savings = monthlySavings.value ?? 0
  return savings + loyaltyUplift.value + ticketUplift.value + posSavings.value
})

// Anual = ganancia mensual REDONDEADA × 12. Sin redondear, monthly se
// muestra como USD 3.244 pero el anual usa el raw (3243.5), generando
// inconsistencia visible (3.244 × 12 ≠ 38.922). Redondeamos primero.
const totalAnnualValue = computed(() =>
  totalMonthlyValue.value !== null ? Math.round(totalMonthlyValue.value) * 12 : null
)

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
