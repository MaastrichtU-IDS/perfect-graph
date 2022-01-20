import React from 'react'
import { wrapComponent } from 'colay-ui'
import { useNode } from '@hooks'
import { CYTOSCAPE_EVENT } from '@constants'
import {
  RenderNode, NodeConfig, GraphRef,
} from '@type'
import {
  calculateObjectBoundsWithoutChildren,
  calculateVisibilityByContext,
  isFiltered,
} from '@utils'
import { useTheme } from '@core/theme'
import { Container } from '../Container'

export type NodeContainerProps = {
  children: RenderNode;
  /**
   * Node data
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
   * Node config data
   */
  config: NodeConfig;
}

export type NodeContainerType = React.ForwardedRef<NodeContainerProps>
const DEFAULT_POSITION = { x: 0, y: 0 }
const NodeContainerElement = (
  props: NodeContainerProps,
  __: React.ForwardedRef<NodeContainerType>,
) => {
  const {
    item,
    graphID,
    children,
    config,
    graphRef,
  } = props
  const containerRef = React.useRef(null)
  const { element, context, cy } = useNode({
    graphID,
    config,
    position: config.position ?? item.position ?? DEFAULT_POSITION,
    onPositionChange: ({ element }) => {
      const { x, y } = element.position()
      // @ts-ignore
      containerRef.current.x = x
      // @ts-ignore
      containerRef.current.y = y
      context.boundingBox.x = x
      context.boundingBox.y = y
    },
    item,
  })
  const { x, y } = element.position()
  const onDrag = React.useCallback(
    (pos) => {
      element.position(pos)
    },
    [element],
  )
  React.useEffect(() => {
    // @ts-ignore
    context.boundingBox = calculateObjectBoundsWithoutChildren(
      containerRef.current!,
    )
  })
  const theme = useTheme()
  const visible = calculateVisibilityByContext(element)
  const opacity = isFiltered(element)
    ? 1
    : (config.filter?.settings?.opacity ?? 0.2)
  return (
    <Container
      ref={containerRef}
      x={x}
      y={y}
      alpha={opacity}
      visible={visible}
      draggable
      onDrag={onDrag}
      mouseover={() => {
        element.emit(CYTOSCAPE_EVENT.mouseover)
      }}
      mouseout={() => {
        element.emit(CYTOSCAPE_EVENT.mouseout)
      }}
      // onRightPress={(event) => {
      //   event.data.originalEvent.preventDefault()
      //   event.data.originalEvent.stopPropagation()
      // }}
    >
      {children({
        item,
        element,
        cy,
        theme,
        graphRef,
        context,
        config,
        label: item.id,
      })}
    </Container>
  )
}

/**
 * The container for Node Elements. It facilitates drag, visibility, and other
 * operations.
 */
export const NodeContainer = wrapComponent<NodeContainerProps>(
  NodeContainerElement,
  {
    isForwardRef: true,
  },
)
