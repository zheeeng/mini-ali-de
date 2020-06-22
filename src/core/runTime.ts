import { Dispatcher, createDispatcher } from './dispatcher'
import { assertIsNotNull  } from '../utils/assert'
import { createEffects, Effects } from './effects'

type Runtime = {
  getEffectsEntry: () => {
    pre: Effects,
    post: Effects,
    fin: Effects,
  }
  commitDispatcher: (dispatcher: Dispatcher) => void,
  getDispatcher: () => Dispatcher,
}

const $runtime = {
  ref: null as Runtime | null,
}

function commitRuntime (runtime: Runtime) {
  $runtime.ref = runtime
}

export function getRuntime (): Runtime {
  assertIsNotNull($runtime.ref, 'Must not run hook outside of page or component')

  const runtime = $runtime.ref

  return runtime
}

export function createRuntime (): Runtime {
  let runningDispatcher: Dispatcher | null

  const effects = {
    pre: createEffects(),
    post: createEffects(),
    fin: createEffects(),
  }

  const runTime: Runtime = {
    getEffectsEntry: () => effects,
    commitDispatcher: dispatcher => runningDispatcher = dispatcher,
    getDispatcher: () => runningDispatcher ?? createDispatcher(null),
  }

  commitRuntime(runTime)

  return runTime
}
