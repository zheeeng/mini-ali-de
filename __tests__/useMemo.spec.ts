import { useMemo } from '../src/hooks/useMemo'
import { createRuntime } from '../src/core/runtime'

describe('useMemo works fine', () => {
  it('test the returned value of useMemo', () => {
    createRuntime(() => {
      const value = useMemo(() => 5, [])
      expect(value).toBe(5)
    })()
  })

  it('test the deps of useMemo works as expected', () => {
    let loopTimes = 0

    const runtimeFn = createRuntime(world)
    const expenseFn = jest.fn()

    function world () {
      loopTimes++
      const value1 = useMemo(() => (expenseFn(), loopTimes * 5))
      expect(value1).toBe(loopTimes * 5)
      expect(expenseFn).toHaveBeenCalledTimes(loopTimes === 1 ? 1 : 5)

      const value2 = useMemo(() => (expenseFn(), loopTimes * 5), [loopTimes])
      expect(value2).toBe(loopTimes * 5)
      expect(expenseFn).toHaveBeenCalledTimes(loopTimes === 1 ? 2 : 6)

      const value3 = useMemo(() => (expenseFn(), loopTimes * 5), [])
      expect(value3).toBe(5)
      expect(expenseFn).toHaveBeenCalledTimes(loopTimes === 1 ? 3 : 6)

      const value4 = useMemo(() => (expenseFn(), loopTimes * 5), [42])
      expect(value4).toBe(5)
      expect(expenseFn).toHaveBeenCalledTimes(loopTimes === 1 ? 4 : 6)
    }

    runtimeFn()
    runtimeFn()
  })
})
