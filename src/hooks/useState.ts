import type { SetStateAction, Dispatch } from './type'
import { HookTag } from './builtIn'
import { useReducer } from './useReducer'

interface UseStateSignature {
  <S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]
  <S>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>]
}

function stateReducer <S> (
  prevValue: S,
  nextValue: SetStateAction<S>): S {
  return typeof nextValue === 'function'
    ? (nextValue as (prevState: S) => S)(prevValue)
    : nextValue
}

function useStateInitializer <S> (initialValue: S | (() => S)): S {
  return typeof initialValue === 'function'
    ? (initialValue as () => S)()
    : initialValue
}

const useReducer2 = useReducer.redefineTag(HookTag.STATE)

export const useState: UseStateSignature =  <S> (initialValue?: S) =>
  useReducer2(stateReducer, initialValue, useStateInitializer)
