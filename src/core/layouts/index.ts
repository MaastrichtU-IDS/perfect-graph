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
  euler: {
    name: 'euler',

    // The ideal length of a spring
    // - This acts as a hint for the edge length
    // - The edge length can be longer or shorter if the forces are set to extreme values
    // springLength: (edge) => 80,
    springLength: (edge) => 400,

    // Hooke's law coefficient
    // - The value ranges on [0, 1]
    // - Lower values give looser springs
    // - Higher values give tighter springs
    springCoeff: (edge) => 0.0008,

    // The mass of the node in the physics simulation
    // - The mass affects the gravity node repulsion/attraction
    // mass: (node) => 4,
    mass: (node) => 40,

    // Coulomb's law coefficient
    // - Makes the nodes repel each other for negative values
    // - Makes the nodes attract each other for positive values
    gravity: -1.2,

    // A force that pulls nodes towards the origin (0, 0)
    // Higher values keep the components less spread out
    pull: 0.001,

    // Theta coefficient from Barnes-Hut simulation
    // - Value ranges on [0, 1]
    // - Performance is better with smaller values
    // - Very small values may not create enough force to give a good result
    theta: 0.666,

    // Friction / drag coefficient to make the system stabilise over time
    dragCoeff: 0.02,

    // When the total of the squared position deltas is less than this value, the simulation ends
    movementThreshold: 1,

    // The amount of time passed per tick
    // - Larger values result in faster runtimes but might spread things out too far
    // - Smaller values produce more accurate results
    timeStep: 20,

    // The number of ticks per frame for animate:true
    // - A larger value reduces rendering cost but can be jerky
    // - A smaller value increases rendering cost but is smoother
    refresh: 10,

    // Maximum iterations and time (in ms) before the layout will bail out
    // - A large value may allow for a better result
    // - A small value may make the layout end prematurely
    // - The layout may stop before this if it has settled
    maxIterations: 1000,
    // maxSimulationTime: 4000,

    // Prevent the user grabbing nodes during the layout (usually with animate:true)
    ungrabifyWhileSimulating: false,

    // Whether to fit the viewport to the repositioned graph
    // true : Fits at end of layout for animate:false or animate:'end'; fits on each frame for animate:true
    // fit: true,

    // Padding in rendered co-ordinates around the layout
    padding: 30,

    // Constrain layout bounds with one of
    // - { x1, y1, x2, y2 }
    // - { x1, y1, w, h }
    // - undefined / null : Unconstrained
    boundingBox: undefined,
    avoidOverlap: true,

    // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
    ready() {}, // on layoutready
    stop() {}, // on layoutstop

    // Whether to randomize the initial positions of the nodes
    // true : Use random positions within the bounding box
    // false : Use the current node positions as the initial positions
    randomize: false,
    ...animationOptions,
  },
  // cise: {
  //   name: 'cise',

  //   // ClusterInfo can be a 2D array contaning node id's or a function that returns cluster ids.
  //   // For the 2D array option, the index of the array indicates the cluster ID for all elements in
  //   // the collection at that index. Unclustered nodes must NOT be present in this array of clusters.
  //   //
  //   // For the function, it would be given a Cytoscape node and it is expected to return a cluster id
  //   // corresponding to that node. Returning negative numbers, null or undefined is fine for unclustered
  //   // nodes.
  //   // e.g
  //   // Array:                                     OR          function(node){
  //   //  [ ['n1','n2','n3'],                                       ...
  //   //    ['n5','n6']                                         }
  //   //    ['n7', 'n8', 'n9', 'n10'] ]
  //   // clusters: clusterInfo,

  //   // -------- Optional parameters --------
  //   // Whether to animate the layout
  //   // - true : Animate while the layout is running
  //   // - false : Just show the end result
  //   // - 'end' : Animate directly to the end result
  //   animate: false,

  //   // number of ticks per frame; higher is faster but more jerky
  //   refresh: 10,

  //   // Animation duration used for animate:'end'
  //   animationDuration: undefined,

  //   // Easing for animate:'end'
  //   animationEasing: undefined,

  //   // Whether to fit the viewport to the repositioned graph
  //   // true : Fits at end of layout for animate:false or animate:'end'
  //   fit: true,

  //   // Padding in rendered co-ordinates around the layout
  //   padding: 30,

  //   // separation amount between nodes in a cluster
  //   // note: increasing this amount will also increase the simulation time
  //   nodeSeparation: 12.5,

  //   // Inter-cluster edge length factor
  //   // (2.0 means inter-cluster edges should be twice as long as intra-cluster edges)
  //   idealInterClusterEdgeLengthCoefficient: 1.4,

  //   // Whether to pull on-circle nodes inside of the circle
  //   allowNodesInsideCircle: false,

  //   // Max percentage of the nodes in a circle that can move inside the circle
  //   maxRatioOfNodesInsideCircle: 0.1,

  //   // - Lower values give looser springs
  //   // - Higher values give tighter springs
  //   springCoeff: 0.45,

  //   // Node repulsion (non overlapping) multiplier
  //   nodeRepulsion: 4500,

  //   // Gravity force (constant)
  //   gravity: 0.25,

  //   // Gravity range (constant)
  //   gravityRange: 3.8,

  //   // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
  //   ready() {}, // on layoutready
  //   stop() {}, // on layoutstop
  //   ...animationOptions,
  // },
} as const
