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
      const node = hook(5)

      expect(node.type).toBe('NODE')
      expect(node.context).toBe(5)
      expect(node.next).toEqual({ type: 'TAIL' })

      const node2 = hook(2)

      expect(node2.type).toBe('NODE')
      expect(node2.context).toBe(2)
      expect(node2.next).toEqual({ type: 'TAIL' })
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
