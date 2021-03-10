import cytoscape from 'cytoscape'
import * as R from 'colay/ramda'

type Props = {
  nodes: {
    id: string;
    data: any;
  }[]
  edges: {
    id: string;
    source: string;
    target: string;
    data: any;
  }[]
}
export const calculateStatistics = (props: Props) => {
  const {
    nodes = [],
    edges = [],
  } = props
  const cy = cytoscape({
    elements: R.concat(
      nodes.map((n) => ({
        data: n,
        group: 'nodes',
      })),
      edges.map((e) => ({
        data: e,
        group: 'edges',
      })),
    ),
    headless: true,
  })
  const {
    indegree: indegreeCentralityCalc,
    outdegree: outdegreeCentralityCalc,
  } = cy.$().degreeCentralityNormalized({
    // weight: (edge) => {
    //   return edge.connectedNodes().length
    // },
    // alpha: 1
    directed: true,
  })
  const {
    degree: degreeCentralityCalc,
  } = cy.$().degreeCentralityNormalized({
    // weight: (edge) => {
    //   return edge.connectedNodes().length
    // },
    // alpha: 1
  })
  const {
    closeness: closenessCentralityCalc,
  } = cy.$().closenessCentralityNormalized({
  })
  const {
    betweenness: betweennessCentralityCalc,
  } = cy.$().betweennessCentrality({})
  const {
    rank: pageRankCalc,
  } = cy.$().pageRank({
  })
  const nodeStatisticsMap = {}
  const nodesStatistics = cy.nodes().map((node) => {
    const nodeId = node.id()
    nodeStatisticsMap[nodeId] = {
      degree: degreeCentralityCalc(node),
      indegree: indegreeCentralityCalc(node),
      outdegree: outdegreeCentralityCalc(node),
      closeness: closenessCentralityCalc(node),
      betweenness: betweennessCentralityCalc(node),
      pageRank: pageRankCalc(node),
    }
    return {
      id: nodeId,
      ...nodeStatisticsMap[nodeId],
    }
  })
  cy.destroy()
  return nodeStatisticsMap
}
