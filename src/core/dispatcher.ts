export type Scan<Ctx = any> = (
  prev: Node<Ctx>,
  curr: Node<Ctx>,
) => Node<Ctx>

enum NodeType {
  HEAD = 'HEAD',
  NODE = 'NODE',
  TAIL = 'TAIL',
}

type Tail = {
  readonly type: NodeType.TAIL,
}

export const createTail = (): Tail => ({ type:  NodeType.TAIL })

type Head = {
  readonly type: NodeType.HEAD,
  next: Node | Tail,
}

export const createHead = (): Head => ({ type: NodeType.HEAD, next: createTail() })

export type Node<Ctx = any> = {
  readonly type: NodeType.NODE,
  context: Ctx,
  scan: Scan<Ctx>,
  next: Node<Ctx> | Tail,
}

export interface Dispatcher {
  head: Head,
  iter: (node: Node) => Node,
  inspectCursor: () => Head | Node
  inspectContext: () => any[]
  evolve: () => Dispatcher,
}

export const createNode = <Ctx = any>(
  dispatcher: Dispatcher,
  context: Ctx,
  scan: Scan<Ctx>,
): Node<Ctx> => {
  const node: Node<Ctx> = {
    type: NodeType.NODE,
    context,
    scan,
    next: {
      type: NodeType.TAIL,
    },
  }

  return dispatcher.iter(node)
}

export const createDispatcher = (dispatcherProto: Dispatcher | null): Dispatcher => {
  let cursorNode: Head | Node = dispatcherProto?.head ?? createHead()

  const dispatcherInstance: Dispatcher = {
    head: cursorNode,
    iter (node: Node) {
      // TODO:: add record stack
      const currentNode: Node = cursorNode.next.type === NodeType.NODE
        ? cursorNode.next.scan(cursorNode.next, node)
        : node

      // link chain
      cursorNode = cursorNode.next = currentNode

      return currentNode
    },
    inspectCursor () {
      return cursorNode
    },
    inspectContext () {
      const context: any[] = []
      let inspectNodeCursor: Node | Tail = dispatcherInstance.head.next

      while (inspectNodeCursor.type === NodeType.NODE) {
        context.push(inspectNodeCursor.context)
        inspectNodeCursor = inspectNodeCursor.next
      }

      return context
    },
    evolve () {
      return createDispatcher(dispatcherInstance)
    },
  }

  return dispatcherInstance
}
