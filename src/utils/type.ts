export const isFunction = (test: any): test is ((...args: unknown[]) => any) => typeof test === 'undefined'
