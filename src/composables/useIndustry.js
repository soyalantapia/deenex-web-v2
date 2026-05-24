/**
 * useIndustry — detecta el rubro gastronómico del lead a partir del nombre
 * de marca, el email o canales. Devuelve un seed de pedidos demo, ticket
 * promedio sugerido y emojis/labels apropiados para el Sandbox.
 *
 * Heurística simple por keywords. En producción esto debería ser una API
 * del backend, pero para el onboarding frontend-first alcanza.
 */

import { computed } from 'vue'
import { useOnboarding } from './useOnboarding'

const INDUSTRY_RULES = [
  {
    key: 'empanadas',
    keywords: ['empanada', 'gloria', 'tucuman', 'tucumán', 'salteñ'],
    label: 'empanadas',
    avgTicketUsd: 9,
    emoji: '🥟',
    sampleOrders: [
      { customer: 'Tomás Acuña', items: ['Docena mixta', 'Coca 500ml'], channel: 'Delivery propio', total: 14 },
      { customer: 'Camila Ferreyra', items: ['6 carne', '6 jamón y queso', 'Limonada'], channel: 'Take Away', total: 12 },
      { customer: 'Joaquín Vargas', items: ['Docena gourmet', 'Vino'], channel: 'Salón · Mesa 7', total: 22 },
      { customer: 'Lucía Méndez', items: ['Empanadas x6', 'Agua tónica'], channel: 'Mostrador', total: 9 },
      { customer: 'Diego Castro', items: ['Combo familiar (24u)', 'Postre'], channel: 'Delivery propio', total: 28 },
    ],
    sampleCampaigns: [
      { title: 'Promo lunes a jueves', audience: '1.247 clientes · WhatsApp + Push', openRate: 68 },
      { title: 'Combo familiar fin de semana', audience: '3.847 clientes · Push notification', openRate: 41 },
      { title: 'Cumpleaños del mes', audience: '124 clientes · Email', openRate: 0, status: 'draft' },
    ],
  },
  {
    key: 'pizza',
    keywords: ['pizza', 'pizzer', 'fugazz', 'romano', 'guerrin'],
    label: 'pizzería',
    avgTicketUsd: 18,
    emoji: '🍕',
    sampleOrders: [
      { customer: 'Tomás Acuña', items: ['Muzzarella grande', 'Fugazzeta chica', 'Coca'], channel: 'Delivery propio', total: 24 },
      { customer: 'Camila Ferreyra', items: ['Especial casa', 'Cerveza artesanal'], channel: 'Take Away', total: 18 },
      { customer: 'Joaquín Vargas', items: ['4 estaciones', 'Vino tinto', 'Postre'], channel: 'Salón · Mesa 12', total: 34 },
      { customer: 'Lucía Méndez', items: ['Calzone jamón', 'Limonada'], channel: 'Mostrador', total: 16 },
      { customer: 'Diego Castro', items: ['Combo familiar 3 pizzas', 'Empanadas x6'], channel: 'Delivery propio', total: 42 },
    ],
    sampleCampaigns: [
      { title: 'Martes 2x1 — recuperación', audience: '1.247 clientes · WhatsApp + Push', openRate: 71 },
      { title: 'Combo fin de semana', audience: '3.847 clientes · Push notification', openRate: 44 },
      { title: 'Cumpleaños del mes', audience: '124 clientes · Email', openRate: 0, status: 'draft' },
    ],
  },
  {
    key: 'hamburguesa',
    keywords: ['burger', 'burgu', 'hamburg', 'angus', 'palta'],
    label: 'hamburguesería',
    avgTicketUsd: 16,
    emoji: '🍔',
    sampleOrders: [
      { customer: 'Tomás Acuña', items: ['Burger doble', 'Papas grandes', 'Coca'], channel: 'Delivery propio', total: 18 },
      { customer: 'Camila Ferreyra', items: ['Smash combo', 'Cerveza artesanal'], channel: 'Take Away', total: 17 },
      { customer: 'Joaquín Vargas', items: ['Veggie burger', 'Onion rings', 'Limonada'], channel: 'Salón · Mesa 7', total: 22 },
      { customer: 'Lucía Méndez', items: ['Burger clásica', 'Papas'], channel: 'Mostrador', total: 14 },
      { customer: 'Diego Castro', items: ['Combo familiar 4 burgers', 'Postre'], channel: 'Delivery propio', total: 32 },
    ],
    sampleCampaigns: [
      { title: 'Recuperación 30d sin compra', audience: '1.247 clientes · WhatsApp + Push', openRate: 68 },
      { title: 'Combo fin de semana', audience: '3.847 clientes · Push notification', openRate: 41 },
      { title: 'Cumpleaños del mes', audience: '124 clientes · Email', openRate: 0, status: 'draft' },
    ],
  },
  {
    key: 'cafe',
    keywords: ['cafe', 'café', 'coffee', 'caferia', 'hatsu'],
    label: 'cafetería',
    avgTicketUsd: 8,
    emoji: '☕',
    sampleOrders: [
      { customer: 'Tomás Acuña', items: ['Flat white', 'Tostado'], channel: 'Mostrador', total: 8 },
      { customer: 'Camila Ferreyra', items: ['Latte vainilla', 'Medialuna jamón y queso'], channel: 'Take Away', total: 7 },
      { customer: 'Joaquín Vargas', items: ['Cappuccino', 'Avocado toast', 'Smoothie'], channel: 'Salón · Mesa 4', total: 14 },
      { customer: 'Lucía Méndez', items: ['Cold brew', 'Cookie'], channel: 'Mostrador', total: 6 },
      { customer: 'Diego Castro', items: ['Combo desayuno x2'], channel: 'Delivery propio', total: 12 },
    ],
    sampleCampaigns: [
      { title: 'Café para retomar la rutina', audience: '1.247 clientes · WhatsApp + Push', openRate: 68 },
      { title: 'Combo desayuno fin de semana', audience: '3.847 clientes · Push notification', openRate: 41 },
      { title: 'Cumpleaños del mes', audience: '124 clientes · Email', openRate: 0, status: 'draft' },
    ],
  },
  {
    key: 'sushi',
    keywords: ['sushi', 'nikkei', 'wok', 'asian', 'monti'],
    label: 'sushi',
    avgTicketUsd: 24,
    emoji: '🍣',
    sampleOrders: [
      { customer: 'Tomás Acuña', items: ['Combinado 30 piezas', 'Cerveza'], channel: 'Delivery propio', total: 32 },
      { customer: 'Camila Ferreyra', items: ['Rolls premium 15p', 'Sake'], channel: 'Take Away', total: 28 },
      { customer: 'Joaquín Vargas', items: ['Tabla degustación', 'Vino blanco'], channel: 'Salón · Mesa 9', total: 48 },
      { customer: 'Lucía Méndez', items: ['Rolls clásicos 10p', 'Té helado'], channel: 'Mostrador', total: 18 },
      { customer: 'Diego Castro', items: ['Combo familiar 60p', 'Postre'], channel: 'Delivery propio', total: 56 },
    ],
    sampleCampaigns: [
      { title: 'Sushi night fin de semana', audience: '1.247 clientes · WhatsApp + Push', openRate: 71 },
      { title: 'Combo viernes', audience: '3.847 clientes · Push notification', openRate: 44 },
      { title: 'Cumpleaños del mes', audience: '124 clientes · Email', openRate: 0, status: 'draft' },
    ],
  },
]

// Industria genérica de fallback — para marcas sin keyword match.
const GENERIC_INDUSTRY = {
  key: 'generic',
  label: 'gastronómico',
  avgTicketUsd: 14,
  emoji: '🍽️',
  sampleOrders: [
    { customer: 'Tomás Acuña', items: ['Pedido grande'], channel: 'Delivery propio', total: 18 },
    { customer: 'Camila Ferreyra', items: ['Combo medio'], channel: 'Take Away', total: 12 },
    { customer: 'Joaquín Vargas', items: ['Pedido en mesa'], channel: 'Salón · Mesa 7', total: 22 },
    { customer: 'Lucía Méndez', items: ['Pedido rápido'], channel: 'Mostrador', total: 14 },
    { customer: 'Diego Castro', items: ['Combo familiar'], channel: 'Delivery propio', total: 28 },
  ],
  sampleCampaigns: [
    { title: 'Recuperación 30d sin compra', audience: '1.247 clientes · WhatsApp + Push', openRate: 68 },
    { title: 'Combo fin de semana', audience: '3.847 clientes · Push notification', openRate: 41 },
    { title: 'Cumpleaños del mes', audience: '124 clientes · Email', openRate: 0, status: 'draft' },
  ],
}

function detect(brand, email) {
  const haystack = `${brand || ''} ${email || ''}`.toLowerCase()
  return (
    INDUSTRY_RULES.find((rule) =>
      rule.keywords.some((kw) => haystack.includes(kw))
    ) || GENERIC_INDUSTRY
  )
}

export function useIndustry() {
  const onboarding = useOnboarding()

  const industry = computed(() =>
    detect(onboarding.state.business.brand, onboarding.state.identity.email)
  )

  const brandDisplay = computed(() => {
    return onboarding.state.business.brand || 'Tu marca'
  })

  const subdomainDisplay = computed(() => {
    return onboarding.subdomainPreview.value
  })

  return {
    industry,
    brandDisplay,
    subdomainDisplay,
  }
}
