import { Position } from 'colay-ui/type'
import { BoundingBox, NodeElement, EdgeConfig } from '@type'
import * as PIXI from 'pixi.js'
import {
  Graphics as ReactPIXIGraphics,
} from '@inlet/react-pixi'
import * as R from 'colay/ramda'
import { EDGE_LINE_Z_INDEX } from '@constants'
import Vector from 'victor'
// import { applyDefaultProps, preprocessProps } from '@utils'
// import React from 'react'
// import { wrapComponent } from 'colay-ui'
// import {
//   PixiComponent,
// } from '@inlet/react-pixi'

export type GraphicsProps = {

}

type BezierLinePoints = {
  start: Position;
  mid: Position;
  end: Position;
}
const controlPointsCreator = {
  bezier: (config: {
    from: Vector;
    to: Vector;
    unitVector: Position;
    distance: number;
    count: number;
    normVector: Vector;
  }): BezierLinePoints[] => {
    const {
      from,
      to,
      distance,
      count,
      normVector,
    } = config
    const upperVector = normVector.clone().multiplyScalar(distance)
    const lowerVector = upperVector.clone().multiplyScalar(-1)
    const chunkDistanceVector = to.clone().subtract(from).divideScalar(count)
    const semiChunkDistanceVector = chunkDistanceVector.clone().divideScalar(2)
    return R.range(0, count).map(
      (_, index: number) => {
        const isUpper = index % 2 === 0
        const startVec = chunkDistanceVector.clone().multiplyScalar(index).add(from)
        const endVec = chunkDistanceVector.clone().add(startVec)
        const midVec = startVec.clone().add(
          isUpper ? upperVector : lowerVector,
        ).add(semiChunkDistanceVector)
        return {
          start: startVec,
          mid: midVec,
          end: endVec,
          upperVector,
          midVec: semiChunkDistanceVector.clone().add(startVec),
        }
      },
    )
  },
}
const drawArrowHead = ({
  graphics,
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
  const bottomCenter = Vector.fromObject(to)
  const unitDistanceVec = Vector.fromObject(unitVector).multiplyScalar(radius)
  const perpendicularUnitDistanceVec = unitDistanceVec.clone().rotate(-Math.PI / 2)
  const leftControlPoint = perpendicularUnitDistanceVec
    .clone()
    .multiplyScalar(-1)
    .add(bottomCenter)
  const rightControlPoint = perpendicularUnitDistanceVec.clone().add(bottomCenter)
  const topControlPoint = bottomCenter.clone().add(unitDistanceVec)
  graphics.beginFill(fill)
  graphics.drawPolygon(
    new PIXI.Point(leftControlPoint.x, leftControlPoint.y),
    new PIXI.Point(rightControlPoint.x, rightControlPoint.y),
    new PIXI.Point(topControlPoint.x, topControlPoint.y),
  )
  // TODO: Dont remove the endFill
  graphics.endFill()
  // TODO: Check the performance effect of this later
  // graphics.isSprite = true
}
export const drawLine = (
  config: {
    graphics: PIXI.Graphics;
    sourceElement: NodeElement;
    targetElement: NodeElement;
    from: BoundingBox;
    to: BoundingBox;
    unitVector: Vector;
    distanceVector: Position;
    normVector: Position;
    undirectedUnitVector:Position;
    undirectedNormVector:Vector;
    fill?: number;
    directed?: boolean;
    type?: 'bezier' | 'segments' | 'straight';
    width?: number;
    alpha?: number;
    arrowHead?: {
      radius?: number;
    };
    distance?: number;
    margin?: Position;
    config: EdgeConfig;
  },
) => {
  const {
    from: fromBoundingBox,
    to: toBoundingBox,
    directed,
    type,
    graphics,
    arrowHead = {
      radius: 2,
    },
    distance,
    margin = {
      x: 0,
      y: 0,
    },
    unitVector,
    undirectedUnitVector,
    undirectedNormVector,
    width,
    fill,
    alpha,
    // distanceVector,
  } = config
  const marginVector = Vector.fromObject({
    x: undirectedNormVector.x * margin.x,
    y: undirectedNormVector.y * margin.y,
  })
  const radiusFrom = Math.hypot(fromBoundingBox.width, fromBoundingBox.height) / 2
  const radiusTo = Math.hypot(toBoundingBox.width, toBoundingBox.height) / 2
  const centerOfFrom = Vector.fromObject(fromBoundingBox).add(
    new Vector(
      fromBoundingBox.width / 2,
      fromBoundingBox.height / 2,
    ),
  )
  const centerOfTo = Vector.fromObject(toBoundingBox).add(
    new Vector(
      toBoundingBox.width / 2,
      toBoundingBox.height / 2,
    ),
  )
  const from = centerOfFrom.clone()
    .add(unitVector.clone().multiplyScalar(radiusFrom))
    .add(marginVector)
  const to = centerOfTo.clone()
    .subtract(unitVector.clone().multiplyScalar(radiusTo))
    .add(marginVector)
  graphics.clear()
  graphics.lineStyle(( width as number), fill, alpha)

  if (directed) {
    drawArrowHead({
      graphics,
      unitVector,
      to,
      fill: fill!,
      ...arrowHead,
    })
  }
  switch (type) {
    case 'bezier':{
      const controlPoints = controlPointsCreator.bezier({
        from,
        to,
        count: 2,
        distance: 100,
        unitVector: undirectedUnitVector,
        normVector: undirectedNormVector,
      })
      controlPoints.map(
        ({
          start,
          end,
          // control1,
          // control2,
          // midVec,
          mid,
        }: BezierLinePoints) => {
          graphics.moveTo(start.x, start.y)
          graphics.bezierCurveTo(
            start.x, start.y, mid.x, mid.y, end.x, end.y,
          )
        },
      )
      break
    }
    case 'segments': {
      const controlPoints = controlPointsCreator.bezier({
        from,
        to,
        count: 4,
        distance: 100,
        unitVector: undirectedUnitVector,
        normVector: undirectedNormVector,
      })
      controlPoints.map(
        ({
          start,
          mid,
          end,
        }: BezierLinePoints) => {
          graphics.moveTo(start.x, start.y)
          graphics.lineTo(
            mid.x, mid.y,
          )
          graphics.moveTo(mid.x, mid.y)
          graphics.lineTo(
            end.x, end.y,
          )
        },
      )
      break
    }
      
  
    default:{
      if (distance) {
        const controlPoints = controlPointsCreator.bezier({
          from,
          to,
          count: 1,
          distance,
          unitVector: undirectedUnitVector,
          normVector: undirectedNormVector,
        })
        controlPoints.map(
          ({
            mid,
            start,
            end,
          }: BezierLinePoints) => {
            graphics.moveTo(start.x, start.y)
            graphics.bezierCurveTo(
              start.x, start.y, mid.x, mid.y, end.x, end.y,
            )
          },
        )
      } else {
        graphics.moveTo(from.x, from.y)
        graphics.lineTo(to.x, to.y)
      }
      break
    }
  }
  graphics.endFill()
  graphics.zIndex = EDGE_LINE_Z_INDEX
}

export const drawGraphics = (instance: PIXI.Graphics, props: {
  width?: number;
  height?: number;
  fill?: number;
  radius?: number;
  lineWidth?: number;
  lineFill?: number;
  alpha?: number;
}) => {
  const {
    width = 0,
    height = 0,
    fill,
    radius = 0,
    lineWidth = 0,
    lineFill,
    alpha = 1,
  } = props
  if (fill || lineFill) {
    instance.clear()
    instance.beginFill(fill, alpha)
    instance.lineStyle(lineWidth, lineFill)
    const maxRadius = width / 2
    if ((width === height) && (radius >= maxRadius)) {
      instance.drawCircle(maxRadius, maxRadius, maxRadius)
    } else {
      instance.drawRoundedRect(0, 0, width, height, radius)
    }
    instance.endFill()
  }
}

// // @ts-ignore
// const GraphicsPIXI = PixiComponent<GraphProps, PIXI.Graphics>('Graphics2', {
//   create: (props: GraphProps) => {
//     const instance = new PIXI.Graphics()
//     return instance
//   },
//   applyProps: (mutableInstance: PIXI.Graphics, oldProps, _props) => {
//     const props = preprocessProps(_props)

//     applyDefaultProps(mutableInstance, oldProps, props)
//   },
// })

// function GraphicsElement(props: GraphProps, forwardRef: any) {
//   return (
//     <GraphicsPIXI
//       ref={forwardRef}
//       {...props}
//     />
//   )
// }

export const Graphics = ReactPIXIGraphics
// wrapComponent<GraphProps>(
//   GraphicsElement, {
//     isForwardRef: true,
//   },
// )
