export function ensureArray<T> (arr: T | T[]): T[] {
  return ([] as T[]).concat(arr)
}
