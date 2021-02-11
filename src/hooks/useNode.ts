import React from 'react'
import { useStateWithCallback } from 'colay-ui'
import { NodeSingular, Core } from 'cytoscape'
import { Position } from 'colay/type'
import {
  NodeContext, NodeConfig, Cluster, ElementSettings,
} from '@type'
import { getClusterVisibility } from '@utils'
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
  const clusters = isCluster
    ? clustersByChildClusterId[id]
    : clustersByNodeId[id]
  const [, setState] = useStateWithCallback({}, () => {})
  const contextRef = React.useRef<NodeContext>({
    render: (callback: () => {}) => setState({}, callback),
    boundingBox: DEFAULT_BOUNDING_BOX,
    settings: {
      visibility: {
        cluster: getClusterVisibility(id, clusters),
        filter: true,
      },
    },
  } as NodeContext)
  const element = React.useMemo(() => cy!.add({
    data: {
      id,
      context: contextRef.current,
    }, // ...(parentID ? { parent: parentID } : {}),
    position: { ...position },
    group: 'nodes',
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }) as NodeSingular, [cy, id])
  React.useEffect(
    () => {
      const positionChanged = () => {
        element.connectedEdges().forEach((mutableEdge) => {
          mutableEdge.data().onPositionChange()
        })
        onPositionChange?.({ element, context: contextRef.current })
      }
      element.on('position', positionChanged)
      return () => {
        element.off('position', `#${element.id()}`, positionChanged)
        cy!.remove(element!)
      }
    }, // destroy
    [cy, id],
  )
  React.useEffect(() => {
    element.position(position)
  }, [position.x, position.y])

  // Update Visibility
  React.useMemo(() => {
    const clusterVisibility = getClusterVisibility(element.id(), clusters)
    if (clusterVisibility !== contextRef.current.settings.visibility.cluster) {
      contextRef.current.settings.visibility.cluster = clusterVisibility
      // contextRef.current.settings = {
      //   ...contextRef.current.settings,
      //   visibility,
      // }
      element.data({
        context: contextRef.current,
      })
      contextRef.current.render()
    }
  }, [element, clusters])
  useElement({
    contextRef,
    cy,
    element,
    config,
  })
  return {
    element,
    context: contextRef.current,
    clusters,
    cy,
  }
}
