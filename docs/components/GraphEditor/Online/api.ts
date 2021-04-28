// @ts-nocheck
import Amplify, { API }  from "aws-amplify";
import  { Position }  from "colay/type";
import awsExports from "../../../aws-exports";

const API_AUTH_MODE = {
  API_KEY: 'API_KEY'
} as const

Amplify.configure(awsExports);

const LIST_PROJECTS = `query ListProjects {
  listProjects(limit: 1) {
    items {
      id
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
          position
        }
      }
    }
  }
}`

const CREATE_NODE = `mutation CreateNode(
  $projectID: ID!,
  $data: AWSJSON!,
  $position: AWSJSON!,
  ) {
  createNode(input: {
    projectID: $projectID,
    data: $data,
    position: $position
  }) {
    id
    data
    position
  }
}`
const UPDATE_NODE = `mutation UpdateNode($data: AWSJSON!, $id: ID!) {
  updateNode(input: {id: $id, data: $data}) {
    id
    data
    position
  }
}`

const DELETE_NODE = `mutation DeleteNode($id: ID = "") {
  deleteNode(input: {id: $id}) {
    id
  }
}`

const CREATE_EDGE = `mutation CreateEdge(
  $data: AWSJSON!,
  $projectID: ID!,
  $source: String!,
  $target: String!,
  ) {
  createEdge(input: {
    projectID: $projectID,
    data: $data,
    source: $source,
    target: $target,
  }) {
    id
    data
    source
    target
  }
}`

const UPDATE_EDGE = `mutation UpdateEdge($data: AWSJSON!, $id: ID!) {
  updateEdge(input: {id: $id, data: $data}) {
    id
    data
    source
    target
  }
}`

const DELETE_EDGE = `mutation DeleteEdge($id: ID = "") {
  deleteEdge(input: {id: $id}) {
    id
  }
}`

const ON_CREATE_NODE = `subscription OnCreateNode {
  onCreateNode {
    data
    id
    position
  }
}`
const ON_CREATE_EDGE = `subscription OnCreateEdge {
  onCreateEdge {
    id
    data
    source
    target
  }
}`
const ON_UPDATE_NODE = `subscription OnUpdateNode {
  onUpdateNode {
    id
    data
    position
  }
}`
const ON_UPDATE_EDGE = `subscription OnUpdateEdge {
  onUpdateEdge {
    id
    data
    source
    target
  }
}`
const ON_DELETE_NODE = `subscription OnDeleteNode {
  onDeleteNode {
    id
  }
}`
const ON_DELETE_EDGE = `subscription OnDeleteEdge {
  onDeleteEdge {
    id
  }
}`

const convertJSONStringFields = (item) => {
  return {
    ...item,
    ...(item.position ? { position: JSON.parse(item.position)} : {}),
    data: JSON.parse(item.data)
  }
}

export async function listProjects() {
  try {
    const listProjectResult = await API.graphql({
      query: LIST_PROJECTS,
      authMode: API_AUTH_MODE.API_KEY,
    })
    const projectResults = listProjectResult.data.listProjects.items
    return projectResults.map(project => ({
      ...project,
      nodes: project.nodes.items.map(convertJSONStringFields),
      edges: project.edges.items.map(convertJSONStringFields),
    }))
  } catch (err) { console.log('error listing project', err) }
}

type CreateNodeVariables = {
  projectID: string;
  data: any;
  position: Position;
}
export async function createNode(variables: CreateNodeVariables) {
  try {
    const createNodeResult = await API.graphql({
      query: CREATE_NODE,
      authMode: API_AUTH_MODE.API_KEY,
      variables: {
        ...variables,
        data: JSON.stringify(variables.data),
        position: JSON.stringify(variables.position),
      }
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type UpdateNodeVariables = {
  id: string;
  data: any;
}
export async function updateNode(variables: UpdateNodeVariables) {
  try {
    const updateNodeResult = await API.graphql({
      query: UPDATE_NODE,
      authMode: API_AUTH_MODE.API_KEY,
      variables: {
        ...variables,
        data: JSON.stringify(variables.data)
      }
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}
type DeleteNodeVariables = {
  id: string;
}
export async function deleteNode(variables: DeleteNodeVariables) {
  try {
    const updateNodeResult = await API.graphql({
      query: DELETE_NODE,
      authMode: API_AUTH_MODE.API_KEY,
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
export async function createEdge(variables: CreateEdgeVariables) {
  try {
    const createEdgeResult = await API.graphql({
      query: CREATE_EDGE,
      authMode: API_AUTH_MODE.API_KEY,
      variables: {
        ...variables,
        data: JSON.stringify(variables.data)
      }
    })
  } catch (err) {
    console.log('error creating edge:', err)
  }
}

type UpdateEdgeVariables = {
  id: string;
  data: any;
}
export async function updateEdge(variables: UpdateEdgeVariables) {
  try {
    const updateEdgeResult = await API.graphql({
      query: UPDATE_EDGE,
      authMode: API_AUTH_MODE.API_KEY,
      variables: {
        ...variables,
        data: JSON.stringify(variables.data)
      }
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

type DeleteEdgeVariables = {
  id: string;
}
export async function deleteEdge(variables: DeleteEdgeVariables) {
  try {
    const deleteEdgeResult = await API.graphql({
      query: DELETE_EDGE,
      authMode: API_AUTH_MODE.API_KEY,
      variables
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

export function onCreateNode(callback: (node: any) => void) {
  try {
     return API.graphql({
      query: ON_CREATE_NODE,
      authMode: API_AUTH_MODE.API_KEY,
    }).subscribe((nodeData) => {
      const nodeRaw = nodeData.value.data.onCreateNode
      callback(convertJSONStringFields(nodeRaw))
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}
export function onUpdateNode(callback: (node: any) => void) {
  try {
     return API.graphql({
      query: ON_UPDATE_NODE,
      authMode: API_AUTH_MODE.API_KEY,
    }).subscribe((nodeData) => {
      const nodeRaw = nodeData.value.data.onUpdateNode
      callback(convertJSONStringFields(nodeRaw))
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

export function onDeleteNode(callback: (id: string) => void) {
  try {
    return API.graphql({
      query: ON_DELETE_NODE,
      authMode: API_AUTH_MODE.API_KEY,
    }).subscribe((nodeData) => {
      const nodeRaw = nodeData.value.data.onDeleteNode
      callback(nodeRaw.id)
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

export function onCreateEdge(callback: (node: any) => void) {
  try {
     return API.graphql({
      query: ON_CREATE_EDGE,
      authMode: API_AUTH_MODE.API_KEY,
    }).subscribe((edgeData) => {
      const edgeRaw = edgeData.value.data.onCreateEdge
      callback(convertJSONStringFields(edgeRaw))
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}
export function onUpdateEdge(callback: (edge: any) => void) {
  try {
    return API.graphql({
      query: ON_UPDATE_EDGE,
      authMode: API_AUTH_MODE.API_KEY,
    }).subscribe((edgeData) => {
      const edgeRaw = edgeData.value.data.onUpdateEdge
      callback(convertJSONStringFields(edgeRaw))
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}
export function onDeleteEdge(callback: (id: string) => void) {
  try {
    return API.graphql({
      query: ON_DELETE_EDGE,
      authMode: API_AUTH_MODE.API_KEY,
    }).subscribe((edgeData) => {
      const edgeRaw = edgeData.value.data.onDeleteEdge
      callback(edgeRaw.id)
    })
  } catch (err) {
    console.log('error creating node:', err)
  }
}

// listProjects()