import { assert, assertIsNotNull } from '../utils/assert'
import { Scan, createNode } from './fiber'
import { getRunTime } from './runTime'

interface BaseHookContext<Content extends NonNullable<any>> {
  tag: string,
  content: Content,
}

export type HookScan<Context = any> = (prev: Context, curr: Context) => Context
const hookTag: Record<string, HookScan> = {}

export function defineHook <
  Context,
  Input = Context,
  Output = Context,
> ({
  hookScan, tagName,
  // tslint:disable-next-line: no-unsafe-any
  collector = (input: any) => input,
  // tslint:disable-next-line: no-unsafe-any
  spreader = (context: any) => context,
}: {
  hookScan: HookScan<Context>,
  tagName: string,
  collector?: (...inputs: Input[]) => Context,
  spreader?: (context: Context) => Output,
}) {
  assert(!(tagName in hookTag), 'Must not create duplicated hook tagName!')
  hookTag[tagName] = hookScan

  const scan: Scan<BaseHookContext<Context>> = (prevContext, currContext) => {
    assert(prevContext.context.tag === currContext.context.tag, 'Must not run hook in condition and loop statement!')

    const content = hookScan(prevContext.context.content, currContext.context.content)

    assertIsNotNull(content, 'hookScan must not return null value!')

    return {
      ...currContext,
      context: {
        ...currContext.context,
        content,
      },
    }
  }

  const innerHook = createHook(scan)

  const hookImpl = (...inputs: Input[]) => {
    const context = collector(...inputs)

    return spreader(innerHook({ tag: tagName, content: context }).context.content)
  }

  return hookImpl
}

export function createHook <Context> (scan: Scan<Context>) {

  return function hook (context: Context) {
    const fiber = getRunTime().getFiber()

    const node = createNode(fiber, context, scan)

    return node
  }
}
