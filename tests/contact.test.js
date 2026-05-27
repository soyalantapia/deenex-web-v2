/**
 * Tests para src/utils/contact.js — single source of truth de contacto.
 *
 * Cubrimos:
 *   - whatsappLink() arma URL válida wa.me con número del módulo.
 *   - whatsappLink() encoda mensajes con espacios + caracteres especiales.
 *   - whatsappLink() sin mensaje devuelve la URL base.
 *   - Constantes de email no están vacías ni mal formateadas.
 */
import { describe, it, expect } from 'vitest'
import {
  CSM_WHATSAPP_NUMBER,
  CONTACT_EMAIL,
  LEGAL_EMAIL,
  PRIVACY_EMAIL,
  SALES_EMAIL,
  whatsappLink,
} from '@/utils/contact'

describe('contact.js', () => {
  describe('CSM_WHATSAPP_NUMBER', () => {
    it('debe ser un string sin "+" y solo dígitos (formato internacional para wa.me)', () => {
      expect(typeof CSM_WHATSAPP_NUMBER).toBe('string')
      expect(CSM_WHATSAPP_NUMBER).toMatch(/^\d+$/)
      expect(CSM_WHATSAPP_NUMBER.length).toBeGreaterThanOrEqual(11) // mínimo país+area+numero
    })
  })

  describe('whatsappLink()', () => {
    it('sin mensaje devuelve la URL base wa.me/<numero>', () => {
      const url = whatsappLink()
      expect(url).toBe(`https://wa.me/${CSM_WHATSAPP_NUMBER}`)
    })

    it('con mensaje plain devuelve URL con ?text= encodeado', () => {
      const url = whatsappLink('Hola Deenex')
      expect(url).toBe(`https://wa.me/${CSM_WHATSAPP_NUMBER}?text=Hola%20Deenex`)
    })

    it('encoda caracteres especiales (ñ, acentos, !, &) correctamente', () => {
      const url = whatsappLink('¿Sirve para mañana? Sí & gracias!')
      // No esperamos un valor exacto del encoding, solo que pase por encodeURIComponent
      // y que NO contenga los caracteres crudos que romperían la URL.
      expect(url).toContain('?text=')
      expect(url).not.toContain('¿') // crudo
      expect(url).not.toContain(' ') // espacios crudos
      expect(url).not.toContain('&') // ampersand crudo (rompería la query)
    })

    it('mensaje vacío string también devuelve base (no agrega ?text=)', () => {
      expect(whatsappLink('')).toBe(`https://wa.me/${CSM_WHATSAPP_NUMBER}`)
    })
  })

  describe('emails', () => {
    it.each([
      ['CONTACT_EMAIL', CONTACT_EMAIL],
      ['LEGAL_EMAIL', LEGAL_EMAIL],
      ['PRIVACY_EMAIL', PRIVACY_EMAIL],
      ['SALES_EMAIL', SALES_EMAIL],
    ])('%s debe ser un email @deenex.tech válido', (name, email) => {
      expect(email, `${name} vacío`).toBeTruthy()
      expect(email).toMatch(/^[^\s@]+@deenex\.tech$/)
    })

    it('los aliases son únicos (sin duplicados accidentales)', () => {
      const all = [CONTACT_EMAIL, LEGAL_EMAIL, PRIVACY_EMAIL, SALES_EMAIL]
      const unique = new Set(all)
      expect(unique.size).toBe(all.length)
    })
  })
})
