/**
 * useExperiment, lightweight A/B/n testing sin dependencias externas.
 *
 * Asigna una variante de forma persistente (localStorage) y emite el evento
 * GA4 `experiment_view` la primera vez. Convertir es responsabilidad del
 * caller (ej. trackeando `experiment_conversion` cuando el lead llega al
 * paso clave).
 *
 * Uso:
 *   const ctaCopy = useExperiment('hero_cta_v1', [
 *     { id: 'control', weight: 1, payload: { label: 'Empezar 14 días gratis' } },
 *     { id: 'no_card', weight: 1, payload: { label: 'Probar sin tarjeta' } },
 *     { id: 'see_demo', weight: 1, payload: { label: 'Ver demo del dashboard' } },
 *   ])
 *
 *   // ctaCopy.value.label → la variante asignada para este lead
 */

import { ref } from 'vue'
import { trackEvent } from '@/utils/analytics'

const STORAGE_KEY = 'deenex_experiments_v1'

function loadAssignments() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function persistAssignments(map) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // quota / private mode, silent skip
  }
}

function pickWeighted(variants) {
  const total = variants.reduce((acc, v) => acc + (v.weight || 1), 0)
  let n = Math.random() * total
  for (const v of variants) {
    n -= v.weight || 1
    if (n <= 0) return v
  }
  return variants[0]
}

export function useExperiment(experimentId, variants) {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error(`useExperiment(${experimentId}) requires at least one variant`)
  }

  const assignments = loadAssignments()
  let assignedId = assignments[experimentId]
  let variant = variants.find((v) => v.id === assignedId)

  if (!variant) {
    variant = pickWeighted(variants)
    assignedId = variant.id
    assignments[experimentId] = assignedId
    persistAssignments(assignments)
    trackEvent('experiment_view', {
      experiment_id: experimentId,
      variant_id: assignedId,
    })
  }

  // Helper para trackear conversiones del experimento.
  function trackConversion(detail = {}) {
    trackEvent('experiment_conversion', {
      experiment_id: experimentId,
      variant_id: assignedId,
      ...detail,
    })
  }

  return {
    variant: ref(variant),
    variantId: assignedId,
    trackConversion,
  }
}
