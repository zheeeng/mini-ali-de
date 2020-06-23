import { defineHook } from '../core/hook'
import { HookTag, nullSymbol, NullSymbol } from './builtIn'
import type { DependencyList } from './type'
import { isArraySame } from '../utils/is'
import { assert } from '../utils/assert'

type UseMemoContext<T = any> = {
  factory: () => T,
  deps: DependencyList | undefined,
  memoized: T | NullSymbol,
}

interface UseMemoSignature {
  <T>(...inputs: [() => T, DependencyList | undefined]): T
}

export const useMemo = defineHook<UseMemoContext, UseMemoSignature>({
  tagName: HookTag.MEMO,
  scan: (prev, curr) => {
    const acc = prev === null
      ? curr
      : isArraySame(prev.deps, curr.deps) ?  prev : curr

    return acc.memoized === nullSymbol ? { ...acc, memoized: acc.factory() } : acc
  },
  collect: (factory, deps) => ({ factory, deps, memoized: nullSymbol }),
  spread: context => {
    assert(context.memoized !== nullSymbol)

    return context.memoized
  },
})
