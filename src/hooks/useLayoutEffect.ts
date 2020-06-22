import type { DependencyList, EffectCallback } from './type'
import { useEffect0 } from './useEffect'
import { HookTag } from './builtIn'

interface UseEffectSignature {
  (effect: EffectCallback, deps?: DependencyList): void
}

const useEffect1 = useEffect0.redefineTag(HookTag.LAYOUT_EFFECT)
export const useEffect: UseEffectSignature = (
  effect: EffectCallback, deps?: DependencyList,
) => { useEffect1(effect, deps, false) }
