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
  renderOnPlayChanged?: boolean;
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
    renderOnPlayChanged = false,
    onFinish,
    autostart = true,
  } = options
  const [, setState] = React.useState({})
  const eventTimeoutsManager = React.useMemo(() => createTimeoutManager(
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
      onPlayChanged: () => {
        if (renderOnPlayChanged) {
          setState({})
        }
      },
      autostart,
    },
  ), deps)
  React.useEffect(
    () => () => {
      eventTimeoutsManager.clear()
    },
    deps,
  )
  return eventTimeoutsManager
}
