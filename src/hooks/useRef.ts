import { defineHook } from '../core'
import { HookTag } from './builtIn'
import type { MutableRefObject, RefObject } from './type'

type UseRefContext<T = any> = {
  current: T,
}

interface UseRefSignature {
  <T>(initialValue: T): MutableRefObject<T>
  <T>(initialValue: T | null): RefObject<T>
  <T = undefined>(): MutableRefObject<T | undefined>
}

export const useMemo = defineHook<UseRefContext, UseRefSignature>({
  tagName: HookTag.REF,
  scan: prev => prev,
  collect: (initialValue?: any) => ({ current: initialValue }),
  spread: context =>
    // tslint:disable-next-line: no-unsafe-any
    context.current,
})
