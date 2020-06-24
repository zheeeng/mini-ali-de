import { useReducer } from '../src/hooks/useReducer'
import { createRuntime } from '../src/core/runtime'

describe('useReducer works fine', () => {
  it('test the returned value of useReducer with passing a initialState', () => {
    createRuntime(() => {
      const [value] = useReducer(() => 15, 5)
      expect(value).toBe(5)
    })()
  })

  it('test the returned value of useReducer with passing a initialArg, and initializer', () => {
    createRuntime(() => {
      const [value] = useReducer(() => 15, 5, i => i + 5)
      expect(value).toBe(10)
    })()
  })

  it('test the useReducer works as expected', (done) => {
    const runtimeFn = createRuntime(world)
    const delayCall = jest.fn((cb: () => void) => setTimeout(cb, 100))
    let loopTimes = 0

    function world () {
      loopTimes++
      const [value1, dispatch1] = useReducer(() => 15, 5)
      expect(value1).toBe(loopTimes === 1 ? 5 : 15)

      const [value2, dispatch2] = useReducer(() => 15, 5, i => i + 5)
      expect(value2).toBe(loopTimes === 1 ? 10 : 15)

      delayCall(() => {
        dispatch1({})
        dispatch2({})
        runtimeFn()
        expect(value1).toBe(5)
        expect(value2).toBe(10)
        done()
      })
    }

    runtimeFn()
  })
})
