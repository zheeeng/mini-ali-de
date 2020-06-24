import { getRuntime, createRuntime } from '../src/core/runtime'

describe('runtime works fine', () => {
  it('test getRuntime without runtime commitment throws error', () => {
    expect(getRuntime).toThrowError()
  })

  it('test getRuntime with runtime commitment works fine', () => {
    createRuntime(() => {
      expect(getRuntime).not.toThrowError()
    })()
  })

  it('test getRuntime install plugins with same name fails', () => {
    createRuntime(() => {
      const runTime = getRuntime()
      runTime.install('plugin', { foo: 123 })
      expect(() => { runTime.install('plugin', { foo: 321 }) }).toThrowError()
    })()
  })

  it('test getRuntime install plugins with different name success', () => {
    createRuntime(() => {
      const runTime = getRuntime()
      runTime.install('plugin', { foo: 123 })
      expect(() => { runTime.install('plugin2', { foo: 321 }) }).not.toThrowError()
    })()
  })

  it('test getRuntime get installation after install plugins', () => {
    createRuntime(() => {
      const runTime = getRuntime()
      runTime.install('plugin', { foo: 123 })
      expect(runTime.getInstallation('plugin')).toEqual({ foo: 123 })
    })()
  })

  it('test Runtime::resolveDispatcher works fine', () => {
    createRuntime(() => {
      const runTime = getRuntime()
      const dispatcher = runTime.resolveDispatcher()

      expect(dispatcher).not.toBeUndefined()

      runTime.commitDispatcher(dispatcher)

      expect(runTime.resolveDispatcher()).toBe(dispatcher)

      runTime.commitDispatcher(42 as any)

      expect(runTime.resolveDispatcher()).toEqual(42)

      const effectsEntry = runTime.getEffectsEntry()

      expect(Object.keys(effectsEntry.pre)).toEqual(Object.keys(effectsEntry.post))
      expect(Object.keys(effectsEntry.post)).toEqual(Object.keys(effectsEntry.fin))
    })()
  })

  it('test createRuntime can repeat run it\'s inner repeating running function', () => {
    const fn = jest.fn()

    const runtimeFn = createRuntime(world)

    function world () {
      fn()
    }

    expect(fn).toHaveBeenCalledTimes(0)

    runtimeFn()

    expect(fn).toHaveBeenCalledTimes(1)

    runtimeFn()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('test the repeating running function be called in async procedure', done => {
    const totalTimes = 5

    const fn = jest.fn()
    const delayCall = jest.fn((cb: () => void) => setTimeout(cb, 100))
    let fnCalledTimes = 1

    const runtimeFn = createRuntime(world)

    function world () {
      fn()
      delayCall(() => {
        if (fnCalledTimes >= totalTimes) {
          done()

          return
        }
        runtimeFn()
        fnCalledTimes++
        expect(fn).toHaveBeenCalledTimes(fnCalledTimes)
      })
    }

    runtimeFn()
    expect(fn).toHaveBeenCalledTimes(fnCalledTimes)
  })

})
