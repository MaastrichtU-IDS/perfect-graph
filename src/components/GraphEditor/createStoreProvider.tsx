import React from 'react'
import { Text } from 'colay-ui'
import * as R from 'colay/ramda'
import { useImmer } from 'colay-ui/hooks/useImmer'
import createPersistor, { PersistorOptions } from 'colay-ui/utils/createPersistor'
import { useUpdate } from 'colay-ui/hooks/useUpdate'
import { BehaviorSubject } from './BehaviourSubject'

type UpdateConfig = {
}
export type Updater<T, R = void> = (
  draft: T,
) => R | void
export type UpdateState<U extends (...args: any[]) => void> = (
  updater: U,
  callback?: (state: Parameters<U>[0]) => void
) => void
export type Call<Args extends any[], O> = (...args: Args) => O
export type Logger<T> = (input: { name: string; state: T }) => void

type Options<T> ={
  fallback?: React.ReactNode;
  logger?: Logger<T>;
  init?: (state: T) => Promise<T> | T;
  immer?: boolean;
} & Partial<PersistorOptions<T>>

export const createStoreProvider = <T extends any>(
  defaultState: T,
  options?: Options<T>,
) => {
  const {
    name = 'DEFAULT_PROVIDER_STORE',
    persist,
    fallback = <Text>isLoading</Text>,
    version,
    migrations,
    logger,
    init = R.identity,
    immer = true,
  } = options ?? {}
  const persistor = persist
    ? createPersistor({
      name,
      persist,
      version,
      migrations,
    }) : null
  const storeSubject = BehaviorSubject<T>(defaultState)
  type UseSelectorReturn<R> = [
    R,
    typeof storeRef.current.update,
    typeof storeRef.current,
  ]
  type UpdaterType = Updater<T, void | UpdateConfig>
  const storeRef = {
    current: {
      state: defaultState,
      getState: () => storeRef.current.state,
      subscribe: (subscriber: (value: T)=> void) => storeSubject.subscribe(subscriber),
      update: async (
        updater: UpdaterType,
      ) => {
        updater(defaultState)
      },
      set: (nextValue: T) => {

      },
      clear: () => {

      },
      purge: async () => {
        await persistor?.purge()
      },
      connect: <Y extends any>(
        component: React.Component,
        selector: (state: T) => Y,
        fieldName = 'storeState',
      ): Y => {
        const {
          current: store,
        } = storeRef
        let initial = true
        const { componentWillUnmount } = component
        if (component.state === undefined) {
          component.state = {}
        }
        const subscription = storeSubject.subscribe((newState) => {
          const newSelectedState = selector(newState)
          const isEqual = R.equals(
            // @ts-ignore
            component[fieldName],
            newSelectedState,
          )
          // @ts-ignore
          component[fieldName] = newSelectedState
          if (!initial && !isEqual) {
            component.setState(component.state)
          }
          initial = false
        })
        component.componentWillUnmount = (...rest) => {
          componentWillUnmount?.(...rest)
          subscription.unsubscribe()
        }
        return selector(store.getState())
      },
    },
  }

  const Context = React.createContext(storeRef.current)
  return {
    Context,
    Provider: (props: { children: React.ReactNode; value: T }) => {
      const { children, value: valueProp } = props
      const value = valueProp ?? defaultState
      const initializedRef = React.useRef(false)
      const [
        immerNextState,
        immerUpdate,
        immerUpdateSettings,
      ] = useImmer<T, UpdateConfig>(value, { logger })
      const [
        mutableNextState,
        updateState,
        mutableUpdateSettings,
      ] = useUpdate<T>(value)
      const mutableUpdate = React.useCallback((updateCallback) => {
        updateState(updateCallback)
      }, [])
      
      let nextState = immer ? immerNextState : mutableNextState
      const update = immer ? immerUpdate : mutableUpdate
      const updateSettings = immer ? immerUpdateSettings : mutableUpdateSettings
      // @TODO: DANGER
      React.useMemo(() => {
        if (initializedRef.current) {
          updateSettings.set(value, { silent: true })
          nextState = value
        }
      }, [value])
      // @TODO: DANGER
      // @ts-ignore
      storeRef.current.update = update
      storeRef.current.set = updateSettings.set
      storeRef.current.clear = updateSettings.clear
      if (!R.equals(storeRef.current.state, nextState)) {
        storeSubject.next(nextState)
      }
      storeRef.current.state = nextState
      
      if (initializedRef.current) {
        persistor?.set(nextState)
      }
      
      React.useEffect(
        () => {
          const initialize = async () => {
            const persistedValue = await persistor?.get()
            initializedRef.current = true
            const mergedValue = await init(
              // @ts-ignore
              R.mergeDeepRight(value, persistedValue! ?? {}),
            )
            updateSettings.set(mergedValue)
          }
          initialize()
        },
        [],
      )
      return initializedRef.current
        ? <Context.Provider value={storeRef.current}>{children}</Context.Provider>
        : fallback
    },
    useSelector: <Y extends any>(
      selector: (state: T) => Y,
    ): UseSelectorReturn<Y> => {
      const [
        selectedState, // store,
        setSelectedState,
      ] = React.useState(null as unknown as Y)

      const ref = React.useRef({
        selectedState,
        setSelectedState,
      })
      ref.current = {
        selectedState,
        setSelectedState,
      }
      const subscription = React.useMemo(
        () => {
          if (!R.is(Function, selector)) {
            throw Error('Selector have to be a proper function')
          }
          return storeSubject.subscribe((state) => {
            const newSelectedState = selector
              ? selector(state)
              : state

            const isEqual = R.equals(
              ref.current.selectedState,
              newSelectedState,
            )
            // console.log('SUBSCRIBE', isEqual, state, ref.current.selectedState, newSelectedState)
            return R.when(
              R.isFalse,
              () => {
                ref.current.selectedState = newSelectedState as Y
                ref.current.setSelectedState(newSelectedState as Y)
              },
            )(isEqual)
          })
        },
        [],
      )
      React.useEffect(() => () => subscription.unsubscribe(), [])
      return [
        ref.current.selectedState,
        storeRef.current.update,
        storeRef.current,
      ]
    },
    // action: <T extends any[], R>(
    //   input: (update: UpdateStateType) => (...args: T) => R
    // ) => {
    //   return (...args: T) => input(storeRef.current.update)(...args)
    // },
    store: storeRef.current,
  }
}
