import { getRuntime, runInRuntime } from '../src/core/runtime'

describe('runtime works fine', () => {
  it('test getRuntime without runtime commitment throws error', () => {
    expect(getRuntime).toThrowError()
  })

  it('test getRuntime with runtime commitment works fine', () => {
    runInRuntime(() => {
      expect(getRuntime).not.toThrowError()
    })
  })

  it('test getRuntime install plugins with same name fails', () => {
    runInRuntime(() => {
      const runTime = getRuntime()
      runTime.install('plugin', { foo: 123 })
      expect(() => { runTime.install('plugin', { foo: 321 }) }).toThrowError()
    })
  })

  it('test getRuntime get installation after install plugins', () => {
    runInRuntime(() => {
      const runTime = getRuntime()
      runTime.install('plugin', { foo: 123 })
      expect(runTime.getInstallation('plugin')).toBe({ foo: 123 })
    })
  })

  it('test Runtime::getDispatcher works fine', () => {
    runInRuntime(() => {
      const runTime = getRuntime()
      const dispatcher = runTime.getDispatcher()

      expect(dispatcher).not.toBeUndefined()

      runTime.commitDispatcher(dispatcher)

      expect(runTime.getDispatcher()).toBe(dispatcher)

      runTime.commitDispatcher(42 as any)

      expect(runTime.getDispatcher()).toBe(42)

      const effectsEntry = runTime.getEffectsEntry()

      expect(Object.keys(effectsEntry.pre)).toEqual(Object.keys(effectsEntry.post))
      expect(Object.keys(effectsEntry.post)).toEqual(Object.keys(effectsEntry.fin))
    })
  })
})
