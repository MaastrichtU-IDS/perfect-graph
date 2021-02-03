import React from 'react'

export type UseEffectProps<T> = {
  effect: (params: {
    setValue: (value: T) => void
    updateValue: (value: Partial<T>) => void
  }) => () => any;
  deps?: any[];
  value: T
  children: (value: T) => React.ReactElement
}

export const UseEffect = <T extends any>(props: UseEffectProps<T>) => {
  const {
    value: _value,
    effect,
    deps = [],
    children,
  } = props
  const [value, setValue] = React.useState(_value)
  const updateValue = React.useCallback((partialValue) => {
    setValue({
      ...value,
      ...partialValue,
    })
  }, [value])
  React.useEffect(
    () => effect({ setValue, updateValue }) ?? (() => {}),
    deps,
  )
  return (
    children(value)
  )
}
