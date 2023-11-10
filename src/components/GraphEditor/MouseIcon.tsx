import React from 'react'
import {getEventClientPosition} from '@utils'
// import { Icon } from '@mui/material'

export type MouseIconProps = {
  name?: string | null
  cursor?: boolean
}

export const MouseIcon = (props: MouseIconProps) => {
  const {name, cursor = false} = props
  const [, setState] = React.useState({
    x: 0,
    y: 0
  })
  React.useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (cursor) {
        return
      }
      const position = getEventClientPosition(event)
      setState({
        x: position.x + 30,
        y: position.y + 30
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
  return name && !cursor ? (
    <span>{name}</span>
  ) : // <Icon
  //   style={{
  //     position: 'absolute',
  //     left: `${state.x}px`,
  //     top: `${state.y}px`,
  //   }}
  // >
  //   {name}
  // </Icon>
  null
}
