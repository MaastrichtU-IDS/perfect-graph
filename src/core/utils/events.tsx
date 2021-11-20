import { Position } from 'colay/type'
import * as V from 'colay/vector'
import Vector from 'victor'

type OnDragResult = {
  keepDragging?: boolean;
  position?: Position;
}

export function dragTrack(
  onDrag: (pos: Position) => { keepDragging?: boolean; position?: Position } | void,
) {
  const mutableData: { position: Position | null } = { position: null }
  const onDown = (position: Position) => {
    mutableData.position = position
  }
  const onMove = (position: Position) => {
    if (mutableData.position) {
      const result = (
        onDrag(
          Vector.fromObject(position).subtract(Vector.fromObject(mutableData.position)),
        // V.subtract(mutableData.position!)(position)
        ) ?? {}
      ) as OnDragResult
      mutableData.position = position
      if (result?.keepDragging === false) {
        mutableData.position = null
      }
      if (Object.keys(result).includes('position')) {
        (mutableData as OnDragResult).position = result.position
      }
      return result
    }
  }
  document.addEventListener('pointerup', () => {
    mutableData.position = null
  })
  return {
    onDown,
    onMove,
  }
}
