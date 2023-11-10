import {ContextParser, FetchDocumentLoader} from 'jsonld-context-parser'

const myParser = new ContextParser({
  documentLoader: new FetchDocumentLoader(),
  skipValidation: true,
  expandContentTypeToBase: true
})

export const parseContext = async (url: string) => {
  const myContext = await myParser.parse(url)
  return myContext
}
