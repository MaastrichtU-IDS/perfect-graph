/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProject = /* GraphQL */ `
  subscription OnCreateProject {
    onCreateProject {
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
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject {
    onUpdateProject {
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
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject {
    onDeleteProject {
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
export const onCreateNode = /* GraphQL */ `
  subscription OnCreateNode {
    onCreateNode {
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
export const onUpdateNode = /* GraphQL */ `
  subscription OnUpdateNode {
    onUpdateNode {
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
export const onDeleteNode = /* GraphQL */ `
  subscription OnDeleteNode {
    onDeleteNode {
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
export const onCreateEdge = /* GraphQL */ `
  subscription OnCreateEdge {
    onCreateEdge {
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
export const onUpdateEdge = /* GraphQL */ `
  subscription OnUpdateEdge {
    onUpdateEdge {
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
export const onDeleteEdge = /* GraphQL */ `
  subscription OnDeleteEdge {
    onDeleteEdge {
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
