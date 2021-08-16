import React from 'react'

export const useDrag = (options) => {
  const {
    ref,
    onDrag,
  } = options

  const resizer = React.useCallback((event) => {
    const e = event.nativeEvent
    const prevX = e.x
    const prevY = e.y
    const panelRect = ref.current.getBoundingClientRect()
    function mousemove(e) {
      const newX = prevX - e.x
      const newY = prevY - e.y
      onDrag({ x: newX, y: newY }, panelRect)
    }

    function mouseup() {
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
    }
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
  }, [])

  return resizer
}
