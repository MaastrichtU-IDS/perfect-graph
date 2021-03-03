import Amplify, { API }  from "aws-amplify";
// import awsExports from "./aws-exports";

Amplify.configure({
  "aws_project_region": "eu-central-1",
  "aws_appsync_graphqlEndpoint": "https://4qb233n5szaubbp2e7apnpp4lm.appsync-api.eu-central-1.amazonaws.com/graphql",
  "aws_appsync_region": "eu-central-1",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-3bhdjwenmrbfvelucz62cjwuii"
});

const API_AUTH_MODE = {
  API_KEY: 'API_KEY'
} as const

const LIST_CASES = `query ListCases {
  listCaselaws {
    items {
      abstract
      country
      court
      date
      doctype
      id
      subject
    }
  }
}`

export async function listCases() {
  try {
    const listCasesResult = await API.graphql({
      query: LIST_CASES,
      authMode: API_AUTH_MODE.API_KEY,
      // variables
    })
    const caseResults = listCasesResult.data.listCaselaws.items
    return caseResults
    // return caseResults.map(project => ({
    //   // ...project,
    //   nodes: project.nodes.items.map(convertJSONStringFields),
    //   // edges: project.edges.items.map(convertJSONStringFields),
    // }))
  } catch (err) {
    console.log('error creating node:', err)
  }
}

const COMPLEX_QUERY = `query ListCases($query) {
  complexQuery(query: $query) {
    items {
      abstract
      country
      court
      date
      doctype
      id
      subject
    }
  }
}`

export async function complexQuery(query: any) {
  try {
    const listCasesResult = await API.graphql({
      query: COMPLEX_QUERY,
      authMode: API_AUTH_MODE.API_KEY,
      variables: query
    })
    const caseResults = listCasesResult.data.listCaselaws.items
    return caseResults
    // return caseResults.map(project => ({
    //   // ...project,
    //   nodes: project.nodes.items.map(convertJSONStringFields),
    //   // edges: project.edges.items.map(convertJSONStringFields),
    // }))
  } catch (err) {
    console.log('error creating node:', err)
  }
}


