import React from 'react'
import {
  createTimeoutManager,
  Timer,
  TimeoutInstance,
} from './TimeoutManager'

type Options = {
  deps?: any[];
  renderOnTimeout?: boolean;
  renderOnFinished?: boolean;
  onFinish?: () => void
  autostart?: boolean;
}
export const useTimeoutManager = <T extends Timer<T>>(
  timers: T[],
  callback: (timer: T, index: number, timeout: TimeoutInstance) => void,
  options: Options = {},
) => {
  const {
    deps = [],
    renderOnTimeout = false,
    renderOnFinished = false,
    onFinish,
    autostart = true,
  } = options
  const [state, setState] = React.useState({})
  console.log('timeoutTick')
  const eventTimeoutsManager = React.useMemo(() => {
    console.log('createTimeoutManager')
    return createTimeoutManager(
      timers,
      (timer, index, timeout) => {
        callback(timer, index, timeout)
        if (renderOnTimeout) {
          setState({})
        }
      },
      {
        onFinish: () => {
          onFinish?.()
          if (renderOnFinished) {
            setState({})
          }
        },
        autostart,
      },
    )
  }, deps)
  React.useEffect(
    () => () => {
      eventTimeoutsManager.clear()
    },
    deps,
  )
  return eventTimeoutsManager
}
