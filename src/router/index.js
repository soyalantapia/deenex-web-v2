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
      // Auto-onboarding self-serve flow — 5 pasos con persistencia en localStorage.
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
          // Step "ahorro" — calculadora ROI + savings hero. Antes vivía
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
          // El step sandbox/preview fue removido — el lead va directo de
          // plan → activar para reducir fricción. La demo pública sigue
          // viva en /demo para el A/B "see_demo" del hero CTA.
          path: 'activar',
          name: 'onboarding-trial',
          component: () => import('../views/onboarding/StepTrial.vue'),
          meta: { step: 'trial', requires: 'plan' },
        },
        {
          path: 'listo',
          name: 'onboarding-welcome',
          component: () => import('../views/onboarding/StepWelcome.vue'),
          meta: { step: 'welcome', requires: 'trial' },
        },
      ],
    },
    {
      // Demo público del dashboard. Conversion path para la variante "see_demo"
      // del Hero CTA — el lead ve el producto antes de poner sus datos.
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
router.beforeEach((to, _from, next) => {
  const required = to.meta?.requires

  // Magic link resume: ?resume=token preserva la intención del lead — el guard
  // lo deja pasar a la ruta target aunque no haya state aún (StepIdentity hace
  // el redirect al pendiente real una vez que hidrata).
  if (to.query.resume) return next()

  if (!required) return next()

  let completedSteps = []
  try {
    const raw = safeReadStorage('deenex_onboarding_v1')
    if (raw) completedSteps = JSON.parse(raw)?.meta?.completedSteps || []
  } catch {
    completedSteps = []
  }

  // Welcome con flag enterprise está permitido aunque "trial" no esté completo,
  // porque Enterprise saltea el step de checkout.
  if (to.name === 'onboarding-welcome' && to.query.enterprise === '1') {
    return next()
  }

  if (completedSteps.includes(required)) {
    return next()
  }

  // Redirige al primer step pendiente.
  const order = ['identity', 'business', 'plan', 'trial']
  const pending = order.find((s) => !completedSteps.includes(s)) || 'identity'
  const map = {
    identity: '/comenzar',
    business: '/comenzar/negocio',
    plan: '/comenzar/plan',
    trial: '/comenzar/activar',
  }
  return next(map[pending])
})

export default router
