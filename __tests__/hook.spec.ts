import { createHook, resetRegisteredHookTag, defineHook } from '../src/core/hook'
import { createRuntime } from '../src/core/runtime'

describe('createHook works fine', () => {
  it('test createHook with runtime created throws error', () => {
    const hook = createHook<number>((a, b) => (a || 0) + b)
    expect(() => hook(5)).toThrowError()
  })

  it('test createHook works fine', () => {
    const hook = createHook<number>((a, b) => (a || 0) + b)

    createRuntime(() => {
      const value = hook(5)

      expect(value.type).toBe('NODE')
      expect(value.context).toBe(5)
      expect(value.next).toEqual({ type: 'TAIL' })

      const value2 = hook(2)

      expect(value2.type).toBe('NODE')
      expect(value2.context).toBe(2)
      expect(value2.next).toEqual({ type: 'TAIL' })
    })
  })
})

describe('defineHook works fine', () => {
  beforeEach(() => {
    resetRegisteredHookTag()
  })

  it('test hooks have different tagName', () => {
    defineHook<number, () => number>({
      tagName: 'hook1',
      collect: () => 1,
      scan: ((a, b) => (a || 0) + b),
      spread: i => i,
    })

    expect(() => defineHook<number, () => number>({
      tagName: 'hook1',
      collect: () => 1,
      scan: ((a, b) => (a || 0) + b),
      spread: i => i,
    })).toThrowError()

    expect(() => defineHook<number, () => number>({
      tagName: 'hook2',
      collect: () => 1,
      scan: ((a, b) => (a || 0) + b),
      spread: i => i,
    })).not.toThrowError()
  })
})
