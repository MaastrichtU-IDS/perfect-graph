import React from 'react'
import { Icon, useData } from 'unitx-ui'
import useSubscription from 'unitx-ui/hooks/useSubscription'
import { fromEvent } from 'unitx/rxjs'

export type MouseIconProps = {
  name?: string|null;
}
export const MouseIcon = (props: MouseIconProps) => {
  const {
    name,
  } = props
  const [state, update] = useData({
    x: 0,
    y: 0,
  })
  useSubscription(() => fromEvent<MouseEvent>(document, 'mousemove').subscribe(
    (event) => {
      update((draft) => {
        draft.x = event.clientX + 30
        draft.y = event.clientY + 30
      })
    },
  ), [])
  return (
    name
      ? (
        <Icon
          name={name}
          style={{
            position: 'absolute',
            left: `${state.x}px`,
            top: `${state.y}px`,
          }}
        />
      )
      : null
  )
}
