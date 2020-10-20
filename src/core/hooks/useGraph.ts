import cytoscape, { Core } from 'cytoscape'
import { useEffect, useMemo, useRef } from 'react'
// import d3Force from 'cytoscape-d3-force'
// import euler from 'cytoscape-euler'
// import cola from 'cytoscape-cola'

// cytoscape.use(d3Force)
// cytoscape.use(euler)
// cytoscape.use(cola)

export const mutableGraphMap: Record<string, Core> = {}
export type Props = {
  id: string;
  onLoad?: (cy: Core) => void;
  create?: true;
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
  } = props
  const isExistRef = useRef(false)
  const cy = useMemo(() => {
    if (mutableGraphMap[id]) {
      isExistRef.current = true
      return mutableGraphMap[id]
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
    mutableGraphMap[id] = cyInstance
    return cyInstance
  }, [id])
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
  }
}
