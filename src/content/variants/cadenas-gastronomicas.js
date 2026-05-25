/**
 * Contenido aislado para la variante B (/cadenas-gastronomicas).
 *
 * Este archivo es la única fuente de copy y precios para la variante usada en
 * el A/B test contra la home (/). Editá acá para modificar comunicación o
 * precios SIN tocar la home.
 *
 * Estructura: una entrada por sección de la landing, alineada con los props
 * `content` que aceptan los componentes de sección.
 */

import {
  Layers,
  ShoppingBag,
  Users,
  ShieldCheck,
  Truck,
  CircleDollarSign,
  BarChart3,
  Sparkles,
  Send,
  Bell,
  MessageSquare,
  Heart,
  Repeat,
  Store,
  Bike,
} from 'lucide-vue-next'

export const variantId = 'cadenas-gastronomicas'

export const seo = {
  title: 'Deenex para Cadenas Gastronómicas | Tu canal propio',
  description:
    'Plataforma omnicanal pensada para cadenas gastronómicas: app PWA con tu marca, fidelización, marketing por WhatsApp y delivery propio sin comisiones.',
  // No indexar la variante para no canibalizar la home en buscadores.
  robots: 'noindex, nofollow',
  canonical: 'https://deenex.com/',
}

export const hero = {
  eyebrow: 'Ventas · Fidelización · Marketing',
  headlinePre: 'Lanzá tu canal propio',
  headlineMid: 'sin',
  rotatingWords: ['intermediarios', 'complicaciones', 'interferencias'],
  subtitle: {
    prefix:
      'Tus clientes se registran en tu propia app y vos los reactivás con campañas por ',
    highlight: 'WhatsApp y Push Notifications',
    suffix: '.',
  },
  ctaPrimary: { label: 'Comenzar Ahora', href: '#agendar', event: 'click_comenzar_ahora' },
  ctaSecondary: { label: 'Ver cómo funciona', href: '#infraestructura' },
  socialProof: {
    badges: [
      { tag: 'MB', color: 'bg-rose-100 text-rose-600' },
      { tag: 'LS', color: 'bg-violet-100 text-violet-600' },
      { tag: 'AR', color: 'bg-sky-100 text-sky-600' },
      { tag: 'PG', color: 'bg-emerald-100 text-emerald-600' },
    ],
    text: '+500 sucursales',
    textSuffix: 'ya operan con Deenex',
  },
}

export const stats = [
  { prefix: '+', value: 500, suffix: '', label: 'Sucursales activas', sub: 'En toda la red Deenex' },
  { prefix: '+', value: 25, suffix: '%', label: 'Ticket promedio', sub: 'Mayor rentabilidad por pedido' },
  { prefix: '', value: 2, suffix: 'X', label: 'Más fidelización', sub: 'Vs. apps de terceros' },
  { prefix: '+', value: 40, suffix: '%', label: 'Clientes recuperados', sub: 'De Rappi y PedidosYa' },
]

export const infra = {
  headlineLine1: 'Un solo sistema para vender',
  headlineLine2: 'en todos tus locales y canales.',
  sidequote: '"Tus clientes piden desde tu propia app. Vos operás todo desde un solo panel."',
  features: [
    {
      title: 'App Web & Stores',
      desc: 'Publicamos tu propia web y apps oficiales en App Store y Play Store bajo tu marca. Con total soberanía sobre tus clientes.',
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
  ],
}

export const logistics = {
  headlineLine1: 'Tu delivery,',
  headlineLine2: 'sin intermediarios.',
  features: [
    {
      title: 'Marca Blanca',
      desc: 'Experiencia 100% bajo tu marca. Tus clientes acceden a tu club de beneficios desde su casa.',
      icon: ShieldCheck,
    },
    {
      title: 'Red Logística',
      desc: 'Partners líderes que orquestan el despacho basado en costo y eficiencia.',
      icon: Truck,
    },
    {
      title: 'Sin Intermediarios',
      desc: 'Sin intermediarios ni costos ocultos. Todo el margen queda en tu negocio.',
      icon: CircleDollarSign,
    },
    {
      title: 'Control Total',
      desc: 'Los datos son 100% tuyos. Reimpactá a tus clientes sin intermediarios.',
      icon: BarChart3,
    },
  ],
}

export const loyalty = {
  headlineLine1: 'Tu propia máquina de',
  headlineLine2: 'recurrencia y lealtad.',
  leftFeatures: [
    {
      label: 'Ecosistema',
      title: 'Puntos y Cupones',
      desc: 'Sistema de beneficios 100% parametrizable por productos y por usuarios. Sistema tipo Starbucks.',
    },
    {
      label: 'Soberanía',
      title: 'CRM y DATOS',
      desc: 'Accedé a perfiles únicos de cada cliente: valor de vida, historial de pedidos, actividad y categorías segmentadas de forma automática.',
    },
    {
      label: 'Red Unificada',
      title: 'CLEARING UNIFICADO',
      desc: 'Sistema de liquidación de saldos entre locales por beneficios dados en un Punto de Venta y usados en otro.',
    },
  ],
  rightMetrics: [
    { label: 'Impacto en ROI', title: 'Frecuencia Real', value: '4.2x', sub: 'MÁS RECOMPRA DETECTADA' },
    { label: 'Growth', title: 'Crecimiento Red', value: '+300k', sub: 'REGISTROS GENERADOS' },
    { label: 'Retention', title: 'Retención Real', value: '+28%', sub: 'DE BASE' },
  ],
}

export const marketing = {
  headlineLine1: 'Tus campañas segmentadas',
  headlineLine2: 'en un solo lugar.',
  sidequote:
    '"Tus clientes reciben mensajes personalizados mientras vos operás todo desde un solo panel."',
  features: [
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
  ],
}

export const successCase = {
  headlineLine1: 'El impacto real',
  headlineLine2: 'de una gran entrega.',
  sidequote: '"Cuando los números hablan solos, no hace falta convencer a nadie."',
  testimonials: [
    {
      quote:
        '"Deenex superó nuestras expectativas. Estamos recuperando clientes que compraban por apps de terceros y volviendo a fidelizarlos en nuestro propio ámbito."',
      author: 'Marcos Aldazábal, Socio y Fundador',
      brand: 'Palta',
    },
  ],
  features: [
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
  ],
  metrics: [
    { value: '2X', label: 'Fidelización' },
    { value: '+40%', label: 'Clientes Recuperados' },
  ],
}

export const demoVideo = {
  headlineLine1: 'La plataforma completa,',
  headlineLine2: 'en seis minutos.',
  sidequote:
    '"Así se ve la experiencia para tu cliente y el control que tenés desde el dashboard."',
  vimeoId: '1183253994',
  ctaPrimary: { label: 'Agendar una demo en vivo', href: '#agendar' },
  ctaSecondary: { label: 'Ver toda la infraestructura', href: '#infraestructura' },
}

export const pricing = {
  headlineLine1: 'Pagás por lo que usás.',
  headlineLine2: 'Sin intermediarios ni costos ocultos.',
  calcCta: 'Calcular mi cotización',
  plans: [
    {
      key: 'presencial',
      title: 'Mesa/Para llevar',
      tag: 'Canal Presencial',
      price: 25,
      priceUnit: '/ local · mes',
      icon: Store,
      desc: 'Digitalizá tu salón con QR dinámico o gestioná los pedidos de retiro en tienda. Cada módulo se activa por separado.',
      features: [
        'Menú digital interactivo QR',
        'Cobro integrado en mesa y Para llevar',
        'Panel de comandas en tiempo real',
      ],
    },
    {
      key: 'pack',
      title: 'Pack Completo',
      tag: 'Pack completo',
      price: 40,
      priceUnit: '/ local · mes',
      priceCompare: 50,
      compareNote: 'vs USD 50 comprando los 3 módulos por separado',
      icon: Layers,
      desc: 'Mesa, Para llevar y Delivery Propio integrados en un único sistema. Gestión unificada de todos tus canales de venta.',
      features: [
        'Los 3 canales integrados',
        'Gestión unificada de ventas',
        'Soporte comercial prioritario',
      ],
      recommended: true,
      offerBadge: '20% OFF',
      cta: 'Calcular mi cotización',
    },
    {
      key: 'delivery',
      title: 'Delivery Propio',
      tag: 'Módulo Delivery',
      price: 25,
      priceUnit: '/ local · mes',
      icon: Bike,
      desc: 'Tu propio canal de delivery sin comisiones de terceros. Pagos online y gestión completa de tu flota.',
      features: [
        'Comisiones Cero',
        'Pasarela de pago integrada',
        'Zonas y repartidores propios',
      ],
    },
  ],
  loyalty: {
    title: 'Fidelización Dinámica',
    desc:
      'Potenciá la recurrencia de tus clientes habituales con el motor de lealtad más potente. Diseñado para marcas que buscan crear una comunidad real y aumentar el ticket promedio.',
    bullets: [
      'Sistema de Puntos (Tipo Starbucks)',
      'Categorías VIP (Bronce, Plata, Oro)',
      'Cupones de Descuento Especiales',
      'Wallet Personalizada para Clientes',
    ],
    badge: 'ACCESO TOTAL',
    price: 15,
    priceUnit: '/ local · mes',
    note: 'Se integra automáticamente con todos tus canales de venta.',
  },
  marketingSuite: {
    title: 'SUITE DE MARKETING',
    subtitle: 'Campañas con IA. ¡Activá tu base de datos con campañas de manera super fácil!',
    badge: 'Complemento',
    tiers: [
      {
        eyebrow: '1. Pago por uso',
        title: 'Packs de créditos',
        desc:
          'Pagás por Packs de créditos. Sin compromiso mensual. Ideal para campañas ocasionales.',
        note: 'Precio de lista por crédito',
      },
      {
        eyebrow: '2. USD 45 INICIAL',
        price: 45,
        priceUnit: '/ mes',
        badgeFeature: 'INCLUYE 1000 CREDITOS',
        discount: '-20% OFF x crédito',
        desc:
          'Ideal para primeras campañas de activación. Uso moderado, validación inicial del canal.',
        popular: true,
      },
      {
        eyebrow: '3. USD 200 AVANZADO',
        price: 200,
        priceUnit: '/ mes',
        badgeFeature: 'INCLUYE 5000 CREDITOS',
        discount: '-30% OFF x crédito',
        discountTag: 'MEJOR VALOR',
        desc:
          'Ideal para marcas con más volumen, campañas frecuentes, reactivación y recurrencia.',
        bestValue: true,
      },
    ],
    cta: 'ACTIVAR MARKETING AHORA',
    whatsappTemplate:
      'Hola! Me gustaría activar el módulo de "Marketing Suite" en mi plan de Deenex. ¿Podrían asesorarme?',
  },
  calculator: {
    presencialPrice: 25,
    deliveryPrice: 25,
    packPrice: 40,
    packComparePrice: 50,
    loyaltyPrice: 15,
    tiers: [
      { min: 200, pct: 0.35, nivel: 'Custom', contactSales: true },
      { min: 150, pct: 0.3, nivel: 'Corporativo' },
      { min: 100, pct: 0.25, nivel: 'Premium' },
      { min: 70, pct: 0.2, nivel: 'Escala' },
      { min: 25, pct: 0.1, nivel: 'Crecimiento' },
    ],
  },
}

export const faq = {
  eyebrow: 'Preguntas Frecuentes',
  headlineLine1: 'Todo lo que necesitás',
  headlineLine2: 'saber antes de arrancar.',
  sidequote: '"Si tenés dudas, es normal. Las respondemos todas."',
  items: [
    {
      q: '¿Cuánto tarda la implementación?',
      a: 'El onboarding inicial toma entre 3 y 7 días hábiles. Nuestro equipo te acompaña en cada paso: configuración de la app, carga del menú, integración de pagos y capacitación del equipo operativo.',
    },
    {
      q: '¿Necesito cambiar mi POS o sistema actual?',
      a: 'No. Deenex se integra con los principales sistemas POS del mercado como Maxirest y Odoo. Si usás otro sistema, nuestro equipo lo evalúa sin costo antes de la contratación.',
    },
    {
      q: '¿Qué pasa si quiero cancelar?',
      a: 'No hay contratos de largo plazo ni penalidades. Podés dar de baja tu plan cuando quieras con 30 días de aviso. Tus datos son 100% tuyos y te los entregamos exportados.',
    },
    {
      q: '¿Funciona con Mercado Pago?',
      a: 'Sí. Tenemos integración nativa con Mercado Pago para cobros online. También soportamos otros medios de pago según la región de operación.',
    },
    {
      q: '¿Puedo usar Deenex si ya tengo delivery en Rappi o PedidosYa?',
      a: 'Completamente. Muchos de nuestros clientes operan en paralelo. Deenex no reemplaza esos canales de inmediato — los complementa mientras construís tu propia base de clientes registrados. Con el tiempo, la mayoría migra la mayor parte de sus pedidos al canal propio.',
    },
    {
      q: '¿Qué soporte incluye el plan?',
      a: 'Todos los planes incluyen soporte por WhatsApp en horario extendido, acceso a la base de conocimiento y acompañamiento en el onboarding. Los planes con mayor volumen de locales tienen un Customer Success Manager asignado.',
    },
  ],
  ctaText: '¿Tenés una pregunta que no está acá?',
  ctaLabel: 'Escribinos por WhatsApp',
  whatsappTemplate: 'Hola! Tengo una consulta sobre Deenex.',
}

export const calendar = {
  headlineLine1: 'Elegí el día y hora',
  headlineLine2: 'que mejor te quede.',
  subtitle: 'Reunión de 30 minutos con el equipo de Deenex. Sin compromiso de contratación.',
}

/**
 * Nuevo modelo de pricing 2026 — alineado al PDF "Deenex — Pricing OFICIAL".
 *
 * 3 capas:
 *  1. Planes mensuales (Comercio + Partners + Bundle): fee fijo + comisión que baja con volumen.
 *  2. Deenex Comercio (tarifa simple): 1,5% flat sobre 4 canales.
 *  3. Deenex Activa (performance): cobramos solo sobre la venta atribuida.
 */
/*
 * Pricing 2026 — Bundle único escalonado por volumen de pedidos.
 *
 * Razonamiento del modelo (acordado con founders):
 *  - Siempre fee mensual + comisión por venta. Eliminamos la opción "sin pago
 *    mensual" porque generaba confusión: el modelo de negocio NO contempla
 *    cobrar solo comisión sin fee.
 *  - Entry-point: USD 69/mes con hasta 300 pedidos/mes. Cualquier marca nueva
 *    arranca acá independiente de su tamaño actual.
 *  - A medida que el volumen crece (300 → 1.000 → 3.000 → 7.500 → 25.000+),
 *    el plan escala automáticamente al siguiente tier. El fee sube pero la
 *    comisión baja, porque a mayor volumen el costo por orden es menor.
 *  - Tagline central: "Empezamos juntos, crecemos juntos."
 */
export const pricingModel = {
  sectionId: 'pricing-2026',
  kicker: 'Pricing 2026 · Bundle único',
  title: 'Empezás simple.',
  titleAccent: 'Crecemos con vos.',
  subtitle:
    'Un solo plan: fee mensual + comisión por venta. El precio se ajusta automáticamente cuando crece tu volumen — no pagás por capacidad que no usás.',

  // ── Hero del Bundle inicial ────────────────────────────────────
  starterEyebrow: 'Punto de entrada',
  starterTitle: 'Deenex Full Suite.',
  starterTitleAccent: 'Todo incluido desde el día uno.',
  starterDescription:
    'Canal propio (web + app), Loyalty con Wallet, campañas por WhatsApp y Push, multi-canal (Salón, Take Away, Delivery propio) e integración con tu POS. Sin módulos por separado, sin sorpresas.',
  starterIncludes: [
    'Ecommerce + app branded con tu marca',
    'Loyalty dinámico con niveles VIP y cupones',
    'WhatsApp + Push automatizado por evento',
    'Dashboard con KPIs en vivo y reportes',
    'Integración POS + MercadoPago listo del día 1',
    'Customer Success durante todo el trial',
  ],
  starterPrice: 69,
  starterCommission: '1,5',
  starterOrders: 300,
  starterCtaLabel: 'Empezar 15 días gratis',

  // ── Escalera de crecimiento ─────────────────────────────────────
  scaleEyebrow: 'Tu plan crece cuando vos crecés',
  scaleTitle: 'Una escalera, no un menú.',
  scaleSubtitle:
    'Pasás al siguiente tier cuando superás el volumen del actual. Sin renegociar, sin firmar nada, sin perder data. El sistema lo hace automáticamente al cierre del mes.',
  scaleHighlightLabel: 'Más común',
  scaleTiers: [
    {
      name: 'Inicio',
      tagline: 'Marca arrancando o pequeña — 1-3 locales típicos.',
      ordersLabel: 'Hasta 300',
      fee: 69,
      commissionLabel: '1,5%',
    },
    {
      name: 'Crecimiento',
      tagline: 'Operación consolidada — 3-10 locales o alto delivery.',
      ordersLabel: '301 – 1.000',
      fee: 169,
      commissionLabel: '1,25%',
      highlight: true,
    },
    {
      name: 'Escala',
      tagline: 'Cadena con operación 24/7 — 10-30 locales activos.',
      ordersLabel: '1.001 – 3.000',
      fee: 349,
      commissionLabel: '1,0%',
    },
    {
      name: 'Performance',
      tagline: 'Cadena establecida — 30-100 locales con tráfico alto.',
      ordersLabel: '3.001 – 7.500',
      fee: 599,
      commissionLabel: '0,85%',
    },
    {
      name: 'Pro',
      tagline: 'Líder de categoría — 100+ locales o eventos masivos.',
      ordersLabel: '7.501 – 25.000',
      fee: 1199,
      commissionLabel: '0,75%',
    },
    {
      name: 'Enterprise',
      tagline: 'Operación nacional o multi-marca — 25k+ pedidos/mes.',
      ordersLabel: '25.001+',
      fee: null,
      commissionLabel: 'Desde 0,5%',
    },
  ],
  scaleFootnote:
    'Pedidos = transacciones procesadas por Deenex/mes (online + presencial). Setup USD 0 — implementación incluida. Sin permanencia: cancelás en 1 click cuando quieras.',

  // ── Cómo crecemos juntos ────────────────────────────────────────
  growthPromises: [
    {
      title: 'Tu data te sigue.',
      body:
        'Cuando subís de tier, mantenés todo: clientes, campañas, configuración, integraciones. Solo cambia el fee del próximo cargo.',
    },
    {
      title: 'No pagás por capacidad que no usás.',
      body:
        'Si tenés un mes flojo y bajás de 1.000 pedidos, volvés al tier anterior automáticamente. El sistema reajusta sin que tengas que pedirlo.',
    },
    {
      title: 'Más volumen = menos comisión.',
      body:
        'A medida que crecés, tu comisión por venta baja (de 1,5% en Inicio hasta 0,5% en Enterprise). Tu margen mejora con cada tier.',
    },
  ],

  // ── Footer CTA ─────────────────────────────────────────────────
  ctaTitle: 'Probalo 15 días, sin cargo.',
  ctaSubtitle:
    'Activás con MercadoPago, no te cobramos nada hasta el día 16 y podés cancelar en 1 click. Sin permanencia, sin setup fee, sin letra chica.',
  ctaPrimaryLabel: 'Empezar mi trial',
  ctaSecondaryLabel: 'Hablar con ventas',
  ctaSecondaryHref: '#agendar',
  ctaGuarantees: [
    'Setup en menos de 30 minutos guiado por CSM real',
    'MercadoPago oficial — partner certificado',
    'Cobro recién al día 16 — si cancelás antes, USD 0',
    'Migración asistida desde apps de terceros',
  ],
}

export default {
  variantId,
  seo,
  hero,
  stats,
  infra,
  logistics,
  loyalty,
  marketing,
  successCase,
  demoVideo,
  pricing,
  pricingModel,
  faq,
  calendar,
}
