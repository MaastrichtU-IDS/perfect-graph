import React from 'react'
import { wrapComponent } from 'colay-ui'
import * as R from 'colay/ramda'
import Vector from 'victor'
import * as PIXI from 'pixi.js'
import { useTheme } from '@core/theme'
import { useEdge } from '@hooks'
import { contextUtils, calculateVisibilityByContext, vectorMidpoint } from '@utils'
import { EDGE_CONTAINER_Z_INDEX, CYTOSCAPE_EVENT } from '@constants'
import {
  RenderEdge,
  EdgeConfig,
  DrawLine,
  EdgeElement,
  NodeElement,
  GraphRef,
} from '@type'
import { Graphics, drawLine as defaultDrawLine } from '../Graphics'
import { Container, ContainerRef } from '../Container'

export type EdgeContainerProps = {
  children: RenderEdge;
  /**
   * Edge data
   */
  item: any;
  /**
   * Related graph id
   */
  graphID: string;
  /**
   * Related graph instance ref
   */
  graphRef: React.RefObject<GraphRef>;
  /**
   * Draw line function for edge connection vector
   */
  drawLine?: DrawLine;
  /**
   * Edge config data
   */
  config: EdgeConfig;
}

export type EdgeContainerType = React.FC<EdgeContainerProps>
const DEFAULT_DISTANCE = 36
const DEFAULT_MARGIN = 10

/**
 * The calculator for the edges connection info. 
 */
export const calculateEdgeGroupInfo = (edge: EdgeElement) => {
  const edgeID = edge.id()
  const targetElement = edge.target()
  const sourceElement = edge.source()
  const betweenEdges = targetElement.edgesWith(sourceElement)
  const betweenEdgesCount = betweenEdges.length
  const betweenEdgesMedian = Math.floor(betweenEdgesCount / 2)
  let edgeIndex = 0
  // @ts-ignore
  betweenEdges.some((edgeEl: EdgeElement, i) => {
    if (edgeEl.id() === edgeID) {
      edgeIndex = i
      return true
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

/**
 * The calculator for the edge connection vector. 
 */
export const calculateVectorInfo = (
  source: NodeElement,
  to: NodeElement,
) => {
  const fromPosition = Vector.fromObject(source.position())
  const toPosition = Vector.fromObject(to.position())
  const distanceVector = toPosition.clone().subtract(fromPosition)

  const unitVector = distanceVector.clone().normalize()
  const normVector = unitVector.clone().rotate(Math.PI / 2)
  const midpointPosition = vectorMidpoint(
    fromPosition,
    toPosition,
  )
  const sign = source.id() > to.id() ? 1 : -1
  return {
    fromPosition,
    toPosition,
    distanceVector,
    unitVector,
    normVector,
    midpointPosition,
    undirectedUnitVector: unitVector.clone().multiplyScalar(sign),
    undirectedNormVector: normVector.clone().multiplyScalar(sign),
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
    config,
    graphRef,
  } = props
  const theme = useTheme()
  const graphicsRef = React.useRef<PIXI.Graphics>(null)
  const containerRef = React.useRef<ContainerRef>(null)
  const drawLineCallback = React.useCallback(({
    element,
    cy,
    vectorInfo,
    edgeGroupInfo,
  }: {
    cy: cytoscape.Core;
    element: EdgeElement;
    vectorInfo: any;
    edgeGroupInfo: any;
  }) => {
    const targetElement = element.target()
    const sourceElement = element.source()
    const {
      distanceVector,
      // fromPosition,
      // toPosition,
      // midpointPosition,
      normVector,
      unitVector,
      undirectedUnitVector,
      undirectedNormVector,
    } = vectorInfo
    
    const sourceElementContext = contextUtils.getNodeContext(sourceElement)
    const targetElementContext = contextUtils.getNodeContext(targetElement)
    // calculate sortedIndex
    const {
      view: {
        lineType,
        fill,
        width,
        alpha,
      },
    } = config
    return drawLine({
      item,
      element,
      // cy,
      type: lineType,
      graphRef,
      theme,
      sourceElement,
      targetElement,
      fill: element.selected()
        ? fill.selected
        : (element.source().selected() || element.target().selected())
          ? fill.nodeSelected
          : fill.default,
      alpha,
      width,
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
  }, [containerRef, graphicsRef, config])
  const onPositionChange = React.useCallback(({ element }) => {
    const edgeGroupInfo = calculateEdgeGroupInfo(element)
    const vectorInfo = calculateVectorInfo(
      element.source(), 
      element.target(),
    )
    containerRef.current!.x = vectorInfo.midpointPosition.x + (
      edgeGroupInfo.sortedIndex * vectorInfo.undirectedNormVector.x * DEFAULT_DISTANCE
    )
    containerRef.current!.y = vectorInfo.midpointPosition.y + (
      edgeGroupInfo.sortedIndex * vectorInfo.undirectedNormVector.y * DEFAULT_DISTANCE
    )
    drawLineCallback({
      cy,
      element,
      edgeGroupInfo,
      vectorInfo,
    })
  }, [drawLineCallback])
  const { element, cy, context } = useEdge({
    graphID,
    onPositionChange,
    config,
    item,
  })
  // React.useEffect(() => {
  //   const sourceId = element.source().id()
  //   const targetId = element.target().id()
  //   cy.elements(`edge[source = "${sourceId}"][target = "${targetId}"], edge[source = "${targetId}"][target = "${sourceId}"]`)
  //     .on('add remove', (event)=>{
  //       console.log('ADD or REMOVE', event)
  //     })
  //   console.log('EDGE', cy.elements(`edge[source = "${sourceId}"][target = "${targetId}"], edge[source = "${targetId}"][target = "${sourceId}"]`))
  // }, [])
  React.useEffect(
    () => {
      containerRef.current!.zIndex = EDGE_CONTAINER_Z_INDEX
    },
    [],
  )
  const sourceElement = element.source()
  const targetElement = element.target()
  const edgeGroupInfo = calculateEdgeGroupInfo(element)
  const vectorInfo = calculateVectorInfo(
    sourceElement, 
    targetElement,
  )
  React.useEffect(
    () => {
      drawLineCallback({
        cy,
        element,
        edgeGroupInfo,
        vectorInfo,
      })
    },
  )
  const {
    // normVector,
    midpointPosition,
    toPosition,
    fromPosition,
    undirectedNormVector,
  } = vectorInfo
  const visible = calculateVisibilityByContext(element)
  const filtered = context.settings.filtered && context.settings.nodeFiltered
  const opacity = filtered
    ? 1
    : (config?.filter?.settings?.opacity ?? 0.2)

  
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
            config,
            context,
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


/**
 * The container for Edge Elements. It facilitates drawLine, visibility, and other
 * operations.
 */
export const EdgeContainer = wrapComponent<EdgeContainerProps>(
  EdgeContainerElement,
  {
    isForwardRef: true,
  },
)
