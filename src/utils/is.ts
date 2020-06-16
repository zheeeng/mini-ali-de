export function is (x: any, y: any) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // tslint:disable-next-line: no-unsafe-any
    return x !== 0 || 1 / x === 1 / y
  }

  // Step 6.a: NaN == NaN
  // tslint:disable-next-line: no-unsafe-any
  return x !== x && y !== y
}
