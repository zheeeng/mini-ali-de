import { useMemo } from './useMemo'
import { DependencyList } from './type'
import { HookTag } from './builtIn'

interface UseCallbackSignature {
  <T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T
}

const useMemo2 = useMemo.redefineTag(HookTag.CALLBACK)

export const useCallback: UseCallbackSignature = (callback, deps) => useMemo2(() => callback, deps)
