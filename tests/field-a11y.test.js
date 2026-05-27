/**
 * Tests para R4-02 (Field.vue a11y).
 *
 * Validamos el contrato a11y mínimo que arreglamos:
 *   - <label> tiene `for` que matchea el `id` del input.
 *   - Input tiene `aria-invalid="true"` cuando hay error.
 *   - Input tiene `aria-describedby` que apunta al error msg si hay error.
 *   - El error <p> tiene el id correcto y role=alert + aria-live.
 *   - Si no hay error pero sí hint, aria-describedby apunta al hint.
 *   - Required → input tiene `required` + label tiene texto SR "(requerido)".
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Field from '@/components/onboarding/Field.vue'

// Mock analytics que pueda dispararse desde lejos
vi.mock('@/utils/analytics', () => ({
  trackEvent: vi.fn(),
}))

describe('Field.vue a11y (R4-02)', () => {
  it('label[for] matchea input[id]', () => {
    const wrapper = mount(Field, {
      props: { label: 'Tu email', modelValue: '' },
    })
    const label = wrapper.find('label')
    const input = wrapper.find('input')
    expect(label.attributes('for')).toBeTruthy()
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('aria-invalid = "false" cuando NO hay error', () => {
    const wrapper = mount(Field, {
      props: { label: 'Email', modelValue: 'foo@bar.com', error: '' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('false')
  })

  it('aria-invalid = "true" + aria-describedby → error id, cuando hay error', () => {
    const wrapper = mount(Field, {
      props: { label: 'Email', modelValue: 'foo', error: 'Email inválido' },
    })
    const input = wrapper.find('input')
    const errorP = wrapper.find('p[role="alert"]')

    expect(input.attributes('aria-invalid')).toBe('true')
    expect(errorP.exists()).toBe(true)
    expect(errorP.attributes('id')).toBeTruthy()
    expect(input.attributes('aria-describedby')).toBe(errorP.attributes('id'))
    expect(errorP.attributes('aria-live')).toBe('polite')
    expect(errorP.text()).toBe('Email inválido')
  })

  it('aria-describedby apunta al HINT cuando no hay error pero sí hint', () => {
    const wrapper = mount(Field, {
      props: { label: 'Email', modelValue: '', hint: 'Te mandamos el magic link.' },
    })
    const input = wrapper.find('input')
    const hintP = wrapper.find('p:not([role])')

    expect(input.attributes('aria-describedby')).toBe(hintP.attributes('id'))
    expect(hintP.text()).toContain('magic link')
  })

  it('required: input[required] + label tiene texto sr-only "(requerido)"', () => {
    const wrapper = mount(Field, {
      props: { label: 'Email', modelValue: '', required: true },
    })
    const input = wrapper.find('input')
    expect(input.attributes('required')).toBeDefined()
    // El span .sr-only con el texto " (requerido)" para SR
    expect(wrapper.html()).toContain('(requerido)')
  })

  it('cada instancia genera ID único (2 Fields en la misma página no colisionan)', () => {
    // Mount en un parent SHARED. useId() de Vue genera IDs únicos POR app —
    // si montás 2 wrappers separados, cada uno arranca el contador en 0 y
    // colisionan. Para verificar uniqueness real, los renderizamos en el
    // mismo árbol.
    const Parent = {
      components: { Field },
      template: '<div><Field label="A" model-value="" /><Field label="B" model-value="" /></div>',
    }
    const wrapper = mount(Parent)
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    const id1 = inputs[0].attributes('id')
    const id2 = inputs[1].attributes('id')
    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
    expect(id1).not.toBe(id2)
  })

  it('cuando NO hay error ni hint, aria-describedby está ausente (no string vacío)', () => {
    const wrapper = mount(Field, {
      props: { label: 'Email', modelValue: '' },
    })
    const input = wrapper.find('input')
    // Vue omite el atributo cuando computed devuelve undefined
    expect(input.attributes('aria-describedby')).toBeUndefined()
  })
})
