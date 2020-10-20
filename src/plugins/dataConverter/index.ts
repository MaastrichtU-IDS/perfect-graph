import { Parser, Quad, } from 'n3'
import * as jsonld from 'jsonld';
import * as R from 'unitx/ramda';
// import toJsonSchema from 'to-json-schema'


type ToNquadResult = {
  quadList: Quad[];
  prefixes : Record<string, string>
}

const toNquad = async (text: string) => {
  const parser = new Parser();
  const result: ToNquadResult   = {
    quadList: [],
    prefixes: {}
  }
  await new Promise((res,rej) => {
    parser.parse(
    text,
    async (error, quad, prefixes) => {
      if (error) {
        rej(error)
      }
      if (quad)
        result.quadList.push(quad)
      else{
        // @ts-ignore
        result.prefixes = prefixes
        res(result)
      }
        
    });
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
  const jsonLDList = await jsonld.fromRDF(result.quadList);
  const resultList: Record<string, any>[] = await R.mapAsync(
    async (jsonLDItem) => {
      const itemResult = await jsonld.compact(jsonLDItem, {})//result.prefixes)
      return itemResult
    }
  )(jsonLDList)
  console.log('result',result, resultList, JSON.stringify(resultList))
  return resultList
}

export const convertToGraphData = (resultList: Record<string, any>[]) => {
  R.map(
    (item: object) => {
      
    }
  )(resultList)
}
convertToJSONLD(example)
convertToJSONLD(example3)