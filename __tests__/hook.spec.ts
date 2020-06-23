import { createHook } from '../src/core/hook'
import { runInRuntime } from '../src/core/runtime'

describe('hook works fine', () => {
  it('test createHook with runtime created throws error', () => {
    const hook = createHook<number>((a, b) => a + b)
    expect(() => hook(5)).toThrowError()
  })
  it('test createHook works fine', () => {
    const hook = createHook<number>((a, b) => a + b)

    runInRuntime(() => {
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
