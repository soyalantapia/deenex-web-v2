<template>
  <div :data-variant="variant.variantId">
    <Navbar />
    <HeroSection :content="variant.hero" />
    <StatsSection :content="variant.stats" class="v-reveal" />
    <Clients />
    <InfraSection :content="variant.infra" class="v-reveal" />
    <LogisticsSection :content="variant.logistics" class="v-reveal" />
    <LoyaltySection :content="variant.loyalty" class="v-reveal" />
    <MarketingSection :content="variant.marketing" class="v-reveal" />
    <SuccessCaseSection :content="variant.successCase" class="v-reveal" />
    <DemoVideoSection :content="variant.demoVideo" class="v-reveal" />
    <PricingModelSection :content="variant.pricingModel" class="v-reveal" />
    <FAQSection :content="variant.faq" class="v-reveal" />
    <CalendarSection :content="variant.calendar" class="v-reveal" />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import DemoVideoSection from '@/components/sections/DemoVideoSection.vue'
import Clients from '@/components/sections/Clients.vue'
import InfraSection from '@/components/sections/InfraSection.vue'
import LogisticsSection from '@/components/sections/LogisticsSection.vue'
import MarketingSection from '@/components/sections/MarketingSection.vue'
import LoyaltySection from '@/components/sections/LoyaltySection.vue'
import CalendarSection from '@/components/sections/CalendarSection.vue'
import SuccessCaseSection from '@/components/sections/SuccessCaseSection.vue'
import FAQSection from '@/components/sections/FAQSection.vue'
import PricingModelSection from '@/components/sections/PricingModelSection.vue'
import { useScrollTracking } from '@/composables/useScrollTracking'
import { trackEvent } from '@/utils/analytics'
import variant from '@/content/variants/cadenas-gastronomicas.js'

useScrollTracking()

// Manejo de <head> propio de la variante. Restauramos los valores
// originales (home) en onUnmounted para no contaminar otras rutas.
let headCleanup = null

function setMeta(name, content, attr = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  const created = !el
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  const previous = el.getAttribute('content')
  el.setAttribute('content', content)
  return () => {
    if (created) {
      el.remove()
    } else if (previous != null) {
      el.setAttribute('content', previous)
    }
  }
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  const created = !el
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  const previous = el.getAttribute('href')
  el.setAttribute('href', href)
  return () => {
    if (created) {
      el.remove()
    } else if (previous != null) {
      el.setAttribute('href', previous)
    }
  }
}

onMounted(() => {
  const previousTitle = document.title
  document.title = variant.seo.title

  const cleanups = [
    setMeta('description', variant.seo.description),
    setMeta('robots', variant.seo.robots),
    setLink('canonical', variant.seo.canonical),
  ]

  headCleanup = () => {
    document.title = previousTitle
    cleanups.forEach((fn) => fn && fn())
  }

  // Tracking del pageview de la variante B contra GA4.
  trackEvent('view_variant_landing', {
    variant: variant.variantId,
    landing_path: '/cadenas-gastronomicas',
  })

  // IntersectionObserver para los .v-reveal — replica el patrón de HomeView.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('v-reveal-visible')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  document.querySelectorAll('.v-reveal').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  if (headCleanup) headCleanup()
})
</script>
