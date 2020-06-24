import { useRef } from '../src/hooks/useRef'
import { createRuntime } from '../src/core/runtime'

describe('useRef works fine', () => {
  it('test the returned value of useRef without passing a initial value', () => {
    createRuntime(() => {
      const numRef = useRef<number>()
      expect(numRef.current).toBe(null)

      numRef.current = 5
      expect(numRef.current).toBe(5)
    })()
  })

  it('test the returned value of useRef when passing a implicit "zero" value', () => {
    createRuntime(() => {
      const numRef = useRef(0)
      expect(numRef.current).toBe(0)
    })()
  })

  it('test the returned value of useRef when passing a value directly', () => {
    createRuntime(() => {
      const numRef = useRef(5)
      expect(numRef.current).toBe(5)
    })()
  })

  it('test the useRef works as expected', (done) => {
    const runtimeFn = createRuntime(world)
    const delayCall = jest.fn((cb: () => void) => setTimeout(cb, 100))
    let loopTimes = 0

    function world () {
      loopTimes++
      const numRef1 = useRef<number>()
      expect(numRef1.current).toBe(loopTimes === 1 ? null : 5)

      const numRef2 = useRef(42)
      expect(numRef2.current).toBe(loopTimes === 1 ? 42 : 84)

      delayCall(() => {
        numRef1.current = 5
        numRef2.current = 84
        runtimeFn()
        expect(numRef1.current).toBe(5)
        expect(numRef2.current).toBe(84)
        done()
      })
    }

    runtimeFn()
  })
})
