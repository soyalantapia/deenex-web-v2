/**
 * Datos de contacto centralizados. Antes el número de WhatsApp y los emails
 * vivían hardcodeados en cada componente que los necesitaba (FAQSection,
 * NotFoundView, LegalView, PricingSection, WhatsAppFloatingButton, etc.); si
 * cambiaba alguno había que grepar todo el repo y todavía quedaban inconsistencias.
 *
 * Single-source-of-truth: TODO componente que muestre WhatsApp/email lee de acá.
 *   - WhatsApp: import.meta.env.VITE_WHATSAPP_NUMBER → fallback al hardcoded.
 *     Antes había DOS sources (este archivo + lectura directa del env en
 *     PricingSection / WhatsAppFloatingButton). Si divergían, los CTAs caían
 *     a números distintos. Ahora todo pasa por este módulo.
 *   - Emails: hardcoded (son aliases estables del dominio @deenex.tech).
 */

// WhatsApp CSM principal en formato internacional sin "+", para usar con wa.me.
// El env var permite rotar sin redeploy; el hardcoded es fallback en dev local
// y builds de GH Pages sin .env config.
export const CSM_WHATSAPP_NUMBER =
  import.meta.env?.VITE_WHATSAPP_NUMBER || '5491130049162'

// Helper: construye la URL de wa.me con un mensaje pre-rellenado opcional.
export function whatsappLink(message = '') {
  const base = `https://wa.me/${CSM_WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

// Emails del equipo (aliases @deenex.tech que existen hoy).
export const CONTACT_EMAIL = 'hola@deenex.tech'
export const LEGAL_EMAIL = 'legal@deenex.tech'
export const PRIVACY_EMAIL = 'privacidad@deenex.tech'
// Email de ventas, usado por PricingPlans2026Section como fallback al
// calendar URL. Mantener sincronizado con el alias real del dominio.
export const SALES_EMAIL = 'ventas@deenex.tech'
