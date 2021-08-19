import React from 'react'

import * as R from 'colay/ramda'
import { Position } from 'colay/type'
import * as V from 'colay/vector'
import { getEventClientPosition } from '@utils'

type OnDragResult = {
  keepDragging?: boolean;
  position?: Position;
}

export const useDragInfo = (
  onDrag: (pos: Position) => {keepDragging?: boolean; position?: Position }|void,
) => {
  const mutableData: { position: Position | null} = React.useRef({
    position: null,
    boundingClientRect: null as null | any,
  }).current
  const onDown = (position: Position, e: MouseEvent) => {
    mutableData.position = position
    mutableData.boundingClientRect = e.target.getBoundingClientRect()
  }
  const onMove = React.useCallback((position: Position) => {
    if (mutableData.position) {
      const result = (onDrag(V.subtract(mutableData.position!)(position)) ?? {}) as OnDragResult
      mutableData.position = position
      if (result?.keepDragging === false) {
        mutableData.position = null
      }
      if (R.has('position', result)) {
        (mutableData as OnDragResult).position = result.position
      }
      return result
    }
  }, [])
  React.useEffect(() => {
    const mouseUpOnDocument = () => {
      mutableData.position = null
    }
    const mouseMoveOnDocument = (e) => {
      if (mutableData.position) {
        const {
          boundingClientRect,
          position,
        } = mutableData
        const clientPosition = getEventClientPosition(e)
        onMove(V.add({
          x: clientPosition.x - boundingClientRect.left,
          y: clientPosition.y - boundingClientRect.top,
        })(position))
      }
    }
    document.addEventListener('mouseup', mouseUpOnDocument)
    document.addEventListener('mousemove', mouseMoveOnDocument)
    return () => {
      document.removeEventListener('mouseup', mouseUpOnDocument)
      document.removeEventListener('mousemove', mouseMoveOnDocument)
    }
  }, [])
  return {
    onDown,
    onMove,
  }
}
