import { createDispatcher, createNode, createHead, Scan, isHead, isNode, isTail, createTail } from '../src/core/dispatcher'

describe('dispatcher Helper works fine', () => {
  const stubDispatcher = { iter: jest.fn((i: unknown) => i) as any }
  const stubScan = jest.fn()
  const head = createHead()
  const node = createNode(stubDispatcher as any, null, stubScan as any)
  const tail = createTail()

  it('createNode triggers Dispatcher::iter', () => {
    expect(stubDispatcher.iter).toHaveBeenCalledTimes(1)
    expect(stubScan).toHaveBeenCalledTimes(0)
  })

  it('isHead works fine', () => {
    expect(isHead(head)).toBe(true)
    expect(isHead(node)).toBe(false)
    expect(isHead(tail)).toBe(false)
    expect(isHead(head.next)).toBe(false)
    expect(isHead(node.next)).toBe(false)
  })

  it('isNode works fine', () => {
    expect(isNode(head)).toBe(false)
    expect(isNode(node)).toBe(true)
    expect(isNode(tail)).toBe(false)
    expect(isNode(head.next)).toBe(false)
    expect(isNode(node.next)).toBe(false)
  })

  it('isTail works fine', () => {
    expect(isTail(head)).toBe(false)
    expect(isTail(node)).toBe(false)
    expect(isTail(tail)).toBe(true)
    expect(isTail(head.next)).toBe(true)
    expect(isTail(node.next)).toBe(true)
  })
})

describe('dispatcher works fine', () => {
  describe('case 1: replaceHook works fine', () => {
    const stubHead = createHead()

    type ReplaceHookCtx = {
      tag: 'replace',
      value: number,
    }

    const replaceScan: Scan<ReplaceHookCtx> = (_, curr) => curr

    it('test the basic work flow', () => {
      const dispatcher1 = createDispatcher(null)

      expect(dispatcher1.head).toMatchObject(stubHead)

      const node1 = createNode<ReplaceHookCtx>(
        dispatcher1,
        { tag: 'replace', value: 1 },
        replaceScan,
      )

      const stubHeadHookAfterRuntimeHookCreated = { ...stubHead, next: node1 }

      expect(dispatcher1.head).toMatchObject(stubHeadHookAfterRuntimeHookCreated)
      expect(node1.context.tag).toBe('replace')
      expect(node1.context.value).toBe(1)

      const node2 = createNode<ReplaceHookCtx>(
        dispatcher1,
        { tag: 'replace', value: 2 },
        replaceScan,
      )

      expect(node2.context.tag).toBe('replace')
      expect(node2.context.value).toBe(2)

      const node3 = createNode<ReplaceHookCtx>(
        dispatcher1,
        { tag: 'replace', value: 3 },
        replaceScan,
      )

      expect(node3.context.tag).toBe('replace')
      expect(node3.context.value).toBe(3)

      const contextOfHooks1 = dispatcher1.inspectContexts()

      expect(contextOfHooks1).toStrictEqual([
        { tag: 'replace', value: 1 },
        { tag: 'replace', value: 2 },
        { tag: 'replace', value: 3 },
      ])

      const dispatcher2 = createDispatcher(dispatcher1)

      expect(dispatcher2.head.next).toBe(node1)

      const node4 = createNode<ReplaceHookCtx>(
        dispatcher2,
        { tag: 'replace', value: 4 },
        replaceScan,
      )

      expect(node4.context.tag).toBe('replace')
      expect(node4.context.value).toBe(4)

      const node5 = createNode<ReplaceHookCtx>(
        dispatcher2,
        { tag: 'replace', value: 5 },
        replaceScan,
      )

      expect(node5.context.tag).toBe('replace')
      expect(node5.context.value).toBe(5)

      const node6 = createNode<ReplaceHookCtx>(
        dispatcher2,
        { tag: 'replace', value: 6 },
        replaceScan,
      )

      expect(node6.context.tag).toBe('replace')
      expect(node6.context.value).toBe(6)

      const contextOfHooks2 = dispatcher1.inspectContexts()

      expect(contextOfHooks2).toStrictEqual([
        { tag: 'replace', value: 4 },
        { tag: 'replace', value: 5 },
        { tag: 'replace', value: 6 },
      ])

    })

    it('test the dispatch evolving work flow', () => {
      const dispatcher1 = createDispatcher(null)

      expect(dispatcher1.head).toMatchObject(stubHead)

      const node1 = createNode<ReplaceHookCtx>(
        dispatcher1,
        { tag: 'replace', value: 1 },
        replaceScan,
      )

      const stubHeadHookAfterRuntimeHookCreated = { ...stubHead, next: node1 }

      expect(dispatcher1.head).toMatchObject(stubHeadHookAfterRuntimeHookCreated)
      expect(node1.context.tag).toBe('replace')
      expect(node1.context.value).toBe(1)

      const node2 = createNode<ReplaceHookCtx>(
        dispatcher1,
        { tag: 'replace', value: 2 },
        replaceScan,
      )

      expect(node2.context.tag).toBe('replace')
      expect(node2.context.value).toBe(2)

      const node3 = createNode<ReplaceHookCtx>(
        dispatcher1,
        { tag: 'replace', value: 3 },
        replaceScan,
      )

      expect(node3.context.tag).toBe('replace')
      expect(node3.context.value).toBe(3)

      const contextOfHooks1 = dispatcher1.inspectContexts()

      expect(contextOfHooks1).toStrictEqual([
        { tag: 'replace', value: 1 },
        { tag: 'replace', value: 2 },
        { tag: 'replace', value: 3 },
      ])

      const dispatcher2 = dispatcher1.evolve()

      expect(dispatcher2.head.next).toBe(node1)

      const node4 = createNode<ReplaceHookCtx>(
        dispatcher2,
        { tag: 'replace', value: 4 },
        replaceScan,
      )

      expect(node4.context.tag).toBe('replace')
      expect(node4.context.value).toBe(4)

      const node5 = createNode<ReplaceHookCtx>(
        dispatcher2,
        { tag: 'replace', value: 5 },
        replaceScan,
      )

      expect(node5.context.tag).toBe('replace')
      expect(node5.context.value).toBe(5)

      const node6 = createNode<ReplaceHookCtx>(
        dispatcher2,
        { tag: 'replace', value: 6 },
        replaceScan,
      )

      expect(node6.context.tag).toBe('replace')
      expect(node6.context.value).toBe(6)

      const contextOfHooks2 = dispatcher1.inspectContexts()

      expect(contextOfHooks2).toStrictEqual([
        { tag: 'replace', value: 4 },
        { tag: 'replace', value: 5 },
        { tag: 'replace', value: 6 },
      ])

    })

  })

  describe('case 2: sum works fine', () => {
    type SumHookCtx = {
      tag: 'sum',
      value: number,
    }

    const sumScan: Scan<SumHookCtx> = (prev, curr) => prev
      ? ({
        ...prev,
        context: {
          ...prev.context,
          value: prev.context.value + curr.context.value,
        },
      })
      : curr

    it('test the context value adding', () => {
      const dispatcher1 = createDispatcher(null)

      const node1 = createNode<SumHookCtx>(
        dispatcher1,
        { tag: 'sum', value: 1 },
        sumScan,
      )

      expect(node1.context.tag).toBe('sum')
      expect(node1.context.value).toBe(1)

      const node2 = createNode<SumHookCtx>(
        dispatcher1,
        { tag: 'sum', value: 2 },
        sumScan,
      )

      expect(node2.context.tag).toBe('sum')
      expect(node2.context.value).toBe(2)

      const node3 = createNode<SumHookCtx>(
        dispatcher1,
        { tag: 'sum', value: 3 },
        sumScan,
      )

      expect(node3.context.tag).toBe('sum')
      expect(node3.context.value).toBe(3)

      const contextOfHooks1 = dispatcher1.inspectContexts()

      expect(contextOfHooks1).toStrictEqual([
        { tag: 'sum', value: 1 },
        { tag: 'sum', value: 2 },
        { tag: 'sum', value: 3 },
      ])

      const dispatcher2 = createDispatcher(dispatcher1)

      const node4 = createNode<SumHookCtx>(
        dispatcher2,
        { tag: 'sum', value: 4 },
        sumScan,
      )

      expect(node4.context.tag).toBe('sum')
      expect(node4.context.value).toBe(5)

      const node5 = createNode<SumHookCtx>(
        dispatcher2,
        { tag: 'sum', value: 5 },
        sumScan,
      )

      expect(node5.context.tag).toBe('sum')
      expect(node5.context.value).toBe(7)

      const node6 = createNode<SumHookCtx>(
        dispatcher2,
        { tag: 'sum', value: 6 },
        sumScan,
      )

      expect(node6.context.tag).toBe('sum')
      expect(node6.context.value).toBe(9)

      const contextOfHooks2 = dispatcher1.inspectContexts()

      expect(contextOfHooks2).toStrictEqual([
        { tag: 'sum', value: 5 },
        { tag: 'sum', value: 7 },
        { tag: 'sum', value: 9 },
      ])
    })

  })

  describe('case 3: sumIfChangedHook works fine', () => {
    type SumIfChangedHookCtx = {
      tag: 'sumIfChanged',
      value: number,
    }

    const sumIfChangedHookScan: Scan<SumIfChangedHookCtx> =
      (prev, curr) => prev
        ? prev.context.value === curr.context.value
          ? prev
          : ({
            ...prev,
            context: {
              ...prev.context,
              value: prev.context.value + curr.context.value,
            },
          })
        : curr

    it('test the context value adding when context value mutated', () => {
      const dispatcher1 = createDispatcher(null)

      const node1 = createNode<SumIfChangedHookCtx>(
        dispatcher1,
        { tag: 'sumIfChanged', value: 1 },
        sumIfChangedHookScan,
      )

      expect(node1.context.tag).toBe('sumIfChanged')
      expect(node1.context.value).toBe(1)

      const node2 = createNode<SumIfChangedHookCtx>(
        dispatcher1,
        { tag: 'sumIfChanged', value: 2 },
        sumIfChangedHookScan,
      )

      expect(node2.context.tag).toBe('sumIfChanged')
      expect(node2.context.value).toBe(2)

      const node3 = createNode<SumIfChangedHookCtx>(
        dispatcher1,
        { tag: 'sumIfChanged', value: 3 },
        sumIfChangedHookScan,
      )

      expect(node3.context.tag).toBe('sumIfChanged')
      expect(node3.context.value).toBe(3)

      const contextOfHooks1 = dispatcher1.inspectContexts()

      expect(contextOfHooks1).toStrictEqual([
        { tag: 'sumIfChanged', value: 1 },
        { tag: 'sumIfChanged', value: 2 },
        { tag: 'sumIfChanged', value: 3 },
      ])

      const dispatcher2 = createDispatcher(dispatcher1)

      const node4 = createNode<SumIfChangedHookCtx>(
        dispatcher2,
        { tag: 'sumIfChanged', value: 1 },
        sumIfChangedHookScan,
      )

      expect(node4.context.tag).toBe('sumIfChanged')
      expect(node4.context.value).toBe(1)
      expect(node4).toBe(node1)

      const node5 = createNode<SumIfChangedHookCtx>(
        dispatcher2,
        { tag: 'sumIfChanged', value: 5 },
        sumIfChangedHookScan,
      )

      expect(node5.context.tag).toBe('sumIfChanged')
      expect(node5.context.value).toBe(7)

      const node6 = createNode<SumIfChangedHookCtx>(
        dispatcher2,
        { tag: 'sumIfChanged', value: 3 },
        sumIfChangedHookScan,
      )

      expect(node6.context.tag).toBe('sumIfChanged')
      expect(node6.context.value).toBe(3)
      expect(node6).toBe(node3)

      const contextOfHooks2 = dispatcher1.inspectContexts()

      expect(contextOfHooks2).toStrictEqual([
        { tag: 'sumIfChanged', value: 1 },
        { tag: 'sumIfChanged', value: 7 },
        { tag: 'sumIfChanged', value: 3 },
      ])
    })

  })
})
