export default {}
// import * as R from 'colay/ramda'

// export default (rdfData: any) => {
//   const data = R.pipe(
//     R.ensureArray,
//     R.path([0, '@graph']),
//   )(rdfData)
//   // if (utils._.isArray(data)) {
//   //   if (data[0] && data[0]['@graph']) {
//   //     data = data[0]['@graph']
//   //   }
//   // } else if (utils._.has(data, '@graph')) {
//   //   data = data['@graph']
//   // }
//   const relations = []
//   const nodes = []
//   const nodeHashMap = {}
//   const { nodes, edges } = R.map((nodeData) => { // / nodes
//     const node = {
//       id: R.uuid(),
//       data: {
//         label: nodeData['@id'],
//         type: nodeData['@type']?.[0],
//       },

//     }
//     R.pipe(
//       R.toPairs,
//       R.map(
//         ([key, property]) => {
//           R.map(
//             () => {
//               if (utils._.has(p, '@value')) { // node prop
//                 node.data[key] = p['@value']
//               } else { // new edge
//                 relations.push({
//                   group: 'edges',
//                   data: {
//                     label: key, sourceLabel: node.data.label, targetLabel: p['@id'],
//                   },
//                 })
//               }
//             }
//           )(R.ensureArray(property))
//       }
//     )(R.omit(['@id', '@type'])(nodeData))
//     nodeHashMap[node.data.label] = node
//     nodes.push(node)
//   })(data)
//   const edges = []
//   utils._.forEach(relations, (e, index) => {
//     const { data: { sourceLabel, targetLabel, label } } = e
//     const sourceNode = nodeHashMap[sourceLabel]
//     const targetNode = nodeHashMap[targetLabel]
//     if (sourceNode && targetNode) {
//       edges.push({
//         group: 'edges',
//         data: {
//           id: utils.createUuid(), label, source: sourceNode.data.id, target: targetNode.data.id,
//         },
//       })
//     }
//   })
// }
