// @ts-nocheck
import React from 'react'
import { wrapComponent } from 'unitx-ui'
import { ForwardRef } from 'unitx-ui/type'
import * as R from 'unitx/ramda'
import { Position } from 'unitx/type'
import { useEdge } from '@hooks'
import { getNodeContextByElement } from '@utils'
import {
  RenderEdge,
  EdgeConfig,
  DrawLine,
} from '@type'
import * as V from 'unitx/vector'
import Graphics, { drawLine as defaultDrawLine } from '../Graphics'
import Container from '../Container'

export type EdgeContainerProps = {
  children: RenderEdge;
  item: any;
  graphID: string;
  drawLine?: DrawLine;
  config?: EdgeConfig;
}

const calculateMidpoint = (from: Position) => (to: Position) => R.pipe(
  V.subtract(from),
  V.divideScalar(2),
  V.add(from),
)(to)

const DEFAULT_BOX = {
  width: 90,
  height: 90,
}

function EdgeContainer(props: EdgeContainerProps, __: ForwardRef<typeof EdgeContainer>) {
  const {
    item,
    graphID,
    children,
    drawLine = defaultDrawLine,
  } = props
  const graphicsRef = React.useRef<PIXI.Graphics>(null)
  const containerRef = React.useRef<PIXI.DisplayObject>(null)
  const drawLineCallback = (element: Element) => {
    const targetElement = element.target()
    const sourceElement = element.source()
    const to = targetElement.position()
    const from = sourceElement.position()
    const midpoint = calculateMidpoint(from)(to)
    const sourceElementContext = getNodeContextByElement(sourceElement)
    const targetElementContext = getNodeContextByElement(targetElement)
    containerRef.current.x = midpoint.x
    containerRef.current.y = midpoint.y
    return drawLine({
      element,
      item,
      sourceElement,
      targetElement,
      graphics: graphicsRef.current,
      to: targetElementContext.boundingBox,
      from: sourceElementContext.boundingBox,
      directed: true,
    })
  }
  const onPositionChange = React.useCallback(({ element }) => {
    drawLineCallback(element)
    // R.ifElse(
    //   R.isNotNil,
    //   () => drawLine?.({
    // element,
    // item,
    // sourceElement,
    // targetElement,
    // graphics: graphicsRef.current,
    // to: targetElementContext.boundingBox,
    // from: sourceElementContext.boundingBox,
    //   }),
    //   () => defaultDrawLine({
    //     to: targetElementContext.boundingBox,
    //     from: sourceElementContext.boundingBox,
    //     graphics: graphicsRef.current,
    //     directed: true,
    //   }),
    // )(drawLine)
  }, [drawLine])
  const { element } = useEdge({
    id: item.id,
    source: item.source,
    target: item.target,
    graphID,
    onPositionChange,
  })
  React.useEffect(
    () => {
      drawLineCallback(element)
    },
    [drawLine],
  )
  const sourceElement = element.source()
  const targetElement = element.target()
  const to = element.target().position()
  const from = element.source().position()
  const midpoint = calculateMidpoint(from)(to)
  return (
    <>
      <Container
        ref={containerRef}
        style={{
          left: midpoint.x,
          top: midpoint.y,
        }}
      >
        {
          children({
            item,
            element,
            sourceElement,
            targetElement,
            to,
            from,
          })
        }
      </Container>
      <Graphics
        ref={graphicsRef}
      />
    </>
  )
}

export default wrapComponent<EdgeContainerProps>(
  EdgeContainer,
  {
    isForwardRef: true,
  },
)
