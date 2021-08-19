import * as R from 'colay/ramda'
import { Position } from 'colay/type'
import * as V from 'colay/vector'

type OnDragResult = {
  keepDragging?: boolean;
  position?: Position;
}

export function dragTrack(
  onDrag: (pos: Position) => {keepDragging?: boolean; position?: Position }|void,
) {
  const mutableData: { position: Position | null} = { position: null }
  const onDown = (position: Position) => {
    mutableData.position = position
  }
  const onMove = (position: Position) => R.when(
    R.isNotNil,
    () => {
      const result = (onDrag(V.subtract(mutableData.position!)(position)) ?? {}) as OnDragResult

      mutableData.position = position
      if (result?.keepDragging === false) {
        mutableData.position = null
      }
      if (R.has('position', result)) {
        (mutableData as OnDragResult).position = result.position
      }
      return result
      // return R.pipe(
      //   R.tap(
      //     R.when(
      //       R.propEq('keepDragging', false),
      //       () => {
      //         mutableData.position = null
      //       },
      //     ),
      //   ),
      //   R.tap(
      //     R.when(
      //       R.has('position'),
      //       () => {
      //         // @ts-ignore
      //         mutableData.position = result.position
      //       },
      //     ),
      //   ),
      // )(result ?? {})
    },
  )(mutableData.position)
  document.addEventListener('pointerup', () => {
    mutableData.position = null
  })
  return {
    onDown,
    onMove,
  }
}
