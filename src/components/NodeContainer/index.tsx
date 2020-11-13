import React from 'react'
import { wrapComponent } from 'unitx-ui'
import { ForwardRef } from 'unitx-ui/type'
import { useNode } from '@hooks'
import { RenderNode, NodeConfig } from '@type'
import Container from '../Container'

export type NodeContainerProps = {
  children: RenderNode;
  item: any;
  graphID: string;
  config?: NodeConfig;
}

function NodeContainer(props: NodeContainerProps, __: ForwardRef<typeof NodeContainer>) {
  const {
    item,
    graphID,
    children,
    config = {} as NodeConfig,
  } = props
  const containerRef = React.useRef(null)
  const { element } = useNode({
    id: item.id,
    graphID,
    config,
    position: config.position ?? item.position ?? { x: 0, y: 0 },
    // onPositionChange: ({ element }) => {
    //   const { x, y } = element.position()
    //   containerRef.current.x = x
    //   containerRef.current.y = y
    // },
  })
  const { x, y } = element.position()
  const onDrag = React.useCallback(
    (pos) => {
      element.position(pos)
    },
    [element],
  )
  console.log('RenderNode: ', item.id, element.data('label'))
  return (
    <Container
      ref={containerRef}
      style={{
        left: x,
        top: y,
      }}
      draggable
      onDrag={onDrag}
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
