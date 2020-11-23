import React from 'react'
import { Icon, useData } from 'unitx-ui'
import useSubscription from 'unitx-ui/hooks/useSubscription'
import { fromEvent } from 'unitx/rxjs'

export type MouseIconProps = {
  name?: string|null;
  cursor?: boolean;
}
export const MouseIcon = (props: MouseIconProps) => {
  const {
    name,
    cursor = false,
  } = props
  const [state, update] = useData({
    x: 0,
    y: 0,
  })
  useSubscription(() => fromEvent<MouseEvent>(document, 'mousemove').subscribe(
    (event) => {
      if (cursor) {
        return
      }
      update((draft) => {
        draft.x = event.clientX + 30
        draft.y = event.clientY + 30
      })
    },
  ), [cursor])
  React.useEffect(() => {
    if (cursor) {
      document.body.style.cursor = `url(${name}), auto`
    }
  }, [cursor, name])
  return (
    name && !cursor
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
