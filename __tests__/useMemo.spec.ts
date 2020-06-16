import { createFiber, createNode, createHead, Scan } from '../src/hooks/fiber'

describe('fiber works fine', () => {
  describe('useMemo works fine', () => {
    type UseMemoHookCtx = {
      tag: 'sum',
      value: number,
    }

    const sumHookScan: Scan<UseMemoHookCtx> = (prev, curr) => ({
      ...prev,
      context: {
        ...prev.context,
        value: prev.context.value + curr.context.value,
      },
    })

    it('test the context value adding', () => {
      const fiber1 = createFiber(null)

      const hook1 = createNode<UseMemoHookCtx>(
        fiber1,
        sumHookScan,
        { tag: 'sum', value: 1 },
      )

      expect(hook1.context.tag).toBe('sum')
      expect(hook1.context.value).toBe(1)

      const hook2 = createNode<UseMemoHookCtx>(
        fiber1,
        sumHookScan,
        { tag: 'sum', value: 2 },
      )

      expect(hook2.context.tag).toBe('sum')
      expect(hook2.context.value).toBe(2)

      const hook3 = createNode<UseMemoHookCtx>(
        fiber1,
        sumHookScan,
        { tag: 'sum', value: 3 },
      )

      expect(hook3.context.tag).toBe('sum')
      expect(hook3.context.value).toBe(3)

      const contextOfHooks1 = fiber1.inspectContext()

      expect(contextOfHooks1).toStrictEqual([
        { tag: 'sum', value: 1 },
        { tag: 'sum', value: 2 },
        { tag: 'sum', value: 3 },
      ])

      const fiber2 = createFiber(fiber1)

      const hook4 = createNode<UseMemoHookCtx>(
        fiber2,
        sumHookScan,
        { tag: 'sum', value: 4 },
      )

      expect(hook4.context.tag).toBe('sum')
      expect(hook4.context.value).toBe(5)

      const hook5 = createNode<UseMemoHookCtx>(
        fiber2,
        sumHookScan,
        { tag: 'sum', value: 5 },
      )

      expect(hook5.context.tag).toBe('sum')
      expect(hook5.context.value).toBe(7)

      const hook6 = createNode<UseMemoHookCtx>(
        fiber2,
        sumHookScan,
        { tag: 'sum', value: 6 },
      )

      expect(hook6.context.tag).toBe('sum')
      expect(hook6.context.value).toBe(9)

      const contextOfHooks2 = fiber1.inspectContext()

      expect(contextOfHooks2).toStrictEqual([
        { tag: 'sum', value: 5 },
        { tag: 'sum', value: 7 },
        { tag: 'sum', value: 9 },
      ])
    })

  })
})
