const cytoscape = require('cytoscape')
const { Layouts } = require('./layouts')
const euler = require('cytoscape-euler')
const cola = require('cytoscape-cola')
const dagre = require('cytoscape-dagre')
const spread = require('cytoscape-spread')

spread(cytoscape)
cytoscape.use(dagre)
cytoscape.use(euler)
cytoscape.use(cola)

exports.calculateLayout =  async (params) => {
  const {
    graph,
    layoutName,
    boundingBox,
  } = params
  const nodes = graph.nodes.map((node) => ({
    data: { id: node.id },
    group: 'nodes',
  }))
  const edges = graph.edges.map((edge) => ({
    data: {
      id: edge.id, source: edge.source, target: edge.target,
    },
    group: 'edges',
  }))
  const cy = cytoscape({
    elements: [
      ...nodes,
      ...edges,
    ],
    headless: true,
    styleEnabled: true,
  })
  const layout = cy.createLayout({
    ...Layouts[layoutName],
    boundingBox,
  })
  console.log('layout', layout)

  const result = await new Promise((resolve, reject) => {
    try {
      layout.on('layoutstop', () => {
        // @ts-ignore
        const nodePositions = {}
        // Fix the edge lines
        cy.nodes().forEach((node) => {
          nodePositions[node.id()] = node.position()
        })
        console.log('nodePositions', nodePositions)
        resolve(nodePositions)
        // FOR CULLING
      })
      layout.start()
    } catch (error) {
      console.log('error', error)
      reject(error)
    }
  })
  console.log('nodePositionsResult', result)

  return result
}
