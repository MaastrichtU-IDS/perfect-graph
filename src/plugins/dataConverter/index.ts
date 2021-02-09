import { Parser, Quad } from 'n3'
import * as jsonld from 'jsonld'
import * as R from 'colay/ramda'
import { data } from './example'

type ToNquadResult = {
  quadList: Quad[];
  prefixes: Record<string, string>;
}

const toNquad = async (text: string) => {
  const parser = new Parser()
  const result: ToNquadResult = {
    quadList: [],
    prefixes: {},
  }
  await new Promise((res, rej) => {
    parser.parse(
      text,
      async (error, quad, prefixes) => {
        if (error) {
          rej(error)
        }
        if (quad) { result.quadList.push(quad) } else {
        // @ts-ignore
          result.prefixes = prefixes
          res(result)
        }
      },
    )
  })
  return result
}

const example = `PREFIX c: <http://example.org/cartoons#>
c:Tom a c:Cat.
c:Jerry a c:Mouse;
        c:smarterThan c:Tom.`

const example3 = `@base <http://example.org/> .
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix rel: <http://www.perceive.net/schemas/relationship/> .
    
    <#green-goblin>
        rel:enemyOf <#spiderman> ;
        a foaf:Person ;    # in the context of the Marvel universe
        foaf:name "Green Goblin" .
    
    <#spiderman>
        rel:enemyOf <#green-goblin> ;
        a foaf:Person ;
        foaf:name "Spiderman", "Человек-паук"@ru .`
export const convertToJSONLD = async (text: string): Promise<Record<string, any>[]> => {
  const result = await toNquad(text)
  const jsonLDList = await jsonld.fromRDF(result.quadList)
  const resultList: Record<string, any>[] = await R.mapAsync(
    async (jsonLDItem) =>
      // // @ts-ignore
      // const itemResult = await jsonld.compact(jsonLDItem, {})// result.prefixes)
      // return itemResult
      jsonLDItem
    ,
  )(jsonLDList)
  return resultList
}

// [
//   {
//     "@id": "http://example.org/cartoons#Jerry",
//     "@type": "http://example.org/cartoons#Mouse",
//     "http://example.org/cartoons#smarterThan": {
//       "@id": "http://example.org/cartoons#Tom"
//     }
//   },
//   {
//     "@id": "http://example.org/cartoons#Tom",
//     "@type": "http://example.org/cartoons#Cat"
//   }
// ]

// [
//   {
//     "@id": "http://example.org/#green-goblin",
//     "@type": "http://xmlns.com/foaf/0.1/Person",
//     "http://www.perceive.net/schemas/relationship/enemyOf": {
//       "@id": "http://example.org/#spiderman"
//     },
//     "http://xmlns.com/foaf/0.1/name": "Green Goblin"
//   },
//   {
//     "@id": "http://example.org/#spiderman",
//     "@type": "http://xmlns.com/foaf/0.1/Person",
//     "http://www.perceive.net/schemas/relationship/enemyOf": {
//       "@id": "http://example.org/#green-goblin"
//     },
//     "http://xmlns.com/foaf/0.1/name": [
//       "Spiderman",
//       {
//         "@language": "ru",
//         "@value": "Человек-паук"
//       }
//     ]
//   }
// ]

// const processField = (
//   item: any,
//   fieldKey: string,
//   fieldValue: any,
// ) => {
//   const isList = R.is(Array, fieldValue)
//   const nodes = []
//   const edges = []
//   if (isList) {
//     const fieldDataList = fieldValue.map(
//       (valueItem) => processField(item, fieldKey, valueItem),
//     )
//     return R.reduce(R.mergeWith(R.concat), { nodes, edges }, fieldDataList)
//   }

//   const itemId = item['@id']
//   const isEdge = !!fieldValue['@id']
//   if (isEdge) {
//     edges.push({
//       id: itemId,
//       source: itemId,
//       target: fieldValue['@id'],
//       data: [],
//     })
//   } else {
//     nodes.push({
//       id: itemId,
//       data: [{
//         name: fieldKey,
//         value: [fieldValue],
//       }],
//     })
//   }
//   return {
//     nodes,
//     edges,
//   }
// }
// const mergeGraphDataList = (data) => R.reduce(
//   R.mergeDeepWith(R.concat), { nodes: {}, edges: {} }, data,
// )
// const processNode = (
//   item: any,
// ) => {
//   const nodes = []
//   const edges = []
// }
// const processEdge = (
//   item: any,
//   relationName: string,
// ) => {
//   const nodes = []
//   const edges = []
// }
export const convertJSONLDToGraphData = (
  jsonLDList: Record<string, any>[],
  graph: {
    nodes: {},
    edges: {},
  } = {},
) => {
  const {
    nodes = {},
    edges = {},
  } = graph
  jsonLDList.forEach((item) => {
    const nodeId = item['@id']
    const node = {
      id: nodeId,
      data: [],
      ...(nodes[nodeId] ?? {}),
    }
    Object.keys(R.omit(['@id'], item)).forEach((fieldKey) => {
      const noDataItem = {
        name: fieldKey,
        value: [],
      }
      item[fieldKey].forEach((fieldValue) => {
        const edgeId = fieldValue['@id']
        const isEdge = !!edgeId
        if (isEdge) {
          edges[edgeId] = {
            id: R.uuid(),
            source: nodeId,
            target: fieldValue['@id'],
            data: [{
              name: 'name',
              value: [{
                value: fieldKey,
                additional: [],
              }],
            }],
          }
        } else {
          const isPlainObject = R.isPlainObject((fieldValue))
          noDataItem.value.push({
            value: isPlainObject ? fieldValue['@value'] : fieldValue,
            additional: isPlainObject
              ? Object.keys(R.omit(['@value'])(fieldValue)).map((valueFieldKey) => ({
                value: fieldValue[valueFieldKey],
                name: valueFieldKey,
              }))
              : [],
          })
        }
      })
      node.data.push(noDataItem)
    })
    nodes[nodeId] = node
  })
  const nodeList = Object.values(nodes)
  return {
    nodes: nodeList,
    edges: filterEdges(nodeList)(Object.values(edges)),
  }
}

// @ts-ignore
export const filterEdges = (nodes: {id: string}[]) => (
  edges: {source:string;target:string}[],
) => {
  const nodeMap = R.groupBy(R.prop('id'))(nodes)
  return R.filter(
    (edge) => nodeMap[edge.source] && nodeMap[edge.target],
  )(edges)
}

// export const convertToGraphData = (resultList: Record<string, any>[]) => {
//   R.map(
//     (item: object) => {

//     }
//   )(resultList)
// }
// convertToJSONLD(example3)

// export const convertRDFToGraphData = async () => {
//   // const jsonLD = await convertToJSONLD(example3)
//   const graphData = convertJSONLDToGraphData(await jsonld.expand(data))
//   return graphData
// }
export const convertRDFToGraphData = async () => {
  const jsonLD = await convertToJSONLD(example3)
  const graphData = convertJSONLDToGraphData(jsonLD)
  return graphData
}
