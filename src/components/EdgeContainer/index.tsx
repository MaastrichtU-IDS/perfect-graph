import React from 'react'
import { wrapComponent } from 'colay-ui'
import * as R from 'colay/ramda'
import { Position } from 'colay/type'
import { useEdge } from '@hooks'
import { getNodeContextByElement } from '@utils'
import {
  RenderEdge,
  EdgeConfig,
  DrawLine,
  EdgeElement,
} from '@type'
import * as V from 'colay/vector'
import { Graphics, drawLine as defaultDrawLine } from '../Graphics'
import { Container, ContainerRef } from '../Container'

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
  // @ts-ignore
)(to)

export type EdgeContainerType = React.FC<EdgeContainerProps>

const EdgeContainerElement = (
  props: EdgeContainerProps,
  __: React.ForwardedRef<EdgeContainerType>,
) => {
  const {
    item,
    graphID,
    children,
    drawLine = defaultDrawLine,
  } = props
  const graphicsRef = React.useRef<PIXI.Graphics>(null)
  const containerRef = React.useRef<ContainerRef>(null)
  const drawLineCallback = (element: EdgeElement) => {
    const targetElement = element.target()
    const sourceElement = element.source()
    const to = targetElement.position()
    const from = sourceElement.position()
    const midpoint = calculateMidpoint(from)(to)
    const sourceElementContext = getNodeContextByElement(sourceElement)
    const targetElementContext = getNodeContextByElement(targetElement)
    containerRef.current!.x = midpoint.x
    containerRef.current!.y = midpoint.y
    return drawLine({
      element,
      item,
      sourceElement,
      targetElement,
      graphics: graphicsRef.current!,
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

export const EdgeContainer = wrapComponent<EdgeContainerProps>(
  EdgeContainerElement,
  {
    isForwardRef: true,
  },
)
