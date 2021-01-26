import Amplify, { API, }  from "aws-amplify";
import awsExports from "../../../../src/aws-exports";
// import { createElement, deleteElement, updateElement } from '../../../../graphql/mutations'
// import { listProjects } from '../../../../graphql/queries'
Amplify.configure(awsExports);

const LIST_PROJECTS = `query MyQuery {
  listProjects(limit: 1) {
    id
    items {
      edges {
        items {
          id
          data
          source
          target
        }
      }
      nodes {
        items {
          id
          data
        }
      }
    }
  }
}`

const CREATE_NODE = `mutation CreateNode($data: AWSJSON!, $projectID: ID!) {
  createNode(input: {projectID: $projectID, data: $data}) {
    id
  }
}`
const UPDATE_NODE = `mutation UpdateNode($data: AWSJSON!, $id: ID!) {
  updateNode(input: {id: $id, data: $data}) {
    id
  }
}`

const CREATE_EDGE = `mutation CreateEdge(
  $data: AWSJSON!,
  $projectID: ID!,
  $source: String!,
  $target: String!,
  ) {
  createNode(input: {
    projectID: $projectID,
    data: $data,
    source: $source,
    target: $target,
  }) {
    id
  }
}`

const UPDATE_EDGE = `mutation UpdateEdge($data: AWSJSON!, $id: ID!) {
  updateEdge(input: {id: $id, data: $data}) {
    id
  }
}`

const PROJECT_ID = 'daa9975c-6bdc-4ab3-9a01-2d1dca1f2290'

async function listProjects() {
  try {
    const listProjectResult = await API.graphql({
      query: LIST_PROJECTS,
      authMode: 'API_KEY'
    })
    const projectResult = listProjectResult.data.listProjects.items[0]
    const project = {
      ...projectResult,
      nodes: projectResult.nodes.items,
      edges: projectResult.edges.items,
    }
    console.log('p',project)
  } catch (err) { console.log('error listing project', err) }
}

type CreateNodeVariables = {
  projectID: string;
  data: any;
}
async function createNode(variables: CreateNodeVariables) {
  try {
    const createNodeResult = await API.graphql({
      query: CREATE_NODE,
      authMode: 'API_KEY',
      variables
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type UpdateNodeVariables = {
  id: string;
  data: any;
}
async function updateNode(variables: UpdateNodeVariables) {
  try {
    const updateNodeResult = await API.graphql({
      query: UPDATE_NODE,
      authMode: 'API_KEY',
      variables
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type CreateEdgeVariables = {
  projectID: string;
  data: any;
  source: string;
  target: string;
}
async function createEdge(variables: CreateEdgeVariables) {
  try {
    const createEdgeResult = await API.graphql({
      query: CREATE_EDGE,
      authMode: 'API_KEY',
      variables
    })
  } catch (err) {
    console.log('error creating edge:', err)
  }
}

type UpdateEdgeVariables = {
  id: string;
  data: any;
}
async function updateEdge(variables: UpdateEdgeVariables) {
  try {
    const updateEdgeResult = await API.graphql({
      query: UPDATE_EDGE,
      authMode: 'API_KEY',
      variables
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}
// listProjects()