import { useState } from '../src/hooks/useState'
import { createRuntime } from '../src/core/runtime'

describe('useState works fine', () => {
  it('test the returned value of useState when passing a value calculator', () => {
    createRuntime(() => {
      const [value] = useState(() => 5)
      expect(value).toBe(5)
    })()
  })

  it('test the returned value of useState when passing a value directly', () => {
    createRuntime(() => {
      const [value] = useState(5)
      expect(value).toBe(5)
    })()
  })

  it('test the useState works as expected', (done) => {
    const runtimeFn = createRuntime(world)
    const delayCall = jest.fn((cb: () => void) => setTimeout(cb, 100))
    let loopTimes = 0

    function world () {
      loopTimes++
      const [value1, setValue1] = useState(5)
      expect(value1).toBe(loopTimes === 1 ? 5 : 10)

      const [value2, setValue2] = useState(42)
      expect(value2).toBe(loopTimes === 1 ? 42 : 84)

      delayCall(() => {
        setValue1(i => i + 5)
        setValue2(84)
        runtimeFn()
        expect(value1).toBe(5)
        expect(value2).toBe(42)
        done()
      })
    }

    runtimeFn()
  })
})
