import React from 'react'
import { useStateWithCallback } from 'unitx-ui/hooks'
import { NodeSingular } from 'cytoscape'
import { Position } from 'unitx/type'
import { ElementContext, NodeConfig } from '@type'
import { mutableGraphMap } from './useGraph'
import { useElement } from './useElement'

export type Props = {
  id: string;
  graphID: string;
  position: Position;
  onPositionChange?: (c: {element: NodeSingular; context: ElementContext }) => void|any;
  config?: NodeConfig;
}

type Result = {
  element: NodeSingular;
  context: ElementContext;
}

export default (props: Props): Result => {
  const {
    id,
    position,
    onPositionChange,
    graphID,
    config,
  } = props
  const cy = mutableGraphMap[graphID]
  const [, setState] = useStateWithCallback({}, () => {})
  const contextRef = React.useRef<ElementContext>({
    render: (callback: () => {}) => setState({}, callback),
  } as ElementContext)
  const element = React.useMemo(() => cy!.add({
    data: { id, context: contextRef.current }, // ...(parentID ? { parent: parentID } : {}),
    position: { ...position },
    group: 'nodes',
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }) as NodeSingular, [cy, id])
  React.useEffect(
    () => {
      element.on('position', () => {
        element.connectedEdges().forEach((mutableEdge) => {
          mutableEdge.data().onPositionChange()
        })
      onPositionChange?.({ element, context: contextRef.current })
      })
      return () => {
        cy!.remove(element!)
      }
    }, // destroy
    [cy, id],
  )
  useElement({
    contextRef,
    cy,
    element,
    config,
  })
  // // EventListeners
  // React.useEffect(
  //   () => {
  //     renderEvents.forEach((eventName) => {
  //       element.on(eventName, () => {
  //         contextRef.current.render()
  //       })
  //     })
  //     return () => {
  //       renderEvents.forEach((eventName) => {
  //         element.off(eventName)
  //       })
  //     }
  //   },
  //   [element, renderEvents],
  // )

  return {
    element,
    context: contextRef.current,
  }
}
