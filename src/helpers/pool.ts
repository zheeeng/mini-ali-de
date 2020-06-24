export type Pool = {
  add: (value: string) => void,
  has: (value: string) => boolean,
  clean: () => void,
}

export const createPool = (): Pool => {
  let pool = Object.create(null) as Record<string, true>
  const add: Pool['add'] = value => { pool[value] = true }
  const has: Pool['has'] = value => !!pool[value]
  const clean = () => { pool = Object.create(null) as Record<string, true> }

  return {
    add,
    has,
    clean,
  }
}
