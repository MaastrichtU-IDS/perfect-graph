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
  const edgeID = item.id ?? R.uuid()
  const drawLineCallback = React.useCallback((element: EdgeElement) => {
    const targetElement = element.target()
    const sourceElement = element.source()
    const to = targetElement.position()
    const from = sourceElement.position()
    const midpoint = V.midpoint(from)(to)
    const sourceElementContext = getNodeContextByElement(sourceElement)
    const targetElementContext = getNodeContextByElement(targetElement)
    containerRef.current!.x = midpoint.x
    containerRef.current!.y = midpoint.y
    // calculate sortedIndex
    const betweenEdges = targetElement.edgesWith(sourceElement)
    const betweenEdgesCount = betweenEdges.length
    const betweenEdgesMedian = Math.ceil(betweenEdgesCount / 2)
    let edgeIndex = 0
    betweenEdges.forEach((edgeEl, i) => {
      if (edgeEl.id() === edgeID) {
        edgeIndex = i
      }
    })
    let sortedIndex = 0
    if (betweenEdgesCount > 1) {
      sortedIndex = edgeIndex > betweenEdgesMedian
        ? betweenEdgesMedian - edgeIndex
        : edgeIndex - betweenEdgesMedian
      if (betweenEdgesCount % 2 === 0 && sortedIndex >= 0) {
        sortedIndex += 1
      }
    }
    return drawLine({
      element,
      item,
      sourceElement,
      targetElement,
      graphics: graphicsRef.current!,
      to: targetElementContext.boundingBox,
      from: sourceElementContext.boundingBox,
      directed: true,
      distance: sortedIndex * 40,
      margin: {
        x: sortedIndex * 4,
        y: sortedIndex * 4,
      },
    })
  }, [containerRef, graphicsRef])
  const onPositionChange = React.useCallback(({ element }) => {
    drawLineCallback(element)
  }, [drawLineCallback])
  const { element } = useEdge({
    id: edgeID,
    source: item.source,
    target: item.target,
    graphID,
    onPositionChange,
  })
  React.useEffect(
    () => {
      // setTimeout(() => drawLineCallback(element), 2050)
      drawLineCallback(element)
    },
    [drawLineCallback],
  )
  const sourceElement = element.source()
  const targetElement = element.target()
  const to = element.target().position()
  const from = element.source().position()
  const midpoint = V.midpoint(from)(to)
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

