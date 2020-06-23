import { Dispatcher, createDispatcher } from './dispatcher'
import { assertIsNotNull, assert  } from '../utils/assert'
import { createEffects, Effects } from './effects'

type Runtime = {
  install: (installName: string, installation: any) => void,
  getInstallation: (installName: string) => any,
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

function cleanRuntime () {
  $runtime.ref = null
}

export function getRuntime (): Runtime {
  assertIsNotNull($runtime.ref, 'Must not run hook outside of page or component')

  const runtime = $runtime.ref

  return runtime
}

export function runInRuntime (run: () => any) {
  let runningDispatcher: Dispatcher | null

  const installations: Record<string, any> = {}

  const effects = {
    pre: createEffects(),
    post: createEffects(),
    fin: createEffects(),
  }

  const runTime: Runtime = {
    install: (installName, installation) => {
      assert(installations[installName] === undefined,
             'Must make sure the installName only be used once on per runtime')
      installations[installName] = installation
    },
    // tslint:disable-next-line: no-unsafe-any
    getInstallation: installName => installations[installName],
    getEffectsEntry: () => effects,
    commitDispatcher: dispatcher => runningDispatcher = dispatcher,
    getDispatcher: () => runningDispatcher ?? createDispatcher(null),
  }

  return () => {
    commitRuntime(runTime)
    const dispatcher = runTime.getDispatcher()
    runTime.commitDispatcher(dispatcher)
    effects.pre.trigger()
    effects.pre.clean()
    run()
    effects.post.trigger()
    effects.post.clean()
    runTime.commitDispatcher(dispatcher.evolve())

    cleanRuntime()
  }
}
