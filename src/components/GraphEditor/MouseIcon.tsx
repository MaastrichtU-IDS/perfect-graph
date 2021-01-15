import React from 'react'

export type MouseIconProps = {
  name?: string|null;
  cursor?: boolean;
  Icon: React.FC<{ name: string; style: any }>
}

export const MouseIcon = (props: MouseIconProps) => {
  const {
    name,
    cursor = false,
    Icon,
  } = props
  const [state, setState] = React.useState({
    x: 0,
    y: 0,
  })
  React.useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (cursor) {
        return
      }
      setState({
        x: event.clientX + 30,
        y: event.clientY + 30,
      })
    }
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [cursor])
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
