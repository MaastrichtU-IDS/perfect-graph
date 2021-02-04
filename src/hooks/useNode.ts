import React from 'react'
import { useStateWithCallback } from 'colay-ui'
import { NodeSingular, Core } from 'cytoscape'
import { Position } from 'colay/type'
import { NodeContext, NodeConfig, Cluster } from '@type'
import { mutableGraphMap } from './useGraph'
import { useElement } from './useElement'

export type Props = {
  id: string;
  graphID: string;
  position: Position;
  isCluster?: boolean;
  onPositionChange?: (c: {element: NodeSingular; context: NodeContext }) => void|any;
  config?: NodeConfig;
}

type Result = {
  element: NodeSingular;
  context: NodeContext;
  clusters?: Cluster[];
  cy: Core;
}

const DEFAULT_BOUNDING_BOX = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

export default (props: Props): Result => {
  const {
    id,
    position,
    onPositionChange,
    graphID,
    config,
    isCluster = false,
  } = props
  const { cy, clustersByNodeId, clustersByChildClusterId } = mutableGraphMap[graphID]
  const clustersById = isCluster
    ? clustersByChildClusterId[id]
    : clustersByNodeId[id]
  const [, setState] = useStateWithCallback({}, () => {})
  const contextRef = React.useRef<NodeContext>({
    render: (callback: () => {}) => setState({}, callback),
    boundingBox: DEFAULT_BOUNDING_BOX,
  } as NodeContext)
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
  React.useEffect(() => {
    element.position(position)
  }, [position.x, position.y])
  useElement({
    contextRef,
    cy,
    element,
    config,
  })
  return {
    element,
    context: contextRef.current,
    clusters: clustersById,
    cy,
  }
}
