import { Position } from 'colay-ui/type'
import { BoundingBox, NodeElement } from '@type'
import * as PIXI from 'pixi.js'
import * as R from 'colay/ramda'
import * as V from 'colay/vector'
import * as C from 'colay/color'
import { DefaultTheme } from '@core/theme'
import { EDGE_LINE_Z_INDEX } from '@utils/constants'

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
    unitVector: Position;
    distance: number;
    count: number;
    normVector: Position;
  }): BezierLinePoints[] => {
    const {
      from,
      to,
      distance,
      count,
      unitVector,
      normVector,
    } = config
    const upperVector = V.multiplyScalar(distance)(normVector)
    const lowerVector = V.multiplyScalar(-1)(upperVector)
    const chunkDistanceVector = R.pipe(
      V.subtract(from),
      V.divideScalar(count),
    )(to)
    const semiChunkDistanceVector = V.divideScalar(2)(chunkDistanceVector)
    return R.mapIndexed(
      (_, index: number) => {
        const isUpper = index % 2 === 0
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
  unitVector,
  fill,
}: {
  graphics: PIXI.Graphics;
  unitVector: Position;
  to: Position;
  radius?: number;
  fill: number;
}) => {
  const bottomCenter = to
  const unitDistanceVec = V.multiplyScalar(radius)(unitVector)
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
    sourceElement: NodeElement;
    targetElement: NodeElement;
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
    margin?: Position;
    unitVector: Position;
    distanceVector: Position;
    normVector: Position;
    undirectedUnitVector:Position;
    undirectedNormVector:Position;
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
    unitVector,
    normVector,
    undirectedUnitVector,
    undirectedNormVector,
    // distanceVector,
  } = config
  const marginVector = {
    x: undirectedNormVector.x * margin.x,
    y: undirectedNormVector.y * margin.y,
  }
  const radiusFrom = Math.hypot(fromBoundingBox.width, fromBoundingBox.height) / 2
  const radiusTo = Math.hypot(toBoundingBox.width, toBoundingBox.height) / 2
  const centerOfFrom = V.add(
    fromBoundingBox.width / 2,
    fromBoundingBox.height / 2,
  )(fromBoundingBox)
  const centerOfTo = V.add(
    toBoundingBox.width / 2,
    toBoundingBox.height / 2,
  )(toBoundingBox)
  const from = R.pipe(
    V.add(V.multiplyScalar(radiusFrom)(unitVector)),
    V.add(marginVector),
  )(centerOfFrom)
  const to = R.pipe(
    V.subtract(V.multiplyScalar(radiusTo)(unitVector)),
    V.add(marginVector),
  )(centerOfTo)
  mutableInstance.clear()
  mutableInstance.lineStyle(width, fill, alpha)

  if (directed) {
    drawArrowHead({
      graphics: mutableInstance,
      unitVector,
      to,
      fill,
      ...arrowHead,
    })
  }

  R.cond([
    [
      R.equals('bezier'),
      () => {
        const controlPoints = controlPointsCreator.bezier({
          from,
          to,
          count: 2,
          distance: 100,
          unitVector: undirectedUnitVector,
          normVector: undirectedNormVector,
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
          unitVector: undirectedUnitVector,
          normVector: undirectedNormVector,
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
            unitVector: undirectedUnitVector,
            normVector: undirectedNormVector,
          })
          R.map(
            ({
              mid,
              start,
              end,
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
  mutableInstance.zIndex = EDGE_LINE_Z_INDEX
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
