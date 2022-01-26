import Amplify, { API } from "aws-amplify";
// import awsExports from "./aws-exports";

const API_AUTH_MODE = {
  API_KEY: 'API_KEY'
} as const

const convertJSONStringFields = (item) => {
  return {
    ...item,
    ...(item.position ? { position: JSON.parse(item.position) } : {}),
    data: JSON.parse(item.data)
  }
}

const LIST_CASES = `query QueryNetworkByUserInput(
  $DataSources: [String]
  $Keywords: String
  $Articles: String
  $Eclis: String
  $DegreesSources: Int
  $DegreesTargets: Int
  $DateStart: AWSDate
  $DateEnd: AWSDate
  $Instances: [String]
  $Domains: [String]
  $Doctypes: [String]
) {
  queryNetworkByUserInput(
    DataSources: $DataSources
    Keywords: $Keywords
    Articles: $Articles
    Eclis: $Eclis
    DegreesSources: $DegreesSources
    DegreesTargets: $DegreesTargets
    DateStart: $DateStart
    DateEnd: $DateEnd
    Instances: $Instances
    Domains: $Domains
    Doctypes: $Doctypes
  ) {
    nodes {
      id
      data
    }
    edges {
      id
      source
      target
      data
    }
    statistics
    message
  }
}`

const GET_ELEMENT_DATA = `query GetElementData($id: String) {
  fetchNodeData(Ecli: $id) {
    data
    id
  }
}`

const TEST_AUTH = `query TestAuth($id: String) {
  testAuth(Ecli: $id) {
    data
    id
  }
}`

type listCasesVariables = {
  DataSources: string[];
}

export async function listCases(variables: listCasesVariables) {
  try {
    console.log(variables)
    const listCasesResult = await API.graphql({
      query: LIST_CASES,
      // authMode: API_AUTH_MODE.API_KEY,
      variables
    })

    const caseResults = listCasesResult.data.queryNetworkByUserInput
    console.log(caseResults)

    return {
      nodes: caseResults.nodes.map(convertJSONStringFields),
      edges: caseResults.edges.map(convertJSONStringFields),
      networkStatistics: JSON.parse(caseResults.statistics),
      message: caseResults.message,
      // edges: project.edges.items.map(convertJSONStringFields),
    }

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
      // authMode: API_AUTH_MODE.API_KEY,
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

type GetElementDataVariables = {
  id: string;
}

export async function getElementData(variables: GetElementDataVariables) {
  try {
    const elementDataResult = await API.graphql({
      query: GET_ELEMENT_DATA,
      // authMode: API_AUTH_MODE.API_KEY,
      variables
    })
    const result = elementDataResult.data.fetchNodeData.data
    return result ? JSON.parse(result) : {}
    // return caseResults.map(project => ({
    //   // ...project,
    //   nodes: project.nodes.items.map(convertJSONStringFields),
    //   // edges: project.edges.items.map(convertJSONStringFields),
    // }))
  } catch (err) {
    console.log('error getElementData node:', err)
  }
}


export async function testAuth(variables: GetElementDataVariables) {
  try {
    const elementDataResult = await API.graphql({
      query: TEST_AUTH,
      // authMode: API_AUTH_MODE.API_KEY,
      variables
    })
    const result = elementDataResult.data.testAuth.data
    return result ? JSON.parse(result) : {}
  } catch (err) {
    console.log('error testAuth:', err)
  }
}