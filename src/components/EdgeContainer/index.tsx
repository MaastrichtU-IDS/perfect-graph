import React from 'react'
import { wrapComponent } from 'colay-ui'
import * as R from 'colay/ramda'
import Vector from 'victor'
import * as PIXI from 'pixi.js'
import { useTheme } from '@core/theme'
import { useEdge } from '@hooks'
import { contextUtils, calculateVisibilityByContext } from '@utils'
import { EDGE_CONTAINER_Z_INDEX, CYTOSCAPE_EVENT } from '@constants'
import {
  RenderEdge,
  EdgeConfig,
  DrawLine,
  EdgeElement,
  NodeElement,
  GraphRef,
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
  graphRef: React.RefObject<GraphRef>;
}

export type EdgeContainerType = React.FC<EdgeContainerProps>
const DEFAULT_DISTANCE = 36
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
    sortedIndex = R.range(-betweenEdgesMedian, betweenEdgesMedian + 1)[edgeIndex]
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
export const calculateVectorInfo = (
  source: NodeElement,
  to: NodeElement,
) => {
  const fromPosition = source.position()
  const toPosition = to.position()
  const distanceVector = Vector.fromObject(toPosition).subtract(fromPosition)
  // V.subtract(fromPosition)(toPosition)
  // const distanceVector = R.pipe(
  //   V.subtract(fromPosition),
  // )(toPosition)
  const unitVector = distanceVector.clone().normalize()
  // V.normalize(distanceVector)
  const normVector = unitVector.clone().rotate(Math.PI / 2)
  // V.rotate(Math.PI / 2)(unitVector)
  const midpointPosition = V.midpoint(fromPosition)(toPosition)
  const sign = source.id() > to.id() ? 1 : -1
  return {
    fromPosition,
    toPosition,
    distanceVector,
    unitVector,
    normVector,
    midpointPosition,
    undirectedUnitVector: unitVector.clone().multiplyScalar(sign),
    // V.multiplyScalar(sign)(unitVector),
    undirectedNormVector: normVector.clone().multiplyScalar(sign),
    // V.multiplyScalar(sign)(normVector),
  }
}
const EdgeContainerElement = (
  props: EdgeContainerProps,
  __: React.ForwardedRef<EdgeContainerType>,
) => {
  const {
    item,
    // item: _item,
    graphID,
    children,
    drawLine = defaultDrawLine,
    config = {},
    graphRef,
  } = props
  const theme = useTheme()
  const graphicsRef = React.useRef<PIXI.Graphics>(null)
  const containerRef = React.useRef<ContainerRef>(null)
  const drawLineCallback = React.useCallback(({
    element,
    cy,
  }: {
    cy: cytoscape.Core,
    element: EdgeElement,
  }) => {
    const targetElement = element.target()
    const sourceElement = element.source()
    const edgeGroupInfo = calculateEdgeGroupInfo(element)
    const {
      distanceVector,
      // fromPosition,
      // toPosition,
      midpointPosition,
      normVector,
      unitVector,
      undirectedUnitVector,
      undirectedNormVector,
    } = calculateVectorInfo(sourceElement, targetElement)
    containerRef.current!.x = midpointPosition.x + (
      edgeGroupInfo.sortedIndex * undirectedNormVector.x * DEFAULT_DISTANCE
    )
    containerRef.current!.y = midpointPosition.y + (
      edgeGroupInfo.sortedIndex * undirectedNormVector.y * DEFAULT_DISTANCE
    )
    const sourceElementContext = contextUtils.getNodeContext(sourceElement)
    const targetElementContext = contextUtils.getNodeContext(targetElement)
    // calculate sortedIndex
    return drawLine({
      item,
      element,
      // cy,
      graphRef,
      theme,
      sourceElement,
      targetElement,
      fill: element.selected()
        ? theme.palette.primary.main
        : (element.source().selected() || element.target().selected())
          ? theme.palette.secondary.main
          : theme.palette.background.paper,
      graphics: graphicsRef.current!,
      to: targetElementContext.boundingBox,
      from: sourceElementContext.boundingBox,
      directed: true,
      distance: edgeGroupInfo.sortedIndex * DEFAULT_DISTANCE,
      margin: {
        x: edgeGroupInfo.sortedIndex * DEFAULT_MARGIN,
        y: edgeGroupInfo.sortedIndex * DEFAULT_MARGIN,
      },
      distanceVector,
      unitVector,
      normVector,
      undirectedUnitVector,
      undirectedNormVector,
      ...edgeGroupInfo,
      cy,
    })
  }, [containerRef, graphicsRef])
  const onPositionChange = React.useCallback(({ element }) => {
    drawLineCallback({
      cy,
      element,
    })
  }, [drawLineCallback])
  const { element, cy, context } = useEdge({
    graphID,
    onPositionChange,
    config,
    item,
  })
  React.useEffect(
    () => {
      drawLineCallback({
        cy,
        element,
      })
    },
  )
  React.useEffect(
    () => {
      containerRef.current!.zIndex = EDGE_CONTAINER_Z_INDEX
    },
    [],
  )
  const edgeGroupInfo = calculateEdgeGroupInfo(element)
  const {
    // normVector,
    midpointPosition,
    toPosition,
    fromPosition,
    undirectedNormVector,
  } = calculateVectorInfo(element.source(), element.target())
  const visible = calculateVisibilityByContext(element)
  const filtered = context.settings.filtered && context.settings.nodeFiltered
  const opacity = filtered
    ? 1
    : (config?.filter?.settings?.opacity ?? 0.2)

  const targetElement = element.target()
  const sourceElement = element.source()

  return (
    <>
      <Container
        ref={containerRef}
        alpha={opacity}
        visible={visible}
        x={midpointPosition.x + (
          edgeGroupInfo.sortedIndex * undirectedNormVector.x * DEFAULT_DISTANCE
        )}
        y={midpointPosition.y + (
          edgeGroupInfo.sortedIndex * undirectedNormVector.y * DEFAULT_DISTANCE
        )}
        zIndex={EDGE_CONTAINER_Z_INDEX}
        interactive
        mouseover={() => {
          element.emit(CYTOSCAPE_EVENT.mouseover)
        }}
        mouseout={() => {
          element.emit(CYTOSCAPE_EVENT.mouseout)
        }}
      >
        {
          children({
            item,
            element,
            to: toPosition,
            from: fromPosition,
            cy,
            theme,
            graphRef,
            ...edgeGroupInfo,
            targetElement,
            sourceElement,
          })
        }
      </Container>
      <Graphics
        ref={graphicsRef}
        visible={visible}
        alpha={opacity}
        // interactive
        // buttonMode
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
