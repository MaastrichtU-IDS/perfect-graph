import { Timeout, TimeoutInstance } from './smart-timer'

export type {
  TimeoutInstance,
} from './smart-timer'
export type Timer<T> = {
  after: number;
} & T

export {
  Timeout,
} from './smart-timer'

export type Options = {
  onFinish?: () => void;
  onPlayChanged?: () => void;
  autostart?: boolean
}
export const createTimeoutManager = <T extends Timer<any>>(
  timers: T[] = [],
  callback: (timer: T, index: number, timeout: TimeoutInstance) => void,
  options: Options = {},
) => {
  const {
    onFinish: onFinishCallback,
    autostart = true,
    onPlayChanged: onPlayChangedCallback,
  } = options
  const isEmpty = timers.length === 0
  const timeoutInstances: TimeoutInstance[] = []
  let afterTotal = 0
  const onFinish = () => {
    controller.finished = true
    onFinishCallback?.()
  }
  const onPlayChanged = () => {
    onPlayChangedCallback?.()
  }
  const controller = {
    currentIndex: 0,
    timeoutInstances,
    finished: isEmpty,
    paused: !autostart,
    pause: () => {
      timeoutInstances.forEach((timeoutInstance, index) => {
        if (index >= controller.currentIndex) {
          timeoutInstance.pause()
        }
      })
      controller.paused = true
      onPlayChanged()
    },
    start: () => {
      timeoutInstances.forEach((timeoutInstance, index) => {
        if (index >= controller.currentIndex) {
          timeoutInstance.resume()
        }
      })
      controller.paused = false
      onPlayChanged()
    },
    clear: () => {
      timeoutInstances.forEach((timeoutInstance) => {
        timeoutInstance.clear()
        // if (index >= controller.currentIndex) {
        // }
      })
      onFinish()
    },
  }
  timers.forEach((timer, index) => {
    afterTotal += timer.after
    const timeoutInstance = Timeout.instantiate(() => {
      controller.currentIndex = index + 1
      callback(timer, index, timeoutInstance)
      if (index === timers.length) {
        onFinish()
      }
    }, afterTotal)
    if (!autostart) {
      timeoutInstance.pause()
    }
    timeoutInstances.push(
      timeoutInstance,
    )
  })

  return controller
}

export type TimeoutManager = ReturnType<typeof createTimeoutManager>
