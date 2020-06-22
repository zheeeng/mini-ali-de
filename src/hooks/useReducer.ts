import { HookTag, nullSymbol, NullSymbol } from './builtIn'
import { defineHook } from '../core'
import type { Reducer, ReducerState, ReducerAction, Dispatch } from './type'
import { assert } from '../utils/assert'

type ReducerContext<S = any, A = any, I = S> = {
  reducer: Reducer<S, A>,
  stateRef: { ref: S | NullSymbol },
  dispatch: ((action: A) => void) | NullSymbol,
  initialState?: S | NullSymbol,
  initializerArg?: I | NullSymbol,
  initializer?: ((arg: I) => S) | NullSymbol,
}

interface UseReducerSignature {
  <R extends Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I & ReducerState<R>,
    initializer: (arg: I & ReducerState<R>) => ReducerState<R>,
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
  <R extends Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I,
    initializer: (arg: I) => ReducerState<R>,
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
  <R extends Reducer<any, any>>(
    reducer: R,
    initialState: ReducerState<R>,
    initializer?: undefined,
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>]
}

export const useReducer = defineHook<ReducerContext, UseReducerSignature>({
  tagName: HookTag.REDUCER,
  scan: (prev, curr) => {
    const reducer = curr.reducer
    const stateRef = prev.stateRef
    const dispatch = prev.dispatch === nullSymbol
      ? (action: any) => {
        stateRef.ref = reducer(stateRef.ref, action)
      }
      : prev.dispatch
    if (stateRef.ref === nullSymbol) {
      const { initialState, initializer, initializerArg } = prev

      if (initialState === nullSymbol) {
        stateRef.ref = initialState
      } else {
        assert(initializer)
        assert(initializer !== nullSymbol)
        assert(initializerArg !== nullSymbol)

        stateRef.ref = initializer(initializerArg)
      }
    }

    return {
      reducer,
      stateRef,
      dispatch,
    }
  },
  collect: (reducer, initialArgOrState, maybeInitializer) => {
    const initialState = maybeInitializer ? nullSymbol : initialArgOrState
    const initializer: NullSymbol | ((arg: any) => any) = maybeInitializer ?? nullSymbol
    const initializerArg = maybeInitializer ? initialArgOrState : nullSymbol

    return {
      reducer,
      stateRef: { ref: nullSymbol },
      dispatch: nullSymbol,
      initialState,
      initializer,
      initializerArg,
    }
  },
  spread: ({ stateRef, dispatch }) => {
    assert(stateRef.ref !== nullSymbol)
    assert(dispatch !== nullSymbol)

    return [stateRef.ref, dispatch]
  },
})
