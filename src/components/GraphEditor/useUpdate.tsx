import React from 'react'
import { useTaskQueue } from 'colay-ui/hooks/useTaskQueue'
// import * as R from 'colay/ramda'
import { useStateWithCallback } from 'colay-ui/hooks/useStateWithCallback'
import { Logger, Updater, UpdateState } from 'colay-ui/hooks/useImmer/type'

const CONCURRENCY = 1

type Options<T> = {
  logger?: Logger<T>;
  deps?: any[]
}

type UpdaterConfig<T> = {
  silent?: boolean;
  value?: T;
}

export const useUpdate = <T, UR extends any | UpdaterConfig<T> | undefined >(
  initialValue: T,
  options: Options<T> = {},
) => {
  type UpdaterFunc = Updater<T, UR>
  type UpdateStateFunc = UpdateState<UpdaterFunc>
  const {
    logger,
  } = options
  const [state, setState] = useStateWithCallback({
    refreshCount: 0,
  })
  const stateRef = React.useRef({
    value: initialValue,
    updaterReturn: null as UR | null,
    setState,
  })
  stateRef.current.setState = setState
  React.useMemo(() => {
    stateRef.current.value = initialValue
  }, options.deps ?? [])
  /// CREATE_QUEUE
  const queue = useTaskQueue({ concurrency: CONCURRENCY })
  /// ADD_QUEUE
  const updateValueCallback = React.useCallback(
    async (
      updater: Parameters<UpdateStateFunc>[0],
      stateCallback?: Parameters<UpdateStateFunc>[1],
    ) => {
      queue.push(async () => {
        let updaterReturn: any
        try {
          updaterReturn = await updater(stateRef.current.value)
        } catch (error) {
          console.error(error)
        }
        const nextValue = updaterReturn?.value ? updaterReturn?.value : stateRef.current.value
        logger?.({ name: updater.name, state: nextValue })
        stateRef.current.value = nextValue
        stateRef.current.updaterReturn = updaterReturn ?? null
        if (updaterReturn?.silent) {
          stateCallback?.(nextValue)
        } else {
          stateRef.current.setState({
            refreshCount: state.refreshCount + 1,
          },
          () => stateCallback?.(nextValue))
        }
      })
    }, [],
  )

  const setCallback = React.useCallback((nextValue: T, config?: UpdaterConfig<T>) => {
    updateValueCallback(() => ({ ...config, value: nextValue } as UR))
  }, [updateValueCallback])
  const clearCallback = React.useCallback(() => {
    setCallback(initialValue)
  }, [updateValueCallback])
  return [
    stateRef.current.value,
    updateValueCallback,
    {
      updaterReturn: stateRef.current.updaterReturn,
      set: setCallback,
      clear: clearCallback,
    },
  ] as [
    T,
      typeof updateValueCallback,
      {
        updaterReturn: UR;
        set: typeof setCallback;
        clear: typeof clearCallback;
      },
  ]
}
