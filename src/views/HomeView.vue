<template>
  <div>
    <Navbar />
    <HeroSection />
    <Clients />
    <Partners class="v-reveal" />
    <InfraSection class="v-reveal" />
    <LogisticsSection class="v-reveal" />
    <LoyaltySection class="v-reveal" />
    <MarketingSection class="v-reveal" />
    <PricingSection class="v-reveal" />
    <CalendarSection class="v-reveal" />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import Clients from '@/components/sections/Clients.vue'
import Partners from '@/components/sections/Partners.vue'
import InfraSection from '@/components/sections/InfraSection.vue'
import LogisticsSection from '@/components/sections/LogisticsSection.vue'
import MarketingSection from '@/components/sections/MarketingSection.vue'
import LoyaltySection from '@/components/sections/LoyaltySection.vue'
import PricingSection from '@/components/sections/PricingSection.vue'
import CalendarSection from '@/components/sections/CalendarSection.vue'
import { onMounted } from 'vue'

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('v-reveal-visible')
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.v-reveal').forEach(el => observer.observe(el))
})
</script>

