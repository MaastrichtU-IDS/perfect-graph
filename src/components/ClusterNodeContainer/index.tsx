import React from 'react'
import { wrapComponent } from 'colay-ui'
import { useNode } from '@hooks'
import {
  RenderNode, NodeConfig, GraphRef,
} from '@type'
import {
  calculateObjectBoundsWithoutChildren,
  calculateVisibilityByContext,
} from '@utils'
import { useTheme } from '@core/theme'
import { Container } from '../Container'

export type ClusterNodeContainerProps = {
  children: RenderNode;
  item: any;
  graphID: string;
  graphRef: React.RefObject<GraphRef>;
  config?: NodeConfig;

}

export type ClusterNodeContainerType = React.ForwardedRef<ClusterNodeContainerProps>

const DEFAULT_POSITION = { x: 0, y: 0 }
const ClusterNodeContainerElement = (
  props: ClusterNodeContainerProps,
  __: React.ForwardedRef<ClusterNodeContainerType>,
) => {
  const {
    item,
    graphID,
    children,
    config = {} as NodeConfig,
    graphRef,
  } = props
  const containerRef = React.useRef(null)
  const { element, context, cy } = useNode({
    id: item.id,
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
      containerRef.current,
    )
  })
  const theme = useTheme()
  const visible = calculateVisibilityByContext(context)
  const opacity = context.settings.filtered
    ? 1
    : (config.filter?.settings?.opacity ?? 0.2)
  return (
    <Container
      ref={containerRef}
      style={{
        left: x,
        top: y,
      }}
      alpha={opacity}
      visible={visible}
      draggable
      onDrag={onDrag}
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
      })}
    </Container>
  )
}

export const ClusterNodeContainer = wrapComponent<ClusterNodeContainerProps>(
  ClusterNodeContainerElement,
  {
    isForwardRef: true,
  },
)
