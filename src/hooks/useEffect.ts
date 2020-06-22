import { defineHook } from '../core/hook'
import { HookTag } from './builtIn'
import type { DependencyList, EffectCallback } from './type'
import { isArraySame } from '../utils/is'
import { defer } from '../utils/defer'

enum EffectType {
  ON_UNDECIDED = 'ON_UNDECIDED',
  // execute effect and cancelEffect on per render
  ON_RENDER = 'ON_RENDER',
  // execute effect and cancelEffect on deps changing
  ON_MUTATE = 'ON_MUTATE',
  // execute effect and cancelEffect on component didMount and willUnMount
  ON_LIFECYCLE = 'ON_LIFECYCLE',
}

function getEffectType (deps1?: readonly any[], deps2?: readonly any[]): EffectType {
  if (!deps1 && !deps2) return EffectType.ON_RENDER

  if (deps1?.length === 0 && deps2?.length === 0) return EffectType.ON_LIFECYCLE

  if (deps1?.length && deps2?.length) return EffectType.ON_MUTATE

  throw Error('Must not use the variable dependencies')
}

type UseEffect0Context = {
  subscribe: EffectCallback,
  effectType: EffectType,
  deps: DependencyList | undefined,
  delay: boolean,
}

interface UseEffect0Signature {
  (effect: EffectCallback, deps?: DependencyList, delay?: boolean): void
}

export const useEffect0 = defineHook<UseEffect0Context, UseEffect0Signature>({
  tagName: HookTag.EFFECT,
  scan: (prev, curr, { registerPreEffect, registerPostEffect, registerFinEffect}) => {
    const effectType = prev.effectType === EffectType.ON_UNDECIDED
      ? getEffectType(curr.deps, prev.deps)
      : prev.effectType

    if (prev.effectType === EffectType.ON_UNDECIDED && effectType === EffectType.ON_LIFECYCLE) {
      const executeEffect = () => {
        registerPostEffect(() => {
          const unsubscribe = curr.subscribe()
          unsubscribe && registerFinEffect(unsubscribe)
        })
      }

      curr.delay ? defer(executeEffect) : executeEffect()
    }

    if ((effectType === EffectType.ON_MUTATE && prev.deps && curr.deps && isArraySame(prev.deps, curr.deps))
      || effectType === EffectType.ON_RENDER) {
      const executeEffect = () => {
        registerPostEffect(() => {
          const unsubscribe = curr.subscribe()
          unsubscribe && registerPreEffect(unsubscribe)
        })
      }

      curr.delay ? defer(executeEffect) : executeEffect()
    }

    return {
      ...curr,
      effectType,
    }
  },
  collect: (effect, deps, delay = true) => ({ subscribe: effect, effectType: EffectType.ON_UNDECIDED, deps, delay }),
})

interface UseEffectSignature {
  (effect: EffectCallback, deps?: DependencyList): void
}

export const useEffect: UseEffectSignature = (
  effect: EffectCallback, deps?: DependencyList,
) => { useEffect0(effect, deps, true) }
