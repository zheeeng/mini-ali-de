export function execute (fn: () => void, delay: boolean) {
  delay ? setTimeout(fn, 1) : fn()
}
