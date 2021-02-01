import React from 'react'
import { wrapComponent } from 'colay-ui'
import * as R from 'colay/ramda'
import * as C from 'colay/color'
import { useTheme } from '@core/theme'
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

const calculateEdgeGroupInfo = (edge: EdgeElement) => {
  const edgeID = edge.id()
  const targetElement = edge.target()
  const sourceElement = edge.source()
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
  return {
    sortedIndex,
    index: edgeIndex,
    count: betweenEdgesCount,
  }
}
const EdgeContainerElement = (
  props: EdgeContainerProps,
  __: React.ForwardedRef<EdgeContainerType>,
) => {
  const {
    item,
    graphID,
    children,
    drawLine = defaultDrawLine,
    config,
  } = props
  const theme = useTheme()
  const graphicsRef = React.useRef<PIXI.Graphics>(null)
  const containerRef = React.useRef<ContainerRef>(null)
  const edgeID = React.useMemo(() => item.id ?? R.uuid(), [])
  item.id = edgeID
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
    const {
      sortedIndex,
    } = calculateEdgeGroupInfo(element)
    const sourceID = sourceElement.id()
    const targetID = targetElement.id()
    const sign = sourceID > targetID ? -1 : 1
    console.log(element.source().id(), sortedIndex)
    return drawLine({
      element,
      item,
      sourceElement,
      targetElement,
      fill: C.rgbNumber(
        element.selected()
          ? theme.palette.primary.main
          : (element.source().selected() || element.target().selected())
            ? theme.palette.secondary.main
            : theme.palette.background.paper,
      ),
      graphics: graphicsRef.current!,
      to: targetElementContext.boundingBox,
      from: sourceElementContext.boundingBox,
      directed: true,
      distance: sortedIndex * 40,
      margin: {
        x: sign * sortedIndex * 4,
        y: sign * sortedIndex * 4,
      },
    })
  }, [containerRef, graphicsRef])
  const onPositionChange = React.useCallback(({ element }) => {
    drawLineCallback(element)
  }, [drawLineCallback])
  const { element, cy } = useEdge({
    id: edgeID,
    source: item.source,
    target: item.target,
    graphID,
    onPositionChange,
    config,
  })
  React.useEffect(
    () => {
      // setTimeout(() => drawLineCallback(element), 2050)
      drawLineCallback(element)
    },
  )
  // React.useEffect(() => {
  //   graphicsRef.current!.interactive = true
  //   graphicsRef.current!.buttonMode = true
  //   const onTap = () => {
  //     console.log('onTapEdge')
  //   }
  //   graphicsRef.current?.on('click', onTap)
  //   graphicsRef.current?.on('pointertap', onTap)
  //   graphicsRef.current?.on('tap', onTap)
  //   return () => {
  //     graphicsRef.current?.off('pointertap', onTap)
  //   }
  // }, [])
  const sourceElement = element.source()
  const targetElement = element.target()
  const to = element.target().position()
  const from = element.source().position()
  const midpoint = V.midpoint(from)(to)
  const edgeGroupInfo = calculateEdgeGroupInfo(element)
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
            cy,
            ...edgeGroupInfo,
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
