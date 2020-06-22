import { getRuntime, createRuntime } from '../src/core/runtime'

describe('runtime works fine', () => {
  it('test getRuntime without runtime commitment throws error', () => {
    expect(getRuntime).toThrowError()
  })

  it('test getRuntime with runtime commitment works fine', () => {
    createRuntime()

    expect(getRuntime).not.toThrowError()
  })

  it('test Runtime::getDispatcher works fine', () => {
    const runTime = createRuntime()

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
