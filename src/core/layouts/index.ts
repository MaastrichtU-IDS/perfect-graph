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
  cise: {
    name: 'cise',

    // ClusterInfo can be a 2D array contaning node id's or a function that returns cluster ids.
    // For the 2D array option, the index of the array indicates the cluster ID for all elements in
    // the collection at that index. Unclustered nodes must NOT be present in this array of clusters.
    //
    // For the function, it would be given a Cytoscape node and it is expected to return a cluster id
    // corresponding to that node. Returning negative numbers, null or undefined is fine for unclustered
    // nodes.
    // e.g
    // Array:                                     OR          function(node){
    //  [ ['n1','n2','n3'],                                       ...
    //    ['n5','n6']                                         }
    //    ['n7', 'n8', 'n9', 'n10'] ]
    // clusters: clusterInfo,

    // -------- Optional parameters --------
    // Whether to animate the layout
    // - true : Animate while the layout is running
    // - false : Just show the end result
    // - 'end' : Animate directly to the end result
    animate: false,

    // number of ticks per frame; higher is faster but more jerky
    refresh: 10,

    // Animation duration used for animate:'end'
    animationDuration: undefined,

    // Easing for animate:'end'
    animationEasing: undefined,

    // Whether to fit the viewport to the repositioned graph
    // true : Fits at end of layout for animate:false or animate:'end'
    fit: true,

    // Padding in rendered co-ordinates around the layout
    padding: 30,

    // separation amount between nodes in a cluster
    // note: increasing this amount will also increase the simulation time
    nodeSeparation: 12.5,

    // Inter-cluster edge length factor
    // (2.0 means inter-cluster edges should be twice as long as intra-cluster edges)
    idealInterClusterEdgeLengthCoefficient: 1.4,

    // Whether to pull on-circle nodes inside of the circle
    allowNodesInsideCircle: false,

    // Max percentage of the nodes in a circle that can move inside the circle
    maxRatioOfNodesInsideCircle: 0.1,

    // - Lower values give looser springs
    // - Higher values give tighter springs
    springCoeff: 0.45,

    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: 4500,

    // Gravity force (constant)
    gravity: 0.25,

    // Gravity range (constant)
    gravityRange: 3.8,

    // Layout event callbacks; equivalent to `layout.one('layoutready', callback)` for example
    ready() {}, // on layoutready
    stop() {}, // on layoutstop
    ...animationOptions,
  },
  cola: {
    animate: true, // whether to show the layout as it's running
    refresh: 1, // number of ticks per frame; higher is faster but more jerky
    maxSimulationTime: 4000, // max length in ms to run the layout
    ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
    fit: true, // on every layout reposition of nodes, fit the viewport
    padding: 30, // padding around the simulation
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

    // layout event callbacks
    ready() {}, // on layoutready
    stop() {}, // on layoutstop

    // positioning options
    randomize: false, // use random node positions at beginning of layout
    avoidOverlap: true, // if true, prevents overlap of node bounding boxes
    handleDisconnected: true, // if true, avoids disconnected components from overlapping
    convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
    nodeSpacing(node) { return 10 }, // extra spacing around nodes
    flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
    alignment: undefined, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
    gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]

    // different methods of specifying edge length
    // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
    edgeLength: undefined, // sets edge length directly in simulation
    edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
    edgeJaccardLength: undefined, // jaccard edge length in simulation

    // iterations of cola algorithm; uses default values on undefined
    unconstrIter: undefined, // unconstrained initial layout iterations
    userConstIter: undefined, // initial layout iterations with user-specified constraints
    allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
    ...animationOptions,
  },
  avsdf: {
    ready() {
    },
    // Called on `layoutstop`
    stop() {
    },
    // number of ticks per frame; higher is faster but more jerky
    refresh: 30,
    // Whether to fit the network view after when done
    fit: true,
    // Padding on fit
    padding: 10,
    // Prevent the user grabbing nodes during the layout (usually with animate:true)
    ungrabifyWhileSimulating: false,
    // Type of layout animation. The option set is {'during', 'end', false}
    animate: 'end',
    // Duration for animate:end
    animationDuration: 500,
    // How apart the nodes are
    nodeSeparation: 60,
    ...animationOptions,
  },
  dagre: {
    nodeSep: undefined, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: undefined, // the separation between each rank in the layout
    rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen(edge) { return 1 }, // number of ranks to keep between the source and target of the edge
    edgeWeight(edge) { return 1 }, // higher weight edges are generally made shorter and straighter than lower weight edges

    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
    animate: false, // whether to transition the node positions
    animateFilter(node, i) { return true }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    transform(node, pos) { return pos }, // a function that applies a transform to the final node position
    ready() {}, // on layoutready
    stop() {}, // on layoutstop
    ...animationOptions,
  },
  spread: {
    animate: true, // Whether to show the layout as it's running
    ready: undefined, // Callback on layoutready
    stop: undefined, // Callback on layoutstop
    fit: true, // Reset viewport to fit default simulationBounds
    minDist: 20, // Minimum distance between nodes
    padding: 20, // Padding
    expandingFactor: -1.0, // If the network does not satisfy the minDist
    // criterium then it expands the network of this amount
    // If it is set to -1.0 the amount of expansion is automatically
    // calculated based on the minDist, the aspect ratio and the
    // number of nodes
    prelayout: { name: 'cose' }, // Layout options for the first phase
    maxExpandIterations: 4, // Maximum number of expanding iterations
    boundingBox: undefined, // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    randomize: false, // Uses random initial node positions on true
    ...animationOptions,
  },
  klay: {
    // nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
    // fit: true, // Whether to fit
    // padding: 20, // Padding on fit
    // animate: false, // Whether to transition the node positions
    // animateFilter(node, i) { return true }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    // animationDuration: 500, // Duration of animation in ms if enabled
    // animationEasing: undefined, // Easing of animation if enabled
    // transform(node, pos) { return pos }, // A function that applies a transform to the final node position
    // ready: undefined, // Callback on layoutready
    // stop: undefined, // Callback on layoutstop
    // klay: {
    // // Following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
    //   addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
    //   aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
    //   borderSpacing: 20, // Minimal amount of space to be left to the border
    //   compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
    //   crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
    //   /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
    // INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
    //   cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
    //   /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
    // INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values. */
    //   direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
    //   /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
    //   edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
    //   edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
    //   feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
    //   fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
    //   /* NONE Chooses the smallest layout from the four possible candidates.
    // LEFTUP Chooses the left-up candidate from the four possible candidates.
    // RIGHTUP Chooses the right-up candidate from the four possible candidates.
    // LEFTDOWN Chooses the left-down candidate from the four possible candidates.
    // RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
    // BALANCED Creates a balanced layout from the four possible candidates. */
    //   inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
    //   layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
    //   linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
    //   mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
    //   mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
    //   nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering.
    //   /* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
    // LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
    // INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
    //   nodePlacement: 'BRANDES_KOEPF', // Strategy for Node Placement
    //   /* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
    // LINEAR_SEGMENTS Computes a balanced placement.
    // INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
    // SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
    //   randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
    //   routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
    //   separateConnectedComponents: true, // Whether each connected component should be processed separately
    //   spacing: 20, // Overall setting for the minimal amount of space to be left between objects
    //   thoroughness: 7, // How much effort should be spent to produce a nice layout..
    // },
    // priority(edge) { return null }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
    // ...animationOptions,
  },
  // 'd3-force': {
  //   animate: true, // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
  //   maxIterations: 0, // max iterations before the layout will bail out
  //   maxSimulationTime: 0, // max length in ms to run the layout
  //   ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  //   fixedAfterDragging: false, // fixed node after dragging
  //   fit: false, // on every layout reposition of nodes, fit the viewport
  //   padding: 30, // padding around the simulation
  //   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  //   /** d3-force API* */
  //   alpha: 1, // sets the current alpha to the specified number in the range [0,1]
  //   alphaMin: 0.001, // sets the minimum alpha to the specified number in the range [0,1]
  //   alphaDecay: 1 - Math.pow(0.001, 1 / 300), // sets the alpha decay rate to the specified number in the range [0,1]
  //   alphaTarget: 0, // sets the current target alpha to the specified number in the range [0,1]
  //   velocityDecay: 0.4, // sets the velocity decay factor to the specified number in the range [0,1]
  //   collideRadius: 1, // sets the radius accessor to the specified number or function
  //   collideStrength: 0.7, // sets the force strength to the specified number in the range [0,1]
  //   collideIterations: 1, // sets the number of iterations per application to the specified number
  //   linkId: function id(d) {
  //     return d.index
  //   }, // sets the node id accessor to the specified function
  //   linkDistance: 30, // sets the distance accessor to the specified number or function
  //   linkStrength: function strength(link) {
  //     return 1 / Math.min(count(link.source), count(link.target))
  //   }, // sets the strength accessor to the specified number or function
  //   linkIterations: 1, // sets the number of iterations per application to the specified number
  //   manyBodyStrength: -30, // sets the strength accessor to the specified number or function
  //   manyBodyTheta: 0.9, // sets the Barnes–Hut approximation criterion to the specified number
  //   manyBodyDistanceMin: 1, // sets the minimum distance between nodes over which this force is considered
  //   manyBodyDistanceMax: Infinity, // sets the maximum distance between nodes over which this force is considered
  //   xStrength: 0.1, // sets the strength accessor to the specified number or function
  //   xX: 0, // sets the x-coordinate accessor to the specified number or function
  //   yStrength: 0.1, // sets the strength accessor to the specified number or function
  //   yY: 0, // sets the y-coordinate accessor to the specified number or function
  //   radialStrength: 0.1, // sets the strength accessor to the specified number or function
  //   radialRadius: [20], // sets the circle radius to the specified number or function
  //   radialX: 0, // sets the x-coordinate of the circle center to the specified number
  //   radialY: 0, // sets the y-coordinate of the circle center to the specified number
  //   // layout event callbacks
  //   ready() {}, // on layoutready
  //   stop() {}, // on layoutstop
  //   tick(progress) {}, // on every iteration
  //   // positioning options
  //   randomize: false, // use random node positions at beginning of layout
  //   // infinite layout options
  //   infinite: false, // overrides all other options for a forces-all-the-time mode
  // },
} as const
