import React from 'react'
import { useStateWithCallback } from 'unitx-ui/hooks'
import { NodeSingular } from 'cytoscape'
import { Position } from 'unitx/type'
import { Context, CytoscapeEvent } from '@type'
import { mutableGraphMap } from './useGraph'

export type Props = {
  id: string;
  graphID: string;
  position: Position;
  onPositionChange?: (c: {element: NodeSingular; context: Context }) => void|any;
  renderEvents?: CytoscapeEvent[];
}

type Result = {
  element: NodeSingular;
  context: Context;
}

export default (props: Props): Result => {
  const {
    id,
    position,
    onPositionChange,
    graphID,
    renderEvents = [],
  } = props
  const mutableCy = mutableGraphMap[graphID]
  const [, setState] = useStateWithCallback({}, () => {})
  const contextRef = React.useRef<Context>({
    render: (callback: () => {}) => setState({}, callback),
  } as Context)
  const mutableElement = React.useMemo(() => mutableCy!.add({
    data: { id, context: contextRef.current }, // ...(parentID ? { parent: parentID } : {}),
    position: { ...position },
    group: 'nodes',
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }) as NodeSingular, [mutableCy, id])
  React.useEffect(
    () => {
      mutableElement.on('position', () => {
        mutableElement.connectedEdges().forEach((mutableEdge) => {
          mutableEdge.data().onPositionChange()
        })
      onPositionChange?.({ element: mutableElement, context: contextRef.current })
      })
      return () => {
        mutableCy!.remove(mutableElement!)
      }
    }, // destroy
    [mutableCy, id],
  )

  // EventListeners
  React.useEffect(
    () => {
      renderEvents.forEach((eventName) => {
        mutableElement.on(eventName, () => {
          contextRef.current.render()
        })
      })
      return () => {
        renderEvents.forEach((eventName) => {
          mutableElement.off(eventName)
        })
      }
    },
    [mutableElement, renderEvents],
  )

  return {
    element: mutableElement,
    context: contextRef.current,
  }
}
