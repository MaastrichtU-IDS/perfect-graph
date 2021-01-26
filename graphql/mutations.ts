/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProject = /* GraphQL */ `
  mutation CreateProject(
    $input: CreateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    createProject(input: $input, condition: $condition) {
      id
      nodes {
        items {
          id
          projectID
          data
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
export const updateProject = /* GraphQL */ `
  mutation UpdateProject(
    $input: UpdateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    updateProject(input: $input, condition: $condition) {
      id
      nodes {
        items {
          id
          projectID
          data
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
export const deleteProject = /* GraphQL */ `
  mutation DeleteProject(
    $input: DeleteProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    deleteProject(input: $input, condition: $condition) {
      id
      nodes {
        items {
          id
          projectID
          data
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
export const createNode = /* GraphQL */ `
  mutation CreateNode(
    $input: CreateNodeInput!
    $condition: ModelNodeConditionInput
  ) {
    createNode(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateNode = /* GraphQL */ `
  mutation UpdateNode(
    $input: UpdateNodeInput!
    $condition: ModelNodeConditionInput
  ) {
    updateNode(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteNode = /* GraphQL */ `
  mutation DeleteNode(
    $input: DeleteNodeInput!
    $condition: ModelNodeConditionInput
  ) {
    deleteNode(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const createEdge = /* GraphQL */ `
  mutation CreateEdge(
    $input: CreateEdgeInput!
    $condition: ModelEdgeConditionInput
  ) {
    createEdge(input: $input, condition: $condition) {
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
export const updateEdge = /* GraphQL */ `
  mutation UpdateEdge(
    $input: UpdateEdgeInput!
    $condition: ModelEdgeConditionInput
  ) {
    updateEdge(input: $input, condition: $condition) {
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
export const deleteEdge = /* GraphQL */ `
  mutation DeleteEdge(
    $input: DeleteEdgeInput!
    $condition: ModelEdgeConditionInput
  ) {
    deleteEdge(input: $input, condition: $condition) {
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
