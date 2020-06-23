export type Effects = {
  register: (effect: () => void) => void,
  trigger: () => void,
  clean: () => void,
}

export const createEffects = (): Effects => {
  let effects: Array<() => void> = []
  const register: Effects['register'] = effect => {
    effects.push(effect)
  }
  const trigger = () => {
    effects.forEach(effect => { effect() })
  }
  const clean = () => { effects = [] }

  return {
    register,
    trigger,
    clean,
  }
}
