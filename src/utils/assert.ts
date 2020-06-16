export function assert (condition: any, msg?: string): asserts condition {
  if (!condition) throw new Error(msg)
}

export function assertIsNotNull<T> (value: T | null, msg?: string): asserts value is T {
  if (value === null) throw new Error(msg)
}
