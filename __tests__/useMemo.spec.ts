import { useMemo } from '../src/hooks/useMemo'
import { createRuntime } from '../src/core/runtime'

describe('hook works fine', () => {
  it('test useMemo without runtime commitment throws error', () => {
    expect(() => useMemo(() => 5, [5])).toThrowError()
  })
  it('test useMemo with runtime commitment works fine', () => {
    createRuntime(() => {
      expect(() => useMemo(() => 5, [5])).not.toThrowError()
    })()
  })
  it('test the returned value of useMemo', () => {
    createRuntime(() => {
      const value = useMemo(() => 5, [])
      expect(value).toBe(5)
    })()
  })
})
