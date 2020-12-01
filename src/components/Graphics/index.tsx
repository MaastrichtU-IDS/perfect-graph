// @ts-nocheck
import { PixiComponent } from '@inlet/react-pixi'
import { Position, Size } from 'unitx-ui/type'
import { BoundingBox } from '@type'
import * as PIXI from 'pixi.js'
import * as R from 'unitx/ramda'
import * as V from 'unitx/vector'
import { THEME } from '@utils/constants'

export type GraphicsProps = {

}

const controlPointsCreator = {
  bezier: (config: {
    from: Position;
    to: Position;
    unit: Position;
    distance: number;
    count: number;
  }) => {
    const {
      from,
      to,
      distance,
      count,
      unit,
    } = config
    const upperNormVector = V.rotate(-Math.PI / 2)(unit)
    const upperVector = V.multiplyScalar(distance)(upperNormVector)
    const lowerVector = V.multiplyScalar(-1)(upperVector)
    const chunkDistanceVector = R.pipe(
      V.subtract(from),
      V.divideScalar(count),
    )(to)
    const semiChunkDistanceVector = V.divideScalar(2)(chunkDistanceVector)
    return R.mapIndexed(
      (_, index: number) => {
        const isUpper = index % 2
        const startVec = R.pipe(
          V.multiplyScalar(index),
          V.add(from),
        )(chunkDistanceVector)
        const midVec = R.pipe(
          V.add(semiChunkDistanceVector),
          V.add(isUpper ? upperVector : lowerVector),
        )(startVec)
        const endVec = V.add(startVec)(chunkDistanceVector)
        return [startVec, midVec, endVec]
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
  radius: number;
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
}

export const drawLine = (
  config: {
    from: BoundingBox;
    to: BoundingBox;
    fill?: number;
    directed?: boolean;
    graphics: PIXI.Graphics;
    type?: 'bezier' | 'segments' | 'straight';
  },
) => {
  const {
    from: fromBoundingBox,
    to: toBoundingBox,
    fill = THEME.fillColor,
    directed,
    type, //= 'bezier',
    graphics: mutableInstance,
  } = config
  const fromPos = {
    x: fromBoundingBox.x,
    y: fromBoundingBox.y,
  }
  const toPos = {
    x: toBoundingBox.x,
    y: toBoundingBox.y,
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
  // const midpoint = R.pipe(
  //   V.divideScalar(2),
  //   V.add(from),
  // )(distanceVector)
  const unit = V.normalize(distanceVector)
  mutableInstance.clear()
  mutableInstance.lineStyle(2, fill, 1)
  drawArrowHead({
    graphics: mutableInstance,
    unit,
    radius: 5,
    to,
    fill,
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
          ([start, mid, end]) => {
            mutableInstance.moveTo(start.x, start.y)
            mutableInstance.bezierCurveTo(
              start.x, start.y, mid.x, mid.y, end.x, end.y,
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
          ([start, mid, end]) => {
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
        mutableInstance.moveTo(from.x, from.y)
        mutableInstance.lineTo(to.x, to.y)
      },
    ],
  ])(type)
  mutableInstance.endFill()
  mutableInstance.zIndex = -100
}

const Graphics = PixiComponent<GraphicsProps, PIXI.Graphics>('PIXIGraphics', {
  create: () => {
    const mutableInstance = new PIXI.Graphics()
    return mutableInstance
  },
  applyProps: (mutableInstance, __, _props) => {
  },
})

export default Graphics
