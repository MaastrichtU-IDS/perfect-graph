import React from 'react'
import {pauseEvent} from '@utils'
import {Position} from 'colay/type'
import {} from '@type'

export type Config = {
  /**
   * HTML element ref
   */
  ref: React.MutableRefObject<HTMLDivElement | null | undefined>
  /**
   * Drag Handler
   */
  onDrag: (pos: Position, rect: DOMRect) => {keepDragging?: boolean; position?: Position} | void
}

/**
 * Track drag events for Html Elements.
 */
export const useDrag = (options: Config) => {
  const {ref, onDrag} = options
  const resizer = React.useCallback(event => {
    const e = event.nativeEvent
    const prevX = e.x
    const prevY = e.y
    const panelRect = ref.current!.getBoundingClientRect()
    function mousemove(e: MouseEvent) {
      pauseEvent(e)
      const newX = prevX - e.x
      const newY = prevY - e.y
      onDrag({x: newX, y: newY}, panelRect)
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
