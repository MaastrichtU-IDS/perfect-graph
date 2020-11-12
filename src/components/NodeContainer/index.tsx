import React from 'react'
import { wrapComponent } from 'unitx-ui'
import { ForwardRef, Position } from 'unitx-ui/type'
import { useNode } from '@hooks'
import { RenderNode } from '@type'
import Container from '../Container'

export type NodeContainerProps = {
  children: RenderNode;
  item: any;
  graphID: string;
  position?: Position;
}

function NodeContainer(props: NodeContainerProps, __: ForwardRef<typeof NodeContainer>) {
  const {
    item,
    graphID,
    children,
    position = item.position ?? { x: 0, y: 0 },
  } = props
  const containerRef = React.useRef(null)
  const { element } = useNode({
    id: item.id,
    position,
    graphID,
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
