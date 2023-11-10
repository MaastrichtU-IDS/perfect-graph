// @ts-nocheck

import * as R from 'colay/ramda'
import {Core, EdgeSingular, NodeSingular, Collection} from 'cytoscape'

// configSchema: {
//   required: [],
//   properties: {

//   },
// },

const getAttribute = (params: {pathText: string; nodes: any[]; edges: any[]}) => (element: any) => {
  const {pathText, nodes = [], edges = []} = params
  const id = element.id()
  const item = (element.isNode() ? nodes : edges).find(item => item.id === id)
  return R.path(pathText.split('.'), item)
}

type ClusterAlgorithm = {
  get: (arg: {cy: cytoscape.Core; attributes: string}) => Collection[]
  getByItem: (arg: {
    cy: Core
    attributes: string
    nodes: NodeSingular[]
    edges: EdgeSingular[]
  }) => cytoscape.Collection[]
  configSchema: any
  configForm: any
}
export const Clusters: Record<string, ClusterAlgorithm> = {
  markov: {
    /**
     * @function
     * @param {{ cy: cytoscape.Core, attributes: [string] | string}} options
     *  @return {}
     */
    // @ts-ignore
    get: ({cy, attributes, ...options}) =>
      cy.elements().markovClustering({
        ...options,
        attributes: [(edge: EdgeSingular) => edge.data(attributes)]
      }),
    getByItem: ({
      cy,
      nodes,
      edges,
      attributes,
      ...options
      // @ts-ignore
    }) =>
      cy.elements().markovClustering({
        ...options,
        attributes: [
          getAttribute({
            edges,
            nodes,
            pathText: attributes
          })
        ]
      }),
    configSchema: {
      required: ['attributes'],
      properties: {
        attributes: {
          type: 'string',
          default: 'label',
          info: 'each of which returns a numeric attribute value for the specified edge. Attributes are used to cluster the nodes; i.e. the attributes of an edge indicate similarity between its nodes.'
        },
        expandFactor: {
          type: 'number',
          default: 2,
          info: 'A number that affects time of computation and cluster granularity to some extent: M * M (defaultValue 2)'
        },
        inflateFactor: {
          type: 'number',
          default: 1,
          info: 'A number that affects cluster granularity (the greater the value, the more clusters): M(i,j) / E(j)'
        },
        multFactor: {
          type: 'number',
          default: 1,
          info: 'Optional number of self loops for each node. Use a neutral value to improve cluster computations'
        },
        maxIterations: {
          type: 'number',
          default: 20,
          info: 'Maximum number of iterations of the MCL algorithm in a single run'
        }
      }
    },
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified edge. Attributes are used to cluster the nodes; i.e. the attributes of an edge indicate similarity between its nodes.',
        required: true
      },
      expandFactor: {
        type: 'number',
        defaultValue: 2,
        info: 'A number that affects time of computation and cluster granularity to some extent: M * M (defaultValue 2)'
      },
      inflateFactor: {
        type: 'number',
        defaultValue: 1,
        info: 'A number that affects cluster granularity (the greater the value, the more clusters): M(i,j) / E(j)'
      },
      multFactor: {
        type: 'number',
        defaultValue: 1,
        info: 'Optional number of self loops for each node. Use a neutral value to improve cluster computations'
      },
      maxIterations: {
        type: 'number',
        defaultValue: 20,
        info: 'Maximum number of iterations of the MCL algorithm in a single run'
      }
    }
  },
  kMeans: {
    /**
     * @function
     * @param {{ cy: cytoscape,attributes: [string] | string, k: number}} options
     *  @return {function}
     */
    // @ts-ignore
    get: ({cy, attributes, ...options}) =>
      cy.nodes().kMeans({
        ...options,
        attributes: [(node: NodeSingular) => node.data(attributes)]
      }),
    getByItem: ({
      cy,
      nodes,
      edges,
      attributes,
      ...options
      // @ts-ignore
    }) =>
      cy.elements().kMeans({
        ...options,
        attributes: [
          getAttribute({
            edges,
            nodes,
            pathText: attributes
          })
        ]
      }),
    configSchema: {
      required: ['attributes', 'k', 'distance'],
      properties: {
        attributes: {
          type: 'string',
          default: 'label',
          info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense. Attributes must be specified unless a custom distance: function( nodeP, nodeQ ) is specified.'
        },
        k: {
          type: 'number',
          default: 2,
          info: 'The number of clusters to return.'
        },
        distance: {
          type: 'string',
          default: 'euclidean',
          enum: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
          info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.'
        },
        maxIterations: {
          type: 'number',
          default: 10,
          info: 'The maximum number of iterations of the algorithm to run '
        },
        sensitivityThreshold: {
          type: 'number',
          default: 0.001,
          info: 'The coefficients difference threshold used to determine whether the algorithm has converged'
        }
      }
    },
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense. Attributes must be specified unless a custom distance: function( nodeP, nodeQ ) is specified.',
        required: true
      },
      k: {
        type: 'number',
        defaultValue: 2,
        info: 'The number of clusters to return.',
        required: true
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true
      },
      maxIterations: {
        type: 'number',
        defaultValue: 10,
        info: 'The maximum number of iterations of the algorithm to run '
      },
      sensitivityThreshold: {
        type: 'number',
        defaultValue: 0.001,
        info: 'The coefficients difference threshold used to determine whether the algorithm has converged'
      }
    }
  },
  kMedoids: {
    /**
     * @function
     * @param {{ cy: cytoscape,attributes: [string] | string, k: number}} options
     *  @return {function}
     */
    // @ts-ignore
    get: ({cy, attributes, ...options}) =>
      cy.nodes().kMedoids({
        ...options,
        attributes: [(node: NodeSingular) => node.data(attributes)]
      }),
    getByItem: ({cy, nodes, edges, attributes, ...options}) =>
      cy.elements().kMedoids({
        ...options,
        attributes: [
          getAttribute({
            edges,
            nodes,
            pathText: attributes
          })
        ]
      }),
    configSchema: {
      required: ['attributes', 'k', 'distance'],
      properties: {
        attributes: {
          type: 'string',
          default: 'label',
          info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense'
        },
        k: {
          type: 'number',
          default: 2,
          info: 'The number of clusters to return.'
        },
        distance: {
          type: 'string',
          default: 'euclidean',
          enum: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
          info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.'
        },
        maxIterations: {
          type: 'number',
          default: 10,
          info: 'The maximum number of iterations of the algorithm to run '
        }
      }
    },
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true
      },
      k: {
        type: 'number',
        defaultValue: 2,
        info: 'The number of clusters to return.',
        required: true
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true
      },
      maxIterations: {
        type: 'number',
        defaultValue: 10,
        info: 'The maximum number of iterations of the algorithm to run '
      }
    }
  },
  fuzzyCMeans: {
    /**
     * @function
     * @param {{ cy: cytoscape,attributes: [string] | string, k: number}} options
     *  @return {function}
     */
    get: ({cy, attributes, ...options}) =>
      cy.nodes().fuzzyCMeans({
        ...options,
        attributes: [(node: NodeSingular) => node.data(attributes)]
      }),
    getByItem: ({
      cy,
      nodes,
      edges,
      attributes,
      ...options
      // @ts-ignore
    }) =>
      cy.elements().fuzzyCMeans({
        ...options,
        attributes: [
          getAttribute({
            edges,
            nodes,
            pathText: attributes
          })
        ]
      }),
    configSchema: {
      required: ['attributes', 'k', 'distance'],
      properties: {
        attributes: {
          type: 'string',
          default: 'label',
          info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense'
        },
        k: {
          type: 'number',
          default: 2,
          info: 'The number of clusters to return.'
        },
        distance: {
          type: 'string',
          default: 'euclidean',
          enum: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
          info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.'
        },
        maxIterations: {
          type: 'number',
          default: 10,
          info: 'The maximum number of iterations of the algorithm to run '
        },
        sensitivityThreshold: {
          type: 'number',
          default: 0.001,
          info: 'The coefficients difference threshold used to determine whether the algorithm has converged'
        }
      }
    },
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true
      },
      k: {
        type: 'number',
        defaultValue: 2,
        info: 'The number of clusters to return.',
        required: true
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true
      },
      maxIterations: {
        type: 'number',
        defaultValue: 10,
        info: 'The maximum number of iterations of the algorithm to run '
      },
      sensitivityThreshold: {
        type: 'number',
        defaultValue: 0.001,
        info: 'The coefficients difference threshold used to determine whether the algorithm has converged'
      }
    }
  },
  hierarchical: {
    /**
     * @function
     * @param {{ cy: cytoscape,mode: 'threshold', threshold: number, attributes: [string] | string}} param_name
     *  @return {function}
     */
    // @ts-ignore
    get: ({cy, attributes, ...options}) =>
      cy.nodes().hierarchicalClustering({
        ...options,
        attributes: [(node: NodeSingular) => node.data(attributes)]
      }),
    getByItem: ({cy, nodes, edges, attributes, ...options}) =>
      cy.elements().hierarchicalClustering({
        ...options,
        attributes: [
          getAttribute({
            edges,
            nodes,
            pathText: attributes
          })
        ]
      }),
    configSchema: {
      required: ['attributes', 'distance', 'mode'],
      properties: {
        attributes: {
          type: 'string',
          default: 'label',
          info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense'
        },
        distance: {
          type: 'string',
          default: 'euclidean',
          enum: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
          info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
          required: true
        },
        linkage: {
          type: 'string',
          default: 'single',
          enum: ['mean', 'min', 'complete', 'max'],
          info: 'The linkage criterion for measuring the distance between two clusters;'
        },
        mode: {
          type: 'string',
          default: 'threshold',
          enum: ['threshold', 'dendogram'],
          info: " The mode of the algorithm. For 'threshold' (defaultValue), clusters are merged until they are at least the specified distance apart. For 'dendrogram', the clusters are recursively merged using the branches in a dendrogram (tree) structure beyond a specified depth."
        },
        threshold: {
          type: 'number',
          default: null,
          info: "In mode: 'threshold', distance threshold for stopping the algorithm. All pairs of the returned clusters are at least threshold distance apart. Without specifying this value for mode: 'threshold', all clusters will eventually be merged into a single cluster."
        },
        dendrogramDepth: {
          type: 'number',
          default: null,
          info: "In mode: 'dendrogram', the depth beyond which branches are merged in the tree. For example, a value of 0 (defaultValue) results in all branches being merged into a single cluster."
        },
        addDendrogram: {
          type: 'number',
          default: null,
          info: "In mode: 'dendrogram', whether to add nodes and edges to the graph for the dendrogram (defaultValue false). This is not necessary to run the algorithm, but it is useful for visualising the results."
        }
      }
    },
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true
      },
      linkage: {
        type: 'choice',
        defaultValue: 'single',
        choices: ['mean', 'min', 'complete', 'max'],
        info: 'The linkage criterion for measuring the distance between two clusters;'
      },
      mode: {
        type: 'choice',
        defaultValue: 'threshold',
        choices: ['threshold', 'dendogram'],
        info: " The mode of the algorithm. For 'threshold' (defaultValue), clusters are merged until they are at least the specified distance apart. For 'dendrogram', the clusters are recursively merged using the branches in a dendrogram (tree) structure beyond a specified depth.",
        required: true
      },
      threshold: {
        type: 'number',
        defaultValue: null,
        info: "In mode: 'threshold', distance threshold for stopping the algorithm. All pairs of the returned clusters are at least threshold distance apart. Without specifying this value for mode: 'threshold', all clusters will eventually be merged into a single cluster."
      },
      dendrogramDepth: {
        type: 'number',
        defaultValue: null,
        info: "In mode: 'dendrogram', the depth beyond which branches are merged in the tree. For example, a value of 0 (defaultValue) results in all branches being merged into a single cluster."
      },
      addDendrogram: {
        type: 'number',
        defaultValue: null,
        info: "In mode: 'dendrogram', whether to add nodes and edges to the graph for the dendrogram (defaultValue false). This is not necessary to run the algorithm, but it is useful for visualising the results."
      }
    }
  },
  affinityPropagation: {
    /**
     * @function
     * @param {{ cy: cytoscape,attributes: [string] | string}} options
     *  @return {function}
     */
    // @ts-ignore
    get: ({cy, attributes, ...options}) =>
      cy.nodes().affinityPropagation({
        ...options,
        attributes: [(node: NodeSingular) => node.data(attributes)]
      }),
    getByItem: ({
      cy,
      nodes,
      edges,
      attributes,
      ...options
      // @ts-ignore
    }) =>
      cy.elements().affinityPropagation({
        ...options,
        attributes: [
          getAttribute({
            edges,
            nodes,
            pathText: attributes
          })
        ]
      }),
    configSchema: {
      required: ['attributes', 'distance'],
      properties: {
        attributes: {
          type: 'string',
          default: 'label',
          info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense'
        },
        distance: {
          type: 'string',
          default: 'euclidean',
          enum: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
          info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.'
        },
        preference: {
          type: 'string',
          default: 'median',
          enum: ['mean', 'min', 'complete', 'max'],
          info: 'The metric used to determine the suitability of a data point (i.e. node attribute vector) to serve as an exemplar. It may take on one of several special values, which are determined from the similarity matrix (i.e. the negative distance matrix). Or a manual, numeric value may be used (generally of the opposite sign of your distance values)'
        },
        damping: {
          type: 'number',
          default: 0.8,
          maximum: 1,
          minimum: 0.5,
          includeMin: true,
          info: 'A damping factor on [0.5, 1)'
        },
        minIterations: {
          type: 'number',
          default: 100,
          info: 'The minimum number of iteraions the algorithm will run before stopping'
        },
        maxIterations: {
          type: 'number',
          default: 1000,
          info: 'The maximum number of iteraions the algorithm will run before stopping'
        }
      }
    },
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true
      },
      preference: {
        type: 'choice',
        defaultValue: 'median',
        choices: ['mean', 'min', 'complete', 'max'],
        info: 'The metric used to determine the suitability of a data point (i.e. node attribute vector) to serve as an exemplar. It may take on one of several special values, which are determined from the similarity matrix (i.e. the negative distance matrix). Or a manual, numeric value may be used (generally of the opposite sign of your distance values)'
      },
      damping: {
        type: 'number',
        defaultValue: 0.8,
        max: 1,
        min: 0.5,
        includeMin: true,
        info: 'A damping factor on [0.5, 1)'
      },
      minIterations: {
        type: 'number',
        defaultValue: 100,
        info: 'The minimum number of iteraions the algorithm will run before stopping'
      },
      maxIterations: {
        type: 'number',
        defaultValue: 1000,
        info: 'The maximum number of iteraions the algorithm will run before stopping'
      }
    }
  }
} as const
