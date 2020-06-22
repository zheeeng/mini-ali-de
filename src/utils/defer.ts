export function defer (fn: () => void) {
  setTimeout(fn, 1)
}
