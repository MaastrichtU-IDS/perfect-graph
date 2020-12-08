import cytoscape, { Core } from 'cytoscape'
import { useEffect, useMemo, useRef } from 'react'
import { ClusterConfig, ClusterInfoByID } from '@type'
// import d3Force from 'cytoscape-d3-force'
// import euler from 'cytoscape-euler'
// import cola from 'cytoscape-cola'

// cytoscape.use(d3Force)
// cytoscape.use(euler)
// cytoscape.use(cola)

export const mutableGraphMap: Record<string, {
  cy: Core;
  clustersByID: ClusterInfoByID;
}> = {}
export type Props = {
  id: string;
  onLoad?: (cy: Core) => void;
  create?: true;
  clusters?: ClusterConfig;
}

// const createCanvas = () => {
//   const canvas = document.createElement('canvas')
//   canvas.width = window.innerWidth
//   canvas.height = window.innerHeight
//   document.body.appendChild(canvas)
//   return canvas
// }
export default (props: Props) => {
  const {
    onLoad,
    id,
    clusters = {},
  } = props
  const isExistRef = useRef(false)
  const cy = useMemo(() => {
    if (mutableGraphMap[id]) {
      isExistRef.current = true
      return mutableGraphMap[id].cy
    }
    const cyInstance = cytoscape({ // // create
      elements: [],
      headless: true,
      styleEnabled: true,
      // container: createCanvas(),
      // style: [ // the stylesheet for the graph
      //   {
      //     selector: 'node',
      //     style: {
      //       'background-color': '#666',
      //       label: 'data(id)',
      //       width: 100,
      //       height: 100,
      //     },
      //   },

      //   {
      //     selector: 'edge',
      //     style: {
      //       width: 3,
      //       'line-color': '#ccc',
      //       'target-arrow-color': '#ccc',
      //       'target-arrow-shape': 'triangle',
      //       // 'curve-style': 'bezier',
      //     },
      //   },
      // ],

    })
    mutableGraphMap[id] = { cy: cyInstance, clustersByID: {} }
    return cyInstance
  }, [id])
  const clustersByID = useMemo(() => {
    const clustersByID: ClusterInfoByID = {}
    Object.keys(clusters).forEach((clusterName) => {
      const cluster = clusters[clusterName]
      cluster.ids.forEach((nodeID) => {
        clustersByID[nodeID] = {
          clusterName,
          expand: cluster.expand,
        }
      })
    })
    mutableGraphMap[id].clustersByID = clustersByID
    return clustersByID
  }, [clusters])
  useEffect(() => {
    if (isExistRef.current) return
    setTimeout(() => {
      onLoad!(cy)
    }, 500)
    return () => { !isExistRef.current && cy.destroy() }
  }, // destroy
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [cy])
  return {
    cy,
    clustersByID,
  }
}
