import { Timeout, TimeoutInstance } from './smart-timer'

type Timer<T> = {
  after: number;
} & T

export {
  Timeout,
} from './smart-timer'

export const createTimeoutManager = <T extends Timer<any>>(
  timers: T[] = [],
  callback: (timer: T, index: number, timeout: TimeoutInstance) => void,
) => {
  const isEmpty = timers.length === 0
  const timeoutInstances: TimeoutInstance[] = []
  let afterTotal = 0
  const controller = {
    currentIndex: 0,
    timeoutInstances,
    finished: isEmpty,
    pause: () => {
      timeoutInstances.forEach((timeoutInstance, index) => {
        if (index >= controller.currentIndex) {
          timeoutInstance.pause()
        }
      })
    },
    start: () => {
      timeoutInstances.forEach((timeoutInstance, index) => {
        if (index >= controller.currentIndex) {
          timeoutInstance.resume()
        }
      })
    },
    clear: () => {
      timeoutInstances.forEach((timeoutInstance) => {
        timeoutInstance.clear()
        // if (index >= controller.currentIndex) {
        // }
      })
    },
  }
  timers.forEach((timer, index) => {
    afterTotal += timer.after
    const timeoutInstance = Timeout.instantiate(() => {
      controller.currentIndex = index + 1
      if (index === timers.length) {
        controller.finished = true
      }
      callback(timer, index, timeoutInstance)
    }, afterTotal)
    timeoutInstances.push(
      timeoutInstance,
    )
  })

  return controller
}

export type TimeoutManager = ReturnType<typeof createTimeoutManager>
