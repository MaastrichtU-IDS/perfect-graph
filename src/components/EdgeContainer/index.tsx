// @ts-nocheck
import React from 'react'
import { wrapComponent } from 'unitx-ui'
import { ForwardRef } from 'unitx-ui/type'
import * as R from 'unitx/ramda'
import { Position } from 'unitx/type'
import { useEdge } from '@hooks'
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

function EdgeContainer(props: EdgeContainerProps, __: ForwardRef<typeof EdgeContainer>) {
  const {
    item,
    graphID,
    children,
    drawLine,
  } = props
  const graphicsRef = React.useRef<PIXI.Graphics>(null)
  const containerRef = React.useRef<PIXI.DisplayObject>(null)
  const onPositionChange = React.useCallback(({ element }) => {
    const targetElement = element.target()
    const sourceElement = element.source()
    const to = targetElement.position()
    const from = sourceElement.position()
    const midpoint = calculateMidpoint(from)(to)
    containerRef.current.x = midpoint.x
    containerRef.current.y = midpoint.y
    return R.ifElse(
      R.isNotNil,
      () => drawLine?.({
        element,
        item,
        sourceElement,
        targetElement,
        graphics: graphicsRef.current,
        to,
        from,
      }),
      () => defaultDrawLine({
        to,
        from,
        box: {
          width: 100,
          height: 100,
        },
        graphics: graphicsRef.current,
        directed: true,
      }),
    )(drawLine)
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
      R.ifElse(
        R.isNotNil,
        () => drawLine?.({
          element,
          item,
          sourceElement,
          targetElement,
          graphics: graphicsRef.current,
          to,
          from,
        }),
        () => defaultDrawLine({
          to,
          from,
          box: {
            width: 100,
            height: 100,
          },
          graphics: graphicsRef.current,
          directed: true,
        }),
      )(drawLine)
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
