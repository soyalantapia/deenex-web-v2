/**
 * Datos de contacto centralizados. Antes el número de WhatsApp y los emails
 * vivían hardcodeados en cada componente que los necesitaba (FAQSection,
 * NotFoundView, LegalView, etc.); si cambiaba alguno había que grepar.
 *
 * Mantener acá la única fuente de verdad para todo lo que se muestra al lead.
 */

// WhatsApp CSM principal en formato internacional sin "+", para usar con wa.me
export const CSM_WHATSAPP_NUMBER = '5491130049162'

// Helper: construye la URL de wa.me con un mensaje pre-rellenado opcional.
export function whatsappLink(message = '') {
  const base = `https://wa.me/${CSM_WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

// Emails del equipo
export const CONTACT_EMAIL = 'hola@deenex.tech'
export const LEGAL_EMAIL = 'legal@deenex.tech'
export const PRIVACY_EMAIL = 'privacidad@deenex.tech'
