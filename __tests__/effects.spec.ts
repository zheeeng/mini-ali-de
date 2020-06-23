import { createEffects } from '../src/helpers/effects'

describe('createEffects works fine', () => {
  it('test basic features', () => {
    const effects = createEffects()

    const fn1 = jest.fn()
    const fn2 = jest.fn()
    const fn3 = jest.fn()
    const fn4 = jest.fn()

    effects.register(fn1)
    effects.register(fn1)
    effects.register(fn2)
    effects.register(fn3)
    effects.register(fn4)

    expect(fn1).toHaveBeenCalledTimes(0)
    expect(fn2).toHaveBeenCalledTimes(0)
    expect(fn3).toHaveBeenCalledTimes(0)
    expect(fn4).toHaveBeenCalledTimes(0)

    effects.trigger()

    expect(fn1).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(fn3).toHaveBeenCalledTimes(1)
    expect(fn4).toHaveBeenCalledTimes(1)

    effects.clean()
    effects.trigger()

    expect(fn1).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(1)
    expect(fn3).toHaveBeenCalledTimes(1)
    expect(fn4).toHaveBeenCalledTimes(1)
  })
})
