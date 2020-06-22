export type SetStateAction<S> = S | ((prevState: S) => S)
export type Dispatch<A> = (value: A) => void
export type Reducer<S, A> = (prevState: S, action: A) => S
export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never
export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never
export type DependencyList = ReadonlyArray<unknown>
export interface MutableRefObject<T> {
  current: T
}
export interface RefObject<T> {
  readonly current: T | null
}
export type EffectCallback = () => (void | (() => void | undefined))
