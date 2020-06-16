export type Scan<Ctx = any> = (
  prev: Node<Ctx>,
  curr: Node<Ctx>,
) => Node<Ctx>

type Tail = {
  type: 'tail',
}

export const createTail = (): Tail => ({ type: 'tail' })

type Head = {
  type: 'head',
  next: Node | Tail,
}

export const createHead = (): Head => ({ type: 'head', next: createTail() })

export type Node<Ctx = any> = {
  type: 'node',
  context: Ctx,
  scan: Scan<Ctx>,
  next: Node<Ctx> | Tail,
}

export interface Fiber {
  head: Head,
  iter: (node: Node) => Node,
  inspectContext: () => any[]
}

export const createNode = <Ctx = any>(
  fiber: Fiber,
  context: Ctx,
  scan: Scan<Ctx>,
): Node<Ctx> => {
  const node: Node<Ctx> = {
    type: 'node',
    context,
    scan,
    next: {
      type: 'tail',
    },
  }

  return fiber.iter(node)
}

export const createFiber = (fiberProto: Fiber | null): Fiber => {
  let cursorNode: Head | Node = fiberProto?.head || createHead()

  const fiberInstance: Fiber = {
    head: cursorNode,
    iter (node: Node) {
      // TODO:: add record stack
      const currentNode: Node = cursorNode.next.type === 'node'
        ? cursorNode.next.scan(cursorNode.next, node)
        : node

      // link chain
      cursorNode = cursorNode.next = currentNode

      return currentNode
    },
    inspectContext () {
      const context: any[] = []
      let inspectNodeCursor: Node | Tail = fiberInstance.head.next

      while (inspectNodeCursor.type === 'node') {
        context.push(inspectNodeCursor.context)
        inspectNodeCursor = inspectNodeCursor.next
      }

      return context
    },
  }

  return fiberInstance
}
