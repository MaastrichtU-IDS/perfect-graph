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
  NodeElement,
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
const DEFAULT_DISTANCE = 40
const DEFAULT_MARGIN = 10

export const calculateEdgeGroupInfo = (edge: EdgeElement) => {
  const edgeID = edge.id()
  const targetElement = edge.target()
  const sourceElement = edge.source()
  const betweenEdges = targetElement.edgesWith(sourceElement)
  const betweenEdgesCount = betweenEdges.length
  const betweenEdgesMedian = Math.floor(betweenEdgesCount / 2)
  let edgeIndex = 0
  betweenEdges.forEach((edgeEl, i) => {
    if (edgeEl.id() === edgeID) {
      edgeIndex = i
    }
  })
  let sortedIndex = 0
  if (betweenEdgesCount > 1) {
    sortedIndex = betweenEdgesMedian - edgeIndex
    // edgeIndex > betweenEdgesMedian
    //   ? betweenEdgesMedian - edgeIndex
    //   : edgeIndex - betweenEdgesMedian
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
export const calculateVectorInfo = (source: NodeElement, to: NodeElement, { sortedIndex }) => {
  const fromPosition = source.position()
  const toPosition = to.position()
  const distanceVector = R.pipe(
    V.subtract(fromPosition),
  )(toPosition)
  const unitVector = V.normalize(distanceVector)
  const normVector = V.multiplyScalar(sortedIndex > 0 ? 1 : -1)(V.rotate(Math.PI / 2)(unitVector))
  const midpointPosition = V.midpoint(fromPosition)(toPosition)
  return {
    fromPosition,
    toPosition,
    distanceVector,
    unitVector,
    normVector,
    midpointPosition,
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
    const {
      sortedIndex,
    } = calculateEdgeGroupInfo(element)
    const {
      distanceVector,
      // fromPosition,
      // toPosition,
      midpointPosition,
      normVector,
      unitVector,
    } = calculateVectorInfo(sourceElement, targetElement, { sortedIndex })

    containerRef.current!.x = midpointPosition.x - Math.abs(sortedIndex) * normVector.x * DEFAULT_DISTANCE
    containerRef.current!.y = midpointPosition.y - Math.abs(sortedIndex) * normVector.y * DEFAULT_DISTANCE
    const sourceElementContext = getNodeContextByElement(sourceElement)
    const targetElementContext = getNodeContextByElement(targetElement)
    // calculate sortedIndex
    return drawLine({
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
      distance: sortedIndex * DEFAULT_DISTANCE,
      margin: {
        x: -Math.abs(sortedIndex) * DEFAULT_MARGIN,
        y: -Math.abs(sortedIndex) * DEFAULT_MARGIN,
      },
      distanceVector,
      unitVector,
      normVector,
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
      drawLineCallback(element)
    },
  )
  const {
    sortedIndex,
  } = calculateEdgeGroupInfo(element)
  const {
    normVector,
    midpointPosition,
    toPosition,
    fromPosition,
  } = calculateVectorInfo(element.source(), element.target(), { sortedIndex })
  return (
    <>
      <Container
        ref={containerRef}
        style={{
          left: midpointPosition.x - Math.abs(sortedIndex) * normVector.x * DEFAULT_DISTANCE,
          top: midpointPosition.y - Math.abs(sortedIndex) * normVector.y * DEFAULT_DISTANCE,
        }}
      >
        {
          children({
            item,
            element,
            to: toPosition,
            from: fromPosition,
            cy,
            // ...edgeGroupInfo,
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
