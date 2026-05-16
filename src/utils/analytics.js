/**
 * Utility for Google Analytics 4 tracking.
 * Ensures gtag is called safely.
 */

export const GA_MEASUREMENT_ID = 'G-E7GPE100LK'

/**
 * Send a custom event to GA4
 * @param {string} eventName 
 * @param {Object} params 
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  } else {
    console.warn(`GA4: gtag is not available. Event ${eventName} was not sent.`, params)
  }
}

/**
 * Track common CTA clicks
 * @param {string} label 
 */
export const trackCTA = (label) => {
  if (label.toLowerCase().includes('comenzar')) {
    trackEvent('click_comenzar_ahora')
  } else if (label.toLowerCase().includes('agendar')) {
    trackEvent('click_agendar_demo')
  }
}
