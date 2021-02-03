import React from 'react'

export type UseEffectProps<T> = {
  effect: (setValue: (value: T) => void) => () => any;
  deps?: any[];
  value: T
  children: (value: T) => React.ReactElement
}

export const UseEffect = <T extends any>(props: UseEffectProps<T>) => {
  const {
    value,
    effect,
    deps = [],
    children,
  } = props
  const [state, setState] = React.useState(value)
  React.useEffect(() => effect(setState) ?? (() => {}), deps)
  return (
    children(state)
  )
}
