import * as R from 'unitx/ramda'
import { Position } from 'unitx/type'
import * as V from 'unitx/vector'

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
      const result = onDrag(V.subtract(mutableData.position!)(position))
      mutableData.position = position
      return R.pipe(
        R.tap(
          R.when(
            R.propEq('keepDragging', false),
            () => {
              mutableData.position = null
            },
          ),
        ),
        R.tap(
          R.when(
            R.has('position'),
            () => {
              // @ts-ignore
              mutableData.position = result.position
            },
          ),
        ),
      )(result ?? {})
    },
  )(mutableData.position)
  document.addEventListener('mouseup', () => {
    mutableData.position = null
  })
  return {
    onDown,
    onMove,
  }
}
