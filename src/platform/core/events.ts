export type Events = {
  register: (eventName: string, effect: () => void) => void,
  trigger: (eventName: string) => void,
  clean: (eventName: string) => void,
}

export const createEvents = (): Events => {
  const events: Record<string, Array<() => void>> = {}
  const register: Events['register'] = (eventName, effect) => {
    events[eventName] = events[eventName]?.concat(effect) ?? [effect]
  }
  const trigger: Events['trigger'] = eventName => {
    events[eventName]?.forEach(event => { event() })
  }
  const clean: Events['clean'] = eventName => { delete events[eventName] }

  return {
    register,
    trigger,
    clean,
  }
}
