import React from 'react'
import {useStateWithCallback} from 'colay-ui'
import {NodeSingular, Core} from 'cytoscape'
import {Position} from 'colay/type'
import {NodeContext, NodeConfig, Cluster, NodeData, NodeElement} from '@type'
import {getClusterVisibility, calculateVisibilityByContext, contextUtils} from '@utils'
import {CYTOSCAPE_EVENT, ELEMENT_DATA_FIELDS} from '@constants'
import {useInitializedRef} from 'colay-ui/hooks/useInitializedRef'
import {mutableGraphMap} from './useGraph'
import {useElement} from './useElement'

export type Props = {
  /**
   * Node data
   */
  item: NodeData
  /**
   * Related graph id
   */
  graphID: string
  /**
   * Node initial position
   */
  position: Position
  /**
   * Node is cluster or not
   */
  isCluster?: boolean
  /**
   * Position change handler
   */
  onPositionChange?: (c: {element: NodeSingular; context: NodeContext}) => void | any
  /**
   * Node config data
   */
  config?: NodeConfig
}

type Result = {
  element: NodeSingular
  context: NodeContext
  clusters?: Cluster[]
  cy: Core
}

const DEFAULT_BOUNDING_BOX = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

export const useNode = (props: Props): Result => {
  const {position, onPositionChange, graphID, config = {} as NodeConfig, item, isCluster = false} = props
  const {id} = item
  const initializedRef = useInitializedRef()
  const {cy, clustersByNodeId, clustersByChildClusterId} = mutableGraphMap[graphID]
  const clusters = isCluster ? clustersByChildClusterId[id] : clustersByNodeId[id]
  const [, setState] = useStateWithCallback({}, () => {})
  const contextRef = React.useRef<NodeContext>({
    render: (callback: () => void) => setState({}, callback),
    onPositionChange: () => {
      onPositionChange?.({element, context: contextRef.current})
      element.connectedEdges().forEach(mutableEdge => {
        const edgeContext = contextUtils.get(mutableEdge)
        edgeContext.onPositionChange()
      })
    },
    boundingBox: DEFAULT_BOUNDING_BOX,
    settings: {
      filtered: true,
      visibility: {
        cluster: getClusterVisibility(id, clusters)
      },
      hovered: false
    }
  } as NodeContext)
  const element: NodeElement = React.useMemo(() => {
    let _element: NodeElement = cy.$id(id)[0]
    if (!_element) {
      _element = cy!.add({
        data: {
          id,
          [ELEMENT_DATA_FIELDS.CONTEXT]: contextRef.current,
          [ELEMENT_DATA_FIELDS.DATA]: item?.data
        }, // ...(parentID ? { parent: parentID } : {}),
        position: {...position},
        group: 'nodes'
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }) as unknown as NodeElement
    }
    return _element
  }, [cy, id])
  React.useEffect(
    () => {
      const {
        current: {onPositionChange}
      } = contextRef
      const onHover = () => {
        contextRef.current.settings.hovered = true
        contextUtils.update(element, contextRef.current)
      }
      const onHoverExit = () => {
        contextRef.current.settings.hovered = false
        contextUtils.update(element, contextRef.current)
      }
      element.on(CYTOSCAPE_EVENT.position, onPositionChange)
      element.on(CYTOSCAPE_EVENT.mouseover, onHover)
      element.on(CYTOSCAPE_EVENT.mouseout, onHoverExit)
      return () => {
        // element.off(CYTOSCAPE_EVENT.position, `#${element.id()}`, onPositionChange)
        // element.off(CYTOSCAPE_EVENT.mouseover, `#${element.id()}`, onHover)
        // element.off(CYTOSCAPE_EVENT.mouseout, `#${element.id()}`, onHoverExit)
        element.removeListener(CYTOSCAPE_EVENT.position)
        element.removeListener(CYTOSCAPE_EVENT.mouseover)
        element.removeListener(CYTOSCAPE_EVENT.mouseout)
        cy!.remove(element!)
      }
    }, // destroy
    [cy, id]
  )
  React.useMemo(() => {
    if (initializedRef.current) {
      element.position(position)
    }
  }, [position.x, position.y])
  // Update Visibility
  React.useMemo(() => {
    const clusterVisibility = getClusterVisibility(element.id(), clusters)
    if (clusterVisibility !== contextRef.current.settings.visibility.cluster) {
      const oldVisible = calculateVisibilityByContext(element)
      contextRef.current.settings.visibility.cluster = clusterVisibility
      // contextRef.current.settings = {
      //   ...contextRef.current.settings,
      //   visibility,
      // }
      contextUtils.update(element, contextRef.current)
      if (oldVisible !== calculateVisibilityByContext(element)) {
        contextRef.current.render()
      }
    }
  }, [element, clusters])
  useElement({
    contextRef,
    cy,
    element,
    config,
    item
  })
  return {
    element,
    context: contextRef.current,
    clusters,
    cy
  }
}
