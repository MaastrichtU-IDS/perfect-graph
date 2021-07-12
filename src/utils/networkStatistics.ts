// @ts-nocheck
import cytoscape from 'cytoscape'
import * as R from 'colay/ramda'
import { NodeData, EdgeData } from '@type'

type Props = {
  nodes: NodeData[]
  edges: EdgeData[]
}
export const calculateStatistics = (params: Props) => {
  const {
    nodes = [],
    edges = [],
  } = params
  const cy = cytoscape({
    // @ts-ignore
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
  } = cy.elements().degreeCentralityNormalized({
    // weight: (edge) => {
    //   return edge.connectedNodes().length
    // },
    // alpha: 1
    directed: true,
  })
  const {
    degree: degreeCentralityCalc,
  } = cy.elements().degreeCentralityNormalized({
    // weight: (edge) => {
    //   return edge.connectedNodes().length
    // },
    // alpha: 1
  })
  const {
    closeness: closenessCentralityCalc,
  } = cy.elements().closenessCentralityNormalized({
  })
  const {
    betweenness: betweennessCentralityCalc,
  } = cy.elements().betweennessCentrality({})
  const {
    rank: pageRankCalc,
  } = cy.elements().pageRank({
  })
  const nodeStatisticsMap: Record<string, any> = {}
  // const nodesStatistics =
  cy.nodes().map((node) => {
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
