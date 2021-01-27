import { Position } from 'colay-ui/type'
import { BoundingBox } from '@type'
import * as PIXI from 'pixi.js'
import * as R from 'colay/ramda'
import * as V from 'colay/vector'
import * as C from 'colay/color'
import { DefaultTheme } from '@core/theme'

export type GraphicsProps = {

}

type BezierLinePoints = {
  start: Position;
  mid: Position;
  end: Position;
}
const controlPointsCreator = {
  bezier: (config: {
    from: Position;
    to: Position;
    unit: Position;
    distance: number;
    count: number;
  }): BezierLinePoints[] => {
    const {
      from,
      to,
      distance,
      count,
      unit,
    } = config
    const upperNormVector = V.rotate(Math.PI / 2)(unit)
    const upperVector = V.multiplyScalar(Math.abs(distance))(upperNormVector)
    const lowerVector = V.multiplyScalar(-1)(upperVector)
    const chunkDistanceVector = R.pipe(
      V.subtract(from),
      V.divideScalar(count),
    )(to)
    const semiChunkDistanceVector = V.divideScalar(2)(chunkDistanceVector)
    return R.mapIndexed(
      (_, index: number) => {
        const isUpper = index % 2 !== 0
        const startVec = R.pipe(
          V.multiplyScalar(index),
          V.add(from),
        )(chunkDistanceVector)
        const endVec = V.add(startVec)(chunkDistanceVector)
        const midVec = R.pipe(
          V.add(semiChunkDistanceVector),
          V.add(isUpper ? upperVector : lowerVector),
        )(startVec)
        return {
          start: startVec,
          mid: midVec,
          end: endVec,
          upperVector,
          midVec: R.pipe(
            V.add(semiChunkDistanceVector),
          )(startVec),
        }
      },
    )(R.range(0, count))
  },
}
const drawArrowHead = ({
  graphics: mutableGraphics,
  to,
  radius = 10,
  unit,
  fill,
}: {
  graphics: PIXI.Graphics;
  unit: Position;
  to: Position;
  radius?: number;
  fill: number;
}) => {
  const bottomCenter = to
  const unitDistanceVec = V.multiplyScalar(radius)(unit)
  const perpendicularUnitDistanceVec = V.rotate(-Math.PI / 2)(unitDistanceVec)
  const leftControlPoint = R.pipe(
    V.multiplyScalar(-1),
    V.add(bottomCenter),
  )(perpendicularUnitDistanceVec)
  const rightControlPoint = R.pipe(
    V.add(bottomCenter),
  )(perpendicularUnitDistanceVec)
  const topControlPoint = V.add(unitDistanceVec)(to)
  mutableGraphics.beginFill(fill)
  mutableGraphics.drawPolygon(
    new PIXI.Point(leftControlPoint.x, leftControlPoint.y),
    new PIXI.Point(rightControlPoint.x, rightControlPoint.y),
    new PIXI.Point(topControlPoint.x, topControlPoint.y),
  )
  mutableGraphics.endFill()
  mutableGraphics.isSprite = true
}
export const drawLine = (
  config: {
    from: BoundingBox;
    to: BoundingBox;
    fill?: number;
    directed?: boolean;
    graphics: PIXI.Graphics;
    type?: 'bezier' | 'segments' | 'straight';
    width?: number;
    alpha?: number;
    arrowHead?: {
      radius?: number;
    };
    distance?: number;
    margin?: Position
  },
) => {
  const {
    from: fromBoundingBox,
    to: toBoundingBox,
    fill = C.rgbNumber(DefaultTheme.palette.background.paper),
    directed,
    type, //= 'bezier',
    graphics: mutableInstance,
    width = 6,
    alpha = 1,
    arrowHead = {
      radius: 2,
    },
    distance,
    margin = {
      x: 0,
      y: 0,
    },
  } = config
  const fromPos = {
    x: fromBoundingBox.x + margin.x,
    y: fromBoundingBox.y + margin.y,
  }
  const toPos = {
    x: toBoundingBox.x + margin.x,
    y: toBoundingBox.y + margin.y,
  }
  const {
    to,
    from,
    distanceVector,
  } = R.ifElse(
    R.isTrue,
    () => {
      const centerOfFrom = V.add(
        fromBoundingBox.width / 2,
        fromBoundingBox.height / 2,
      )(fromPos)
      const centerOfTo = V.add(
        toBoundingBox.width / 2,
        toBoundingBox.height / 2,
      )(toPos)

      const radiusFrom = Math.hypot(fromBoundingBox.width, fromBoundingBox.height) / 2
      const radiusTo = Math.hypot(toBoundingBox.width, toBoundingBox.height) / 2
      const distanceVector = R.pipe(
        V.subtract(centerOfFrom),
      )(centerOfTo)
      const radiusDistanceVectorFrom = R.pipe(
        V.subtract(centerOfFrom),
        V.normalize,
        V.multiplyScalar(radiusFrom),
      )(centerOfTo)
      const radiusDistanceVectorTo = R.pipe(
        V.subtract(centerOfTo),
        V.normalize,
        V.multiplyScalar(radiusTo),
      )(centerOfFrom)
      return {
        from: R.pipe(
          V.add(radiusDistanceVectorFrom),
        )(centerOfFrom),
        to: R.pipe(
          V.add(radiusDistanceVectorTo),
        )(centerOfTo),
        // radiusFrom,
        // radiusTo,
        distanceVector,
      }
    },
    R.always({
      to: toPos,
      from: fromPos,
      // radiusTo: 50,
      // radiusFrom: 50,
      distanceVector: R.pipe(
        V.subtract(fromPos),
      )(toPos),
    }),
  )(directed)
  const unit = V.normalize(distanceVector)
  mutableInstance.clear()
  mutableInstance.lineStyle(width, fill, alpha)
  drawArrowHead({
    graphics: mutableInstance,
    unit,
    to,
    fill,
    ...arrowHead,
  })
  R.cond([
    [
      R.equals('bezier'),
      () => {
        const controlPoints = controlPointsCreator.bezier({
          from,
          to,
          count: 2,
          distance: 100,
          unit,
        })
        R.map(
          ({
            start,
            end,
            control1,
            control2,
          }: BezierLinePoints) => {
            mutableInstance.moveTo(start.x, start.y)
            mutableInstance.bezierCurveTo(
              control1.x, control1.y, control2.x, control2.y, end.x, end.y,
            )
          },
        )(controlPoints)
      },
    ],
    [
      R.equals('segments'),
      () => {
        const controlPoints = controlPointsCreator.bezier({
          from,
          to,
          count: 4,
          distance: 100,
          unit,
        })
        R.map(
          ({
            start,
            mid,
            end,
          }: BezierLinePoints) => {
            mutableInstance.moveTo(start.x, start.y)
            mutableInstance.lineTo(
              mid.x, mid.y,
            )
            mutableInstance.moveTo(mid.x, mid.y)
            mutableInstance.lineTo(
              end.x, end.y,
            )
          },
        )(controlPoints)
      },
    ],
    [
      R.T,
      () => {
        if (distance) {
          const controlPoints = controlPointsCreator.bezier({
            from,
            to,
            count: 1,
            distance,
            unit,
          })
          R.map(
            ({
              mid,
              start,
              end,
              upperVector,
              midVec,
            }: BezierLinePoints) => {
              mutableInstance.moveTo(start.x, start.y)
              mutableInstance.bezierCurveTo(
                start.x, start.y, mid.x, mid.y, end.x, end.y,
              )
            },
          )(controlPoints)
        } else {
          mutableInstance.moveTo(from.x, from.y)
          mutableInstance.lineTo(to.x, to.y)
        }
      },
    ],
  ])(type)
  mutableInstance.endFill()
  mutableInstance.zIndex = -100
}

// export const Graphics = PixiComponent<GraphicsProps, PIXI.Graphics>('PIXIGraphics', {
//   create: () => {
//     const mutableInstance = new PIXI.Graphics()
//     return mutableInstance
//   },
//   // applyProps: (mutableInstance, __, _props) => {
//   // },
// })

export { Graphics } from '@inlet/react-pixi'
