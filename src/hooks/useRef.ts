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

export const useRef = defineHook<UseRefContext, UseRefSignature>({
  tagName: HookTag.REF,
  scan: (prev, curr) => prev || curr,
  // tslint:disable-next-line: no-unsafe-any
  collect: (initialValue?: any) => ({ current: initialValue ?? null }),
  spread: context => context,
})
