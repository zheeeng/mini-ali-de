export enum HookTag {
  STATE = 'STATE',
  REDUCER = 'REDUCER',
  EFFECT = 'EFFECT',
  LAYOUT_EFFECT = 'LAYOUT_EFFECT',
  CALLBACK = 'CALLBACK',
  MEMO = 'MEMO',
  REF = 'REF',
}

export const nullSymbol: unique symbol = new String('__null_symbol__') as any
export type NullSymbol = typeof nullSymbol
