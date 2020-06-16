import { Fiber, createFiber } from './fiber'
import { assertIsNotNull  } from '../utils/assert'

type RunTime = {
  commitFiber: (fiber: Fiber) => void,
  getFiber: () => Fiber,
}

const $runTime = {
  ref: null as RunTime | null,
}

export function saveRunTime (runTime: RunTime) {
  $runTime.ref = runTime
}

export function getRunTime (): RunTime {
  assertIsNotNull($runTime.ref, 'Must not run hook outside of page or component')

  return $runTime.ref
}

export function createRunTime (): RunTime {
  let runningFiber: Fiber | null

  return {
    commitFiber: fiber => runningFiber = fiber,
    getFiber: () => runningFiber || createFiber(null),
  }
}
