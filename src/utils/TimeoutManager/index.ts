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
export const createTimeoutManager = <T extends Timer<Record<string, any>>>(
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
    controller.duration = 0
    onFinishCallback?.()
  }
  const onPlayChanged = (started: boolean) => {
    if (started) {
      controller.durationCounter = createDurationCounter()
    } else {
      // @ts-ignore
      controller.durationCounter && clearInterval(controller.durationCounter)
    }
    controller.paused = !started
    onPlayChangedCallback?.()
  }
  let totalDuration = 0
  timers.forEach(({ after }: T) => {
    totalDuration += after
  })
  const createDurationCounter = () => setInterval(() => {
    controller.duration += 100
  }, 100)
  const controller = {
    currentIndex: 0,
    totalDuration,
    duration: 0,
    durationCounter: null as null | Timeout,
    timers,
    timeoutInstances,
    finished: isEmpty,
    paused: !autostart,
    pause: () => {
      timeoutInstances.forEach((timeoutInstance, index) => {
        if (index >= controller.currentIndex) {
          timeoutInstance.pause()
        }
      })
      onPlayChanged(false)
    },
    start: () => {
      timeoutInstances.forEach((timeoutInstance, index) => {
        if (index >= controller.currentIndex) {
          timeoutInstance.resume()
        }
      })
      onPlayChanged(true)
    },
    clear: () => {
      timeoutInstances.forEach((timeoutInstance) => {
        timeoutInstance.clear()
      })
      // @ts-ignore
      controller.durationCounter && clearInterval(controller.durationCounter)
      onFinish()
    },
  }
  timers.forEach((timer, index) => {
    afterTotal += timer.after
    const timeoutInstance = Timeout.instantiate(() => {
      controller.currentIndex = index + 1
      callback(timer, index, timeoutInstance)
      if (index === timers.length - 1) {
        controller.clear()
      }
    }, afterTotal)
    if (!autostart) {
      timeoutInstance.pause()
    }
    timeoutInstances.push(
      timeoutInstance,
    )
  })
  if (autostart) {
    controller.durationCounter = createDurationCounter()
  }
  return controller
}

export type TimeoutManager = ReturnType<typeof createTimeoutManager>
