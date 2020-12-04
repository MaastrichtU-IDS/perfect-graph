import queryString from 'unitx/query-string'

type Filters = {
  _page: number;
  _limit: number;
  _start: number;
}
export const requestData = async (filters: Filters) => {
  const authors = await (await fetch(`https://example-data.draftbit.com/books?${
    queryString.stringify(filters)
  }`)).json()
  const books = await (await fetch(`https://example-data.draftbit.com/books?${
    queryString.stringify(filters)
  }`)).json()
  return {
    nodes: [...authors, ...books].map((item, index) => ({
      data: item,
      id: `${index}`
    })),
    edges: authors.map((item, index) => ({
      id: `edge:${item.id}`,
      source: `${index}`,
      target: `${authors.length + index}`
    }))
  }
  
}