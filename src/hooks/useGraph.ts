import React from 'react'
import cytoscape, {Core} from 'cytoscape'
import {Cluster, ClustersByNodeId, ClustersByChildClusterId} from '@type'

export const mutableGraphMap: Record<
  string,
  {
    cy: Core
    clustersByNodeId: ClustersByNodeId
    clustersByChildClusterId: ClustersByChildClusterId
  }
> = {}

export type Props = {
  /**
   * If there is no graph with the id, it will be generated
   */
  id: string
  /**
   * Clusters list
   */
  clusters?: Cluster[]
}

/**
 * To create new graph or use existing graph via hooks.
 */
export const useGraph = (props: Props) => {
  const {id, clusters = []} = props
  const isExistRef = React.useRef(false)
  const graph = React.useMemo(() => {
    if (mutableGraphMap[id]) {
      isExistRef.current = true
      return mutableGraphMap[id]
    }
    const cyInstance = cytoscape({
      // // create
      elements: [],
      headless: true,
      styleEnabled: true
    })
    mutableGraphMap[id] = {
      cy: cyInstance,
      clustersByNodeId: {},
      clustersByChildClusterId: {}
    }
    return mutableGraphMap[id]
  }, [id])
  const {cy} = graph
  React.useMemo(() => {
    const clustersByNodeId: ClustersByNodeId = {}
    clusters.forEach(cluster => {
      cluster.ids.forEach(nodeID => {
        const clusterById = clustersByNodeId[nodeID] ?? []
        clusterById.push(cluster)
        clustersByNodeId[nodeID] = clusterById
      })
    })
    const clustersByChildClusterId: ClustersByChildClusterId = {}
    clusters.forEach(cluster => {
      cluster.childClusterIds.forEach(clusterId => {
        const clusterById = clustersByChildClusterId[clusterId] ?? []
        clusterById.push(cluster)
        clustersByChildClusterId[clusterId] = clusterById
      })
    })
    graph.clustersByNodeId = clustersByNodeId
    graph.clustersByChildClusterId = clustersByChildClusterId
  }, [graph, clusters])
  React.useEffect(
    () => {
      if (isExistRef.current) return
      return () => {
        if (!isExistRef.current) {
          delete mutableGraphMap[id]
          cy.destroy()
        }
      }
    }, // destroy
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cy]
  )
  return graph
}
