import { assert, assertIsNotNull } from '../utils/assert'
import { Scan, createNode } from './dispatcher'
import { getRuntime } from './runtime'

interface BaseHookContext<Content extends NonNullable<any>> {
  tag: string,
  content: Content,
}

type Registers = {
  registerPreEffect: (effect: () => void) => void,
  registerPostEffect: (effect: () => void) => void,
  registerFinEffect: (effect: () => void) => void,
}

export type HookScan<Context = any> = (
  prev: Context, curr: Context,
  registers: Registers,
) => Context
const registeredHookTag: Record<string, true> = {}

export interface HookDefine<
  Context,
  HookSignature extends (...inputs: any[]) => any,
> {
  tagName: string,
  scan: HookScan<Context>,
  collect: (...inputs: Parameters<HookSignature>) => Context,
  spread?: (context: Context) => ReturnType<HookSignature>,
}

type Hook<HookSignature extends (...inputs: any[]) => any> = HookSignature & {
  redefineTag: (tag: string) => Hook<HookSignature>,
}

export function defineHook <
  Context,
  HookSignature extends (...inputs: any[]) => any,
> (hookDefine: HookDefine<Context, HookSignature>): Hook<HookSignature> {
  const { tagName, scan, collect, spread } = hookDefine

  assert(!(tagName in registeredHookTag), 'Must not create duplicated hook tagName!')
  registeredHookTag[tagName] = true

  const hookScan: HookScan<BaseHookContext<Context>> = (prevContext, currContext, registers) => {
    assert(prevContext.tag === currContext.tag, 'Must not run hook in condition and loop statement!')

    const nextContent = scan(prevContext.content, currContext.content, registers)

    assertIsNotNull(nextContent, 'hookScan must not return null value!')

    return {
      ...currContext,
      context: {
        ...currContext,
        content: nextContent,
      },
    }
  }

  const innerHook = createHook(hookScan)

  const hookImpl = (...inputs: Parameters<HookSignature>) => {
    const context = collect(...inputs)

    return spread?.(innerHook({ tag: tagName, content: context }).context.content)
  }

  hookImpl.redefineTag = (newTag: string) => defineHook({
    ...hookDefine,
    tagName: newTag,
  })

  return hookImpl as Hook<HookSignature>
}

export function createHook <Context> (hookScan: HookScan<Context>) {

  return function hook (context: Context) {
    const runtime = getRuntime()
    const dispatcher = runtime.getDispatcher()
    const effectsEntry = runtime.getEffectsEntry()
    const registers: Registers = {
      registerPreEffect: effectsEntry.pre.register,
      registerPostEffect: effectsEntry.post.register,
      registerFinEffect: effectsEntry.fin.register,
    }

    const nodeScan: Scan<Context> = (prevContext, currContext) => {
      const nextContext = hookScan(prevContext.context, currContext.context, registers)

      return {
        ...currContext,
        context: nextContext,
      }
    }

    const node = createNode(dispatcher, context, nodeScan)

    return node
  }
}
