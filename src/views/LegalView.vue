<template>
  <div class="min-h-screen bg-white">
    <header class="border-b border-slate-100">
      <div class="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <RouterLink to="/" class="shrink-0">
          <img src="@/assets/images/nav-logo.webp" alt="Deenex" class="h-5 w-auto" />
        </RouterLink>
        <RouterLink
          to="/"
          class="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Volver al inicio
        </RouterLink>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-16">
      <p class="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">
        {{ kind === 'terms' ? 'Términos y condiciones' : 'Política de privacidad' }}
      </p>
      <h1 class="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-tighter leading-[1.05] text-slate-900 mb-6">
        <template v-if="kind === 'terms'">Reglas claras,<br/><span class="text-primary italic font-light">sin sorpresas.</span></template>
        <template v-else>Tu data,<br/><span class="text-primary italic font-light">tu propiedad.</span></template>
      </h1>
      <p class="text-base text-slate-500 leading-relaxed max-w-xl mb-10">
        Última actualización: {{ formattedDate }}.
      </p>

      <article class="prose prose-slate max-w-none">
        <template v-if="kind === 'terms'">
          <h2>1. Aceptación</h2>
          <p>
            Al activar tu cuenta de Deenex aceptás estos términos y la
            <RouterLink to="/privacidad" class="text-primary underline">política de privacidad</RouterLink>.
            Si no estás de acuerdo, no podés usar la plataforma.
          </p>

          <h2>2. Trial gratuito</h2>
          <p>
            Te damos 15 días gratis para probar la plataforma. Durante ese período no
            te cobramos nada. El primer cargo se hace el día 16 según el plan
            seleccionado y el método de pago configurado.
          </p>

          <h2>3. Pagos y cancelaciones</h2>
          <p>
            Si elegiste MercadoPago, el cobro se hace automáticamente el día 16 y
            cada mes en la misma fecha. Si cancelás antes, no te cobramos. Podés
            cancelar en 1 click desde tu panel — sin permanencia, sin penalidades.
          </p>

          <h2>4. Tus datos</h2>
          <p>
            Vos sos dueño de tus datos de cliente, menú, ventas y campañas. Si
            decidís bajar la cuenta, te los exportamos en formatos abiertos
            (CSV, JSON) sin preguntas.
          </p>

          <h2>5. Uso aceptable</h2>
          <p>
            Deenex es una plataforma comercial de venta gastronómica. No podés
            usarla para spam, fraude, o cualquier actividad contraria a la ley.
            Nos reservamos el derecho de suspender cuentas que violen este punto.
          </p>

          <h2>6. Limitación de responsabilidad</h2>
          <p>
            Hacemos lo posible por mantener la plataforma estable, pero no podemos
            garantizar disponibilidad 100% del tiempo. No nos hacemos responsables
            por lucro cesante derivado de caídas del servicio.
          </p>

          <h2>7. Contacto</h2>
          <p>
            Cualquier duda, escribinos a
            <a href="mailto:legal@deenex.tech" class="text-primary underline">legal@deenex.tech</a>.
          </p>

          <p class="text-xs text-slate-400 italic mt-10">
            Este es un borrador placeholder. El equipo legal va a publicar el documento
            definitivo antes del go-live público.
          </p>
        </template>

        <template v-else>
          <h2>1. Qué recolectamos</h2>
          <p>
            Cuando creás una cuenta te pedimos: nombre, email, WhatsApp y datos
            básicos de tu negocio (marca, cantidad de locales, sistema POS).
            Cuando operás, registramos las ventas, los clientes y las campañas
            que mandás. Nada más.
          </p>

          <h2>2. Cómo lo usamos</h2>
          <ul>
            <li>Para que la plataforma funcione (sin tu email no podés loguearte).</li>
            <li>Para mandarte avisos operativos importantes (cobros, problemas técnicos).</li>
            <li>Para que tu Customer Success Manager te pueda ayudar.</li>
          </ul>
          <p>
            Nunca vendemos tus datos. Nunca los compartimos con terceros sin tu
            consentimiento explícito.
          </p>

          <h2>3. Cookies y tracking</h2>
          <p>
            Usamos Google Analytics 4 para entender cómo se usa la landing y la
            plataforma. Los eventos están anonimizados a nivel agregado.
          </p>

          <h2>4. Tus derechos</h2>
          <p>
            En cualquier momento podés pedirnos:
          </p>
          <ul>
            <li>Una copia de todos los datos que tenemos sobre vos.</li>
            <li>La corrección de datos incorrectos.</li>
            <li>La eliminación total de tu cuenta y datos.</li>
          </ul>
          <p>
            Escribinos a
            <a href="mailto:privacidad@deenex.tech" class="text-primary underline">privacidad@deenex.tech</a>
            y te respondemos en menos de 7 días hábiles.
          </p>

          <h2>5. Seguridad</h2>
          <p>
            Datos cifrados en tránsito (TLS 1.3) y en reposo (AES-256).
            MercadoPago procesa los pagos — nunca vemos tu tarjeta directamente.
          </p>

          <h2>6. Cambios</h2>
          <p>
            Si actualizamos esta política, te avisamos por email con 30 días de
            anticipación. Vos podés bajar la cuenta antes si no aceptás los cambios.
          </p>

          <p class="text-xs text-slate-400 italic mt-10">
            Este es un borrador placeholder. El equipo legal va a publicar el documento
            definitivo antes del go-live público.
          </p>
        </template>
      </article>
    </main>

    <footer class="border-t border-slate-100 mt-16">
      <div class="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-slate-400">
        <span>© {{ year }} Deenex</span>
        <div class="flex items-center gap-4">
          <RouterLink to="/terminos" class="hover:text-slate-700 transition-colors">Términos</RouterLink>
          <RouterLink to="/privacidad" class="hover:text-slate-700 transition-colors">Privacidad</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const kind = computed(() => (route.path === '/terminos' ? 'terms' : 'privacy'))

const year = new Date().getFullYear()
const formattedDate = computed(() =>
  new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
)

let previousTitle = ''
onMounted(() => {
  previousTitle = document.title
  document.title =
    kind.value === 'terms'
      ? 'Términos y condiciones · Deenex'
      : 'Política de privacidad · Deenex'
})
onUnmounted(() => {
  document.title = previousTitle || 'Deenex | Tu canal propio'
})
</script>

<style scoped>
.prose h2 {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.prose p,
.prose ul {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1rem;
}
.prose ul {
  padding-left: 1.25rem;
  list-style-type: disc;
}
.prose ul li {
  margin-bottom: 0.35rem;
}
.prose a {
  font-weight: 600;
}
</style>
