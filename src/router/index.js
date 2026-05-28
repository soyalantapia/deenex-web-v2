import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'), // Lazy loading
    },
    {
      // Variante A/B "Cadenas Gastronómicas", landing dedicada con copy
      // y pricing focalizados en chains (vs la home genérica). Recuperado
      // del branch original feat/landing-cadenas-gastronomicas-abtest.
      path: '/cadenas-gastronomicas',
      name: 'cadenas-gastronomicas',
      component: () => import('../views/CadenasGastronomicasView.vue'),
    },
    {
      // Auto-onboarding self-serve flow, 5 pasos con persistencia en localStorage.
      // El layout vive en views/onboarding/OnboardingLayout.vue y los steps son
      // children que rotan dentro de un <RouterView> con transition.
      path: '/comenzar',
      component: () => import('../views/onboarding/OnboardingLayout.vue'),
      meta: { layout: 'onboarding', requiresOnboarding: true },
      children: [
        {
          path: '',
          name: 'onboarding-identity',
          component: () => import('../views/onboarding/StepIdentity.vue'),
          meta: { step: 'identity' },
        },
        {
          path: 'negocio',
          name: 'onboarding-business',
          component: () => import('../views/onboarding/StepBusiness.vue'),
          meta: { step: 'business', requires: 'identity' },
        },
        {
          // Step "ahorro", calculadora ROI + savings hero. Antes vivía
          // dentro de StepPlan; separamos para que el lead procese una idea
          // a la vez (entender el ahorro vs elegir el plan).
          path: 'ahorro',
          name: 'onboarding-savings',
          component: () => import('../views/onboarding/StepSavings.vue'),
          meta: { step: 'savings', requires: 'business' },
        },
        {
          path: 'plan',
          name: 'onboarding-plan',
          component: () => import('../views/onboarding/StepPlan.vue'),
          meta: { step: 'plan', requires: 'business' },
        },
        {
          // Wow-moment-first: /activar (StepTrial con pedido de tarjeta) salió
          // del flow. El lead va directo de Plan a /listo, donde corre el
          // ActivationOverlay simulado SIN tarjeta. El paywall vive en el
          // dashboard, después que el lead cargue su menú y vea valor real.
          //
          // Mantenemos el path para redirigir resume tokens viejos que tengan
          // /activar guardado (links de magic-email, QR cross-device antiguos).
          path: 'activar',
          redirect: { name: 'onboarding-welcome' },
        },
        {
          path: 'listo',
          name: 'onboarding-welcome',
          component: () => import('../views/onboarding/StepWelcome.vue'),
          // requires: 'plan' (era 'trial'). Ya no necesitamos que el lead haya
          // pasado por el step de tarjeta para ver el welcome — el welcome ES
          // la activación ahora.
          meta: { step: 'welcome', requires: 'plan' },
        },
      ],
    },
    {
      // Demo público del dashboard. Conversion path para la variante "see_demo"
      // del Hero CTA, el lead ve el producto antes de poner sus datos.
      path: '/demo',
      name: 'public-demo',
      component: () => import('../views/PublicDemoView.vue'),
    },
    {
      path: '/terminos',
      name: 'terminos',
      component: () => import('../views/LegalView.vue'),
    },
    {
      path: '/privacidad',
      name: 'privacidad',
      component: () => import('../views/LegalView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    // En el flow de onboarding, siempre arriba al cambiar de step.
    return { top: 0, behavior: 'instant' }
  },
})

// Storage helper SSR-safe + tolerante a Safari privado, iOS WebView in-app
// browser (donde a veces localStorage tira SecurityError) y quota llena.
// Estrategia: probamos localStorage primero, fallback a sessionStorage, y
// si ambos fallan caemos a un Map en memoria (lifetime: la pestaña).
const memStorage = new Map()
function safeReadStorage(key) {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage?.getItem(key)
    if (v != null) return v
  } catch { /* private mode / blocked */ }
  try {
    const v = window.sessionStorage?.getItem(key)
    if (v != null) return v
  } catch { /* sandbox */ }
  return memStorage.get(key) ?? null
}

// Step gating: si querés saltar a un step sin haber completado el anterior,
// te redirigimos al primer step pendiente. Excepción: Enterprise puede llegar
// directo a /comenzar/listo desde plan con ?enterprise=1.
// Guards en Vue Router 4, return value en lugar de next(value). Antes
// usábamos `next(map[pending])` que estaba deprecated y rompía la navegación
// en algunos casos (síntoma: pantalla blanca al pasar de /ahorro → /plan en
// SPA mode, ok al recargar).
router.beforeEach((to) => {
  const required = to.meta?.requires

  // Magic link resume: ?resume=token preserva la intención del lead.
  if (to.query.resume) return true

  if (!required) return true

  let completedSteps = []
  try {
    const raw = safeReadStorage('deenex_onboarding_v1')
    if (raw) completedSteps = JSON.parse(raw)?.meta?.completedSteps || []
  } catch {
    completedSteps = []
  }

  // Welcome con flag enterprise está permitido aunque "plan" no esté completo
  // (Enterprise puede llegar directo desde el formulario corto pidiendo demo).
  if (to.name === 'onboarding-welcome' && to.query.enterprise === '1') {
    return true
  }

  if (completedSteps.includes(required)) {
    return true
  }

  // Wow-moment-first: 'trial' salió del orden — la activación es automática
  // en /listo ahora, sin tarjeta. El último step gateable es 'plan'.
  const order = ['identity', 'business', 'plan']
  const pending = order.find((s) => !completedSteps.includes(s)) || 'identity'
  const map = {
    identity: '/comenzar',
    business: '/comenzar/negocio',
    plan: '/comenzar/plan',
  }
  return map[pending]
})

export default router
