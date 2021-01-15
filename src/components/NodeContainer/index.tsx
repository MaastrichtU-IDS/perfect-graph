import React from 'react'
import { wrapComponent } from 'unitx-ui'
import { useNode } from '@hooks'
import { RenderNode, NodeConfig } from '@type'
import { calculateDisplayObjectBounds } from '@utils'
import Container from '../Container'

export type NodeContainerProps = {
  children: RenderNode;
  item: any;
  graphID: string;
  config?: NodeConfig;
}

export type NodeContainerType = React.ForwardedRef<NodeContainerProps>

const NodeContainer = (
  props: NodeContainerProps,
  __: React.ForwardedRef<NodeContainerType>,
) => {
  const {
    item,
    graphID,
    children,
    config = {} as NodeConfig,
  } = props
  const containerRef = React.useRef(null)
  const { element, context } = useNode({
    id: item.id,
    graphID,
    config,
    position: config.position ?? item.position ?? { x: 0, y: 0 },
    onPositionChange: ({ element }) => {
      const { x, y } = element.position()
      // @ts-ignore
      containerRef.current.x = x
      // @ts-ignore
      containerRef.current.y = y
      context.boundingBox.x = x
      context.boundingBox.y = y
    },
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
    context.boundingBox = calculateDisplayObjectBounds(containerRef.current)
  })
  return (
    <Container
      ref={containerRef}
      style={{
        left: x,
        top: y,
      }}
      draggable
      onDrag={onDrag}
      // onRightPress={(event) => {
      //   console.log('rightPress')
      //   event.data.originalEvent.preventDefault()
      //   event.data.originalEvent.stopPropagation()
      // }}
      // onPress={(e) => console.log('press')}
    >
      {children({ item, element })}
    </Container>
  )
}

export default wrapComponent<NodeContainerProps>(
  NodeContainer,
  {
    isForwardRef: true,
  },
)
