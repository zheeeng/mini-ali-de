export type Scan<Ctx = any> = (
  prev: Node<Ctx> | null,
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

export const isHead = (node: Head | Node | Tail): node is Head => node.type === NodeType.HEAD
export const isNode = (node: Head | Node | Tail): node is Node => node.type === NodeType.NODE
export const isTail = (node: Head | Node | Tail): node is Tail => node.type === NodeType.TAIL

export interface Dispatcher {
  head: Head,
  iter: (node: Node) => Node,
  inspectCursor: () => Head | Node
  inspectContexts: () => any[]
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
      const currentNode: Node = isNode(cursorNode.next)
        ? node.scan(cursorNode.next, node)
        : node.scan(null, node)

      // link chain
      cursorNode = cursorNode.next = currentNode

      return currentNode
    },
    inspectCursor () {
      return cursorNode
    },
    inspectContexts () {
      const contexts: any[] = []
      let inspectNodeCursor: Node | Tail = dispatcherInstance.head.next

      while (isNode(inspectNodeCursor)) {
        contexts.push(inspectNodeCursor.context)
        inspectNodeCursor = inspectNodeCursor.next
      }

      return contexts
    },
    evolve () {
      return createDispatcher(dispatcherInstance)
    },
  }

  return dispatcherInstance
}
