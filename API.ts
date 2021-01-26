/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateProjectInput = {
  id?: string | null,
};

export type ModelProjectConditionInput = {
  and?: Array< ModelProjectConditionInput | null > | null,
  or?: Array< ModelProjectConditionInput | null > | null,
  not?: ModelProjectConditionInput | null,
};

export type UpdateProjectInput = {
  id: string,
};

export type DeleteProjectInput = {
  id?: string | null,
};

export type CreateNodeInput = {
  id?: string | null,
  projectID: string,
  data?: string | null,
  position?: string | null,
};

export type ModelNodeConditionInput = {
  projectID?: ModelIDInput | null,
  data?: ModelStringInput | null,
  position?: ModelStringInput | null,
  and?: Array< ModelNodeConditionInput | null > | null,
  or?: Array< ModelNodeConditionInput | null > | null,
  not?: ModelNodeConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateNodeInput = {
  id: string,
  projectID?: string | null,
  data?: string | null,
  position?: string | null,
};

export type DeleteNodeInput = {
  id?: string | null,
};

export type CreateEdgeInput = {
  id?: string | null,
  projectID: string,
  source: string,
  target: string,
  data?: string | null,
};

export type ModelEdgeConditionInput = {
  projectID?: ModelIDInput | null,
  source?: ModelStringInput | null,
  target?: ModelStringInput | null,
  data?: ModelStringInput | null,
  and?: Array< ModelEdgeConditionInput | null > | null,
  or?: Array< ModelEdgeConditionInput | null > | null,
  not?: ModelEdgeConditionInput | null,
};

export type UpdateEdgeInput = {
  id: string,
  projectID?: string | null,
  source?: string | null,
  target?: string | null,
  data?: string | null,
};

export type DeleteEdgeInput = {
  id?: string | null,
};

export type ModelProjectFilterInput = {
  id?: ModelIDInput | null,
  and?: Array< ModelProjectFilterInput | null > | null,
  or?: Array< ModelProjectFilterInput | null > | null,
  not?: ModelProjectFilterInput | null,
};

export type ModelNodeFilterInput = {
  id?: ModelIDInput | null,
  projectID?: ModelIDInput | null,
  data?: ModelStringInput | null,
  position?: ModelStringInput | null,
  and?: Array< ModelNodeFilterInput | null > | null,
  or?: Array< ModelNodeFilterInput | null > | null,
  not?: ModelNodeFilterInput | null,
};

export type ModelEdgeFilterInput = {
  id?: ModelIDInput | null,
  projectID?: ModelIDInput | null,
  source?: ModelStringInput | null,
  target?: ModelStringInput | null,
  data?: ModelStringInput | null,
  and?: Array< ModelEdgeFilterInput | null > | null,
  or?: Array< ModelEdgeFilterInput | null > | null,
  not?: ModelEdgeFilterInput | null,
};

export type CreateProjectMutationVariables = {
  input: CreateProjectInput,
  condition?: ModelProjectConditionInput | null,
};

export type CreateProjectMutation = {
  createProject:  {
    __typename: "Project",
    id: string,
    nodes:  {
      __typename: "ModelNodeConnection",
      items:  Array< {
        __typename: "Node",
        id: string,
        projectID: string,
        data: string | null,
        position: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    edges:  {
      __typename: "ModelEdgeConnection",
      items:  Array< {
        __typename: "Edge",
        id: string,
        projectID: string,
        source: string,
        target: string,
        data: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProjectMutationVariables = {
  input: UpdateProjectInput,
  condition?: ModelProjectConditionInput | null,
};

export type UpdateProjectMutation = {
  updateProject:  {
    __typename: "Project",
    id: string,
    nodes:  {
      __typename: "ModelNodeConnection",
      items:  Array< {
        __typename: "Node",
        id: string,
        projectID: string,
        data: string | null,
        position: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    edges:  {
      __typename: "ModelEdgeConnection",
      items:  Array< {
        __typename: "Edge",
        id: string,
        projectID: string,
        source: string,
        target: string,
        data: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProjectMutationVariables = {
  input: DeleteProjectInput,
  condition?: ModelProjectConditionInput | null,
};

export type DeleteProjectMutation = {
  deleteProject:  {
    __typename: "Project",
    id: string,
    nodes:  {
      __typename: "ModelNodeConnection",
      items:  Array< {
        __typename: "Node",
        id: string,
        projectID: string,
        data: string | null,
        position: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    edges:  {
      __typename: "ModelEdgeConnection",
      items:  Array< {
        __typename: "Edge",
        id: string,
        projectID: string,
        source: string,
        target: string,
        data: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateNodeMutationVariables = {
  input: CreateNodeInput,
  condition?: ModelNodeConditionInput | null,
};

export type CreateNodeMutation = {
  createNode:  {
    __typename: "Node",
    id: string,
    projectID: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    position: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateNodeMutationVariables = {
  input: UpdateNodeInput,
  condition?: ModelNodeConditionInput | null,
};

export type UpdateNodeMutation = {
  updateNode:  {
    __typename: "Node",
    id: string,
    projectID: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    position: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteNodeMutationVariables = {
  input: DeleteNodeInput,
  condition?: ModelNodeConditionInput | null,
};

export type DeleteNodeMutation = {
  deleteNode:  {
    __typename: "Node",
    id: string,
    projectID: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    position: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateEdgeMutationVariables = {
  input: CreateEdgeInput,
  condition?: ModelEdgeConditionInput | null,
};

export type CreateEdgeMutation = {
  createEdge:  {
    __typename: "Edge",
    id: string,
    projectID: string,
    source: string,
    target: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateEdgeMutationVariables = {
  input: UpdateEdgeInput,
  condition?: ModelEdgeConditionInput | null,
};

export type UpdateEdgeMutation = {
  updateEdge:  {
    __typename: "Edge",
    id: string,
    projectID: string,
    source: string,
    target: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteEdgeMutationVariables = {
  input: DeleteEdgeInput,
  condition?: ModelEdgeConditionInput | null,
};

export type DeleteEdgeMutation = {
  deleteEdge:  {
    __typename: "Edge",
    id: string,
    projectID: string,
    source: string,
    target: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetProjectQueryVariables = {
  id: string,
};

export type GetProjectQuery = {
  getProject:  {
    __typename: "Project",
    id: string,
    nodes:  {
      __typename: "ModelNodeConnection",
      items:  Array< {
        __typename: "Node",
        id: string,
        projectID: string,
        data: string | null,
        position: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    edges:  {
      __typename: "ModelEdgeConnection",
      items:  Array< {
        __typename: "Edge",
        id: string,
        projectID: string,
        source: string,
        target: string,
        data: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProjectsQueryVariables = {
  filter?: ModelProjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectsQuery = {
  listProjects:  {
    __typename: "ModelProjectConnection",
    items:  Array< {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetNodeQueryVariables = {
  id: string,
};

export type GetNodeQuery = {
  getNode:  {
    __typename: "Node",
    id: string,
    projectID: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    position: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListNodesQueryVariables = {
  filter?: ModelNodeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListNodesQuery = {
  listNodes:  {
    __typename: "ModelNodeConnection",
    items:  Array< {
      __typename: "Node",
      id: string,
      projectID: string,
      project:  {
        __typename: "Project",
        id: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      data: string | null,
      position: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetEdgeQueryVariables = {
  id: string,
};

export type GetEdgeQuery = {
  getEdge:  {
    __typename: "Edge",
    id: string,
    projectID: string,
    source: string,
    target: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListEdgesQueryVariables = {
  filter?: ModelEdgeFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEdgesQuery = {
  listEdges:  {
    __typename: "ModelEdgeConnection",
    items:  Array< {
      __typename: "Edge",
      id: string,
      projectID: string,
      source: string,
      target: string,
      project:  {
        __typename: "Project",
        id: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      data: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateProjectSubscription = {
  onCreateProject:  {
    __typename: "Project",
    id: string,
    nodes:  {
      __typename: "ModelNodeConnection",
      items:  Array< {
        __typename: "Node",
        id: string,
        projectID: string,
        data: string | null,
        position: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    edges:  {
      __typename: "ModelEdgeConnection",
      items:  Array< {
        __typename: "Edge",
        id: string,
        projectID: string,
        source: string,
        target: string,
        data: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProjectSubscription = {
  onUpdateProject:  {
    __typename: "Project",
    id: string,
    nodes:  {
      __typename: "ModelNodeConnection",
      items:  Array< {
        __typename: "Node",
        id: string,
        projectID: string,
        data: string | null,
        position: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    edges:  {
      __typename: "ModelEdgeConnection",
      items:  Array< {
        __typename: "Edge",
        id: string,
        projectID: string,
        source: string,
        target: string,
        data: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProjectSubscription = {
  onDeleteProject:  {
    __typename: "Project",
    id: string,
    nodes:  {
      __typename: "ModelNodeConnection",
      items:  Array< {
        __typename: "Node",
        id: string,
        projectID: string,
        data: string | null,
        position: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    edges:  {
      __typename: "ModelEdgeConnection",
      items:  Array< {
        __typename: "Edge",
        id: string,
        projectID: string,
        source: string,
        target: string,
        data: string | null,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateNodeSubscription = {
  onCreateNode:  {
    __typename: "Node",
    id: string,
    projectID: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    position: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateNodeSubscription = {
  onUpdateNode:  {
    __typename: "Node",
    id: string,
    projectID: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    position: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteNodeSubscription = {
  onDeleteNode:  {
    __typename: "Node",
    id: string,
    projectID: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    position: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateEdgeSubscription = {
  onCreateEdge:  {
    __typename: "Edge",
    id: string,
    projectID: string,
    source: string,
    target: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateEdgeSubscription = {
  onUpdateEdge:  {
    __typename: "Edge",
    id: string,
    projectID: string,
    source: string,
    target: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteEdgeSubscription = {
  onDeleteEdge:  {
    __typename: "Edge",
    id: string,
    projectID: string,
    source: string,
    target: string,
    project:  {
      __typename: "Project",
      id: string,
      nodes:  {
        __typename: "ModelNodeConnection",
        nextToken: string | null,
      } | null,
      edges:  {
        __typename: "ModelEdgeConnection",
        nextToken: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    data: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
