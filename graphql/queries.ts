/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProject = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      nodes {
        items {
          id
          projectID
          data
          position
          createdAt
          updatedAt
        }
        nextToken
      }
      edges {
        items {
          id
          projectID
          source
          target
          data
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProjects = /* GraphQL */ `
  query ListProjects(
    $filter: ModelProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nodes {
          nextToken
        }
        edges {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getNode = /* GraphQL */ `
  query GetNode($id: ID!) {
    getNode(id: $id) {
      id
      projectID
      project {
        id
        nodes {
          nextToken
        }
        edges {
          nextToken
        }
        createdAt
        updatedAt
      }
      data
      position
      createdAt
      updatedAt
    }
  }
`;
export const listNodes = /* GraphQL */ `
  query ListNodes(
    $filter: ModelNodeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        projectID
        project {
          id
          createdAt
          updatedAt
        }
        data
        position
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEdge = /* GraphQL */ `
  query GetEdge($id: ID!) {
    getEdge(id: $id) {
      id
      projectID
      source
      target
      project {
        id
        nodes {
          nextToken
        }
        edges {
          nextToken
        }
        createdAt
        updatedAt
      }
      data
      createdAt
      updatedAt
    }
  }
`;
export const listEdges = /* GraphQL */ `
  query ListEdges(
    $filter: ModelEdgeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEdges(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        projectID
        source
        target
        project {
          id
          createdAt
          updatedAt
        }
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
