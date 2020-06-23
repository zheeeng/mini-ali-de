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

  it('test getRuntime get installation after install plugins', () => {
    createRuntime(() => {
      const runTime = getRuntime()
      runTime.install('plugin', { foo: 123 })
      expect(runTime.getInstallation('plugin')).toEqual({ foo: 123 })
    })()
  })

  it('test Runtime::getDispatcher works fine', () => {
    createRuntime(() => {
      const runTime = getRuntime()
      const dispatcher = runTime.getDispatcher()

      expect(dispatcher).not.toBeUndefined()

      runTime.commitDispatcher(dispatcher)

      expect(runTime.getDispatcher()).toBe(dispatcher)

      runTime.commitDispatcher(42 as any)

      expect(runTime.getDispatcher()).toEqual(42)

      const effectsEntry = runTime.getEffectsEntry()

      expect(Object.keys(effectsEntry.pre)).toEqual(Object.keys(effectsEntry.post))
      expect(Object.keys(effectsEntry.post)).toEqual(Object.keys(effectsEntry.fin))
    })()
  })

  it('test createRuntime can repeat run it\'s inner repeating running function', () => {
    const fn = jest.fn()

    expect(fn).toHaveBeenCalledTimes(0)

    createRuntime(world)()

    function world () {
      fn()
    }

    expect(fn).toHaveBeenCalledTimes(1)

  })

})
