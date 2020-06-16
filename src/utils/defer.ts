export function defer (fn: () => void, shouldDefer = true) {
  shouldDefer ? setTimeout(fn, 1) : fn()
}
