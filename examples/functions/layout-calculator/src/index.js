const {calculateLayout} = require('./layoutCalculator')

exports.handler = async (event, context, callback) => {
  const {nodes, edges, layoutName, boundingBox} = event.arguments
  console.log('event', event)
  const result = await calculateLayout({
    boundingBox,
    graph: {
      edges,
      nodes
    },
    layoutName
  })
  console.log('result', result)
  // callback(null, result)
  return result
}
