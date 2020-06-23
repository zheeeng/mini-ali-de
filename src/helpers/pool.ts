export type Pool = {
  add: (key: string) => void,
  has: (key: string) => boolean,
  clean: () => void,
}

export const createPool = (): Pool => {
  let pool = Object.create(null) as Record<string, true>
  const add: Pool['add'] = key => { pool[key] = true }
  const has: Pool['has'] = key => !!pool[key]
  const clean = () => { pool = Object.create(null) as Record<string, true> }

  return {
    add,
    has,
    clean,
  }
}
