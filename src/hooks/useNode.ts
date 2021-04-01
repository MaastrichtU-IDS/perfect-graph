import React from 'react'
import { useStateWithCallback } from 'colay-ui'
import { NodeSingular, Core } from 'cytoscape'
import { Position } from 'colay/type'
import {
  NodeContext,
  NodeConfig,
  Cluster,
  NodeData,
} from '@type'
import { getClusterVisibility, calculateVisibilityByContext, contextUtils } from '@utils'
import { CYTOSCAPE_EVENT, ELEMENT_DATA_FIELDS } from '@utils/constants'
import { mutableGraphMap } from './useGraph'
import { useElement } from './useElement'

export type Props = {
  id: string;
  graphID: string;
  position: Position;
  isCluster?: boolean;
  onPositionChange?: (c: {element: NodeSingular; context: NodeContext }) => void|any;
  config?: NodeConfig;
  item?: NodeData;
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
    item,
    isCluster = false,
  } = props
  const { cy, clustersByNodeId, clustersByChildClusterId } = mutableGraphMap[graphID]
  const clusters = isCluster
    ? clustersByChildClusterId[id]
    : clustersByNodeId[id]
  const [, setState] = useStateWithCallback({}, () => {})
  const contextRef = React.useRef<NodeContext>({
    render: (callback: () => {}) => setState({}, callback),
    onPositionChange: () => {
      onPositionChange?.({ element, context: contextRef.current })
      element.connectedEdges().forEach((mutableEdge) => {
        const edgeContext = contextUtils.get(mutableEdge)
        edgeContext.onPositionChange()
      })
    },
    boundingBox: DEFAULT_BOUNDING_BOX,
    settings: {
      filtered: true,
      visibility: {
        cluster: getClusterVisibility(id, clusters),
      },
    },
  } as NodeContext)
  const element = React.useMemo(() => cy!.add({
    data: {
      id,
      [ELEMENT_DATA_FIELDS.CONTEXT]: contextRef.current,
    }, // ...(parentID ? { parent: parentID } : {}),
    position: { ...position },
    group: 'nodes',
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }) as NodeSingular, [cy, id])
  React.useEffect(
    () => {
      const {
        current: {
          onPositionChange,
        },
      } = contextRef
      element.on(CYTOSCAPE_EVENT.position, onPositionChange)
      return () => {
        element.off(CYTOSCAPE_EVENT.position, `#${element.id()}`, onPositionChange)
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
      const oldVisible = calculateVisibilityByContext(contextRef.current)
      contextRef.current.settings.visibility.cluster = clusterVisibility
      // contextRef.current.settings = {
      //   ...contextRef.current.settings,
      //   visibility,
      // }
      contextUtils.update(element, contextRef.current)
      if (oldVisible !== calculateVisibilityByContext(contextRef.current)) {
        contextRef.current.render()
      }
    }
  }, [element, clusters])
  useElement({
    contextRef,
    cy,
    element,
    config,
    item,
  })
  return {
    element,
    context: contextRef.current,
    clusters,
    cy,
  }
}
