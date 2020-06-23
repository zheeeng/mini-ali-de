export async function asap (fn: () => void) {
  return Promise.resolve().then(fn)
}
