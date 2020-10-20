// @ts-nocheck
import { animationOptions } from '../animation'

export default {
  cose: {
    name: 'cose',

    // // Called on `layoutready`
    ready() {},

    // // Called on `layoutstop`
    stop() {},

    // // Number of iterations between consecutive screen positions update
    refresh: 20,

    // // Whether to fit the network view after when done
    fit: true,

    // // Padding on fit
    padding: 30,

    // // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    boundingBox: undefined,

    // // Excludes the label when calculating node bounding boxes for the layout algorithm
    nodeDimensionsIncludeLabels: false,

    // // Randomize the initial positions of the nodes (true) or use existing positions (false)
    randomize: false,

    // // Extra spacing between components in non-compound graphs
    componentSpacing: 40,

    // // Node repulsion (non overlapping) multiplier
    nodeRepulsion: (node) => 2048,

    // // Node repulsion (overlapping) multiplier
    nodeOverlap: 4,

    // // Ideal edge (non nested) length
    idealEdgeLength: (edge) => 32,

    // Divisor to compute edge forces
    edgeElasticity: (edge) => 32,

    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 1.2,

    // Gravity force (constant)
    gravity: 1,

    // Maximum number of iterations to perform
    numIter: 1000,

    // Initial temperature (maximum node displacement)
    initialTemp: 1000,

    // Cooling factor (how the temperature is reduced between consecutive iterations
    coolingFactor: 0.99,

    // Lower temperature threshold (below this point the layout will end)
    minTemp: 1.0,
    ...animationOptions,
  },
  breadthfirst: {
    name: 'breadthfirst',

    fit: true, // whether to fit the viewport to the graph
    directed: false, // whether the tree is directed downwards (or edges can point in any direction if false)
    padding: 30, // padding on fit
    circle: false, // put depths in concentric circles if true, put depths top down if false
    grid: false, // whether to create an even grid into which the DAG is placed (circle:false only)
    spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
    roots: undefined, // the roots of the trees
    maximal: false, // whether to shift nodes down their natural BFS depths in order to avoid upwards edges (DAGS only)
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    transform: (node, position) => position, // transform a given node position. Useful for changing flow direction in discrete layouts,
    ...animationOptions,

  },
  concentric: {
    name: 'concentric',

    fit: true, // whether to fit the viewport to the graph
    padding: 30, // the padding on fit
    startAngle: 3 / 2 * Math.PI, // where nodes start in radians
    sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
    clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
    equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
    minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
    height: undefined, // height of layout area (overrides container height)
    width: undefined, // width of layout area (overrides container width)
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    concentric: (node) => // returns numeric value for each node, placing higher nodes in levels towards the centre
      node.degree(),
    levelWidth: (nodes) => // the letiation of concentric values in each level
      nodes.maxDegree() / 4,
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    transform: (node, position) => position, // transform a given node position. Useful for changing flow direction in discrete layouts
    ...animationOptions,
  },
  circle: {
    name: 'circle',

    fit: true, // whether to fit the viewport to the graph
    padding: 30, // the padding on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
    nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    radius: undefined, // the radius of the circle
    startAngle: 3 / 2 * Math.PI, // where nodes start in radians
    sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
    clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
    sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    transform: (node, position) => position, // transform a given node position. Useful for changing flow direction in discrete layouts,
    ...animationOptions,
  },
  grid: {
    name: 'grid',

    fit: true, // whether to fit the viewport to the graph
    padding: 30, // padding used on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
    avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
    nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    condense: false, // uses all available space on false, uses minimal space on true
    rows: undefined, // force num of rows in the grid
    cols: undefined, // force num of columns in the grid
    position: (node) => {}, // returns { row, col } for element
    sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    transform: (node, position) => position, // transform a given node position. Useful for changing flow direction in discrete layouts
    ...animationOptions,
  },
  // preset: {
  //   name: 'preset',

  //   positions: undefined, // map of (node id) => (position obj); or function(node){ return somPos; }
  //   zoom: undefined, // the zoom level to set (prob want fit = false if set)
  //   pan: undefined, // the pan level to set (prob want fit = false if set)
  //   fit: true, // whether to fit to viewport
  //   padding: 30, // padding on fit
  //   animate: false, // whether to transition the node positions
  //   animationDuration: 500, // duration of animation in ms if enabled
  //   animationEasing: undefined, // easing of animation if enabled
  //   animateFilter: (node, i) => true, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  //   ready: undefined, // callback on layoutready
  //   stop: undefined, // callback on layoutstop
  //   transform: (node, position) => position, // transform a given node position. Useful for changing flow direction in discrete layouts
  // },
  random: {
    name: 'random',

    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    transform: (node, position) => position, // transform a given node position. Useful for changing flow direction in discrete layouts
    ...animationOptions,
  },

} as const

export const clusters = {
  markov: {
    /**
                 * @function
                 * @param {{ cy: cytoscape.Core, attributes: [string] | string}} options
                *  @return {}
                 */
    get: ({ cy, attributes, ...options }) => cy.elements().markovClustering({
      ...options,
      attributes: [
        (edge) => edge.data(attributes),
      ],
    }),
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified edge. Attributes are used to cluster the nodes; i.e. the attributes of an edge indicate similarity between its nodes.',
        required: true,
      },
      expandFactor: {
        type: 'number',
        defaultValue: 2,
        info: 'A number that affects time of computation and cluster granularity to some extent: M * M (defaultValue 2)',
      },
      inflateFactor: {
        type: 'number',
        defaultValue: 1,
        info: 'A number that affects cluster granularity (the greater the value, the more clusters): M(i,j) / E(j)',
      },
      multFactor: {
        type: 'number',
        defaultValue: 1,
        info: 'Optional number of self loops for each node. Use a neutral value to improve cluster computations',
      },
      maxIterations: {
        type: 'number',
        defaultValue: 20,
        info: 'Maximum number of iterations of the MCL algorithm in a single run',
      },
    },
  },
  kMeans: {
    /**
                 * @function
                 * @param {{ cy: cytoscape,attributes: [string] | string, k: number}} options
                *  @return {function}
                 */
    get: ({ cy, attributes, ...options }) => cy.nodes().kMeans({
      ...options,
      attributes: [
        (node) => node.data(attributes),
      ],
    }),
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense. Attributes must be specified unless a custom distance: function( nodeP, nodeQ ) is specified.',
        required: true,
      },
      k: {
        type: 'number',
        defaultValue: 2,
        info: 'The number of clusters to return.',
        required: true,
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true,
      },
      maxIterations: {
        type: 'number',
        defaultValue: 10,
        info: 'The maximum number of iterations of the algorithm to run ',
      },
      sensitivityThreshold: {
        type: 'number',
        defaultValue: 0.001,
        info: 'The coefficients difference threshold used to determine whether the algorithm has converged',
      },
    },
  },
  kMedoids: {
    /**
                 * @function
                 * @param {{ cy: cytoscape,attributes: [string] | string, k: number}} options
                *  @return {function}
                 */
    get: ({ cy, attributes, ...options }) => cy.nodes().kMedoids({
      ...options,
      attributes: [
        (node) => node.data(attributes),
      ],
    }),
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true,
      },
      k: {
        type: 'number',
        defaultValue: 2,
        info: 'The number of clusters to return.',
        required: true,
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true,
      },
      maxIterations: {
        type: 'number',
        defaultValue: 10,
        info: 'The maximum number of iterations of the algorithm to run ',
      },
    },
  },
  fuzzyCMeans: {
    /**
                 * @function
                 * @param {{ cy: cytoscape,attributes: [string] | string, k: number}} options
                *  @return {function}
                 */
    get: ({ cy, attributes, ...options }) => cy.nodes().fuzzyCMeans({
      ...options,
      attributes: [
        (node) => node.data(attributes),
      ],
    }),
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true,
      },
      k: {
        type: 'number',
        defaultValue: 2,
        info: 'The number of clusters to return.',
        required: true,
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true,
      },
      maxIterations: {
        type: 'number',
        defaultValue: 10,
        info: 'The maximum number of iterations of the algorithm to run ',
      },
      sensitivityThreshold: {
        type: 'number',
        defaultValue: 0.001,
        info: 'The coefficients difference threshold used to determine whether the algorithm has converged',
      },
    },
  },
  hierarchical: {
    /**
                 * @function
                 * @param {{ cy: cytoscape,mode: 'threshold', threshold: number, attributes: [string] | string}} param_name
                *  @return {function}
                 */
    get: ({ cy, attributes, ...options }) => cy.nodes().hierarchicalClustering({
      ...options,
      attributes: [
        (node) => node.data(attributes),
      ],
    }),
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true,
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true,
      },
      linkage: {
        type: 'choice',
        defaultValue: 'single',
        choices: ['mean', 'min', 'complete', 'max'],
        info: 'The linkage criterion for measuring the distance between two clusters;',
      },
      mode: {
        type: 'choice',
        defaultValue: 'threshold',
        choices: ['threshold', 'dendogram'],
        info: ' The mode of the algorithm. For \'threshold\' (defaultValue), clusters are merged until they are at least the specified distance apart. For \'dendrogram\', the clusters are recursively merged using the branches in a dendrogram (tree) structure beyond a specified depth.',
        required: true,
      },
      threshold: {
        type: 'number',
        defaultValue: null,
        info: 'In mode: \'threshold\', distance threshold for stopping the algorithm. All pairs of the returned clusters are at least threshold distance apart. Without specifying this value for mode: \'threshold\', all clusters will eventually be merged into a single cluster.',
      },
      dendrogramDepth: {
        type: 'number',
        defaultValue: null,
        info: 'In mode: \'dendrogram\', the depth beyond which branches are merged in the tree. For example, a value of 0 (defaultValue) results in all branches being merged into a single cluster.',
      },
      addDendrogram: {
        type: 'number',
        defaultValue: null,
        info: 'In mode: \'dendrogram\', whether to add nodes and edges to the graph for the dendrogram (defaultValue false). This is not necessary to run the algorithm, but it is useful for visualising the results.',
      },
    },
  },
  affinityPropagation: {
    /**
                 * @function
                 * @param {{ cy: cytoscape,attributes: [string] | string}} options
                *  @return {function}
                 */
    get: ({ cy, attributes, ...options }) => cy.nodes().affinityPropagation({
      ...options,
      attributes: [
        (node) => node.data(attributes),
      ],
    }),
    configForm: {
      attributes: {
        type: 'string',
        defaultValue: 'label',
        info: 'each of which returns a numeric attribute value for the specified node. Attributes are used to cluster the nodes; i.e. two nodes with similar attributes tend to be in the same cluster. Each attribute may have to be normalised in order for the chosen distance metric to make sense',
        required: true,
      },
      distance: {
        type: 'choice',
        defaultValue: 'euclidean',
        choices: ['euclidean', 'squaredEuclidean', 'manhattan', 'max'],
        info: 'The distance classifier used to compare attribute vectors. It is optional if attributes are specified.',
        required: true,
      },
      preference: {
        type: 'choice',
        defaultValue: 'median',
        choices: ['mean', 'min', 'complete', 'max'],
        info: 'The metric used to determine the suitability of a data point (i.e. node attribute vector) to serve as an exemplar. It may take on one of several special values, which are determined from the similarity matrix (i.e. the negative distance matrix). Or a manual, numeric value may be used (generally of the opposite sign of your distance values)',
      },
      damping: {
        type: 'number',
        defaultValue: 0.8,
        max: 1,
        min: 0.5,
        includeMin: true,
        info: 'A damping factor on [0.5, 1)',
      },
      minIterations: {
        type: 'number',
        defaultValue: 100,
        info: 'The minimum number of iteraions the algorithm will run before stopping',
      },
      maxIterations: {
        type: 'number',
        defaultValue: 1000,
        info: 'The maximum number of iteraions the algorithm will run before stopping',
      },
    },
  },
} as const
