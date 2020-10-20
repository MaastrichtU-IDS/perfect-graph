// import {
//   EdgeSingular, LayoutOptions, Layouts, NodeSingular,
// } from 'cytoscape'
// import { useMemo } from 'react'
// import * as graphUtil from '../utils'
// import { graphs } from './useGraph'


// export const layouts: Record<string, Layouts> = {}
// export type Props = {
//   graphID: string;
//   options: LayoutOptions;
//   onReady: (layout: Layouts) => void;
//   onStart: (layout: Layouts) => void;
//   onStop: (layout: Layouts) => void;
//   filter: (cy: EdgeSingular|NodeSingular) => boolean | string[];
// }
// // const anim = new Animation({
// //   autoplay: false,
// //   from: {
// //     ...node.position(),
// //   },
// //   to: position,
// //   update: (s) => {
// //     node.position(s)
// //     getContext(node).render()
// //   },
// // })
// // anim.play()
// export default (props: Props) => {
//   const {
//     onReady,
//     onStart,
//     onStop,
//     graphID,
//     options,
//     filter,
//   } = props
//   const layout = useMemo(() => {
//     // const layoutInstance = cy.createLayout({
//     //   name: 'grid',
//     //   fit: true, // whether to fit the viewport to the graph
//     //   padding: 30, // padding used on fit
//     //   boundingBox: {
//     //     x1: 0, y1: 0, w: width, h: height,
//     //   }, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//     //   avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//     //   avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
//     //   nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
//     //   spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
//     //   condense: false, // uses all available space on false, uses minimal space on true
//     //   rows: undefined, // force num of rows in the grid
//     //   cols: undefined, // force num of columns in the grid
//     //   position(node) {}, // returns { row, col } for element
//     //   sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
//     //   animate: false, // whether to transition the node positions
//     //   animationDuration: 500, // duration of animation in ms if enabled
//     //   animationEasing: undefined, // easing of animation if enabled
//     //   animateFilter(node, i) { return true }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
//     //   ready: undefined, // callback on layoutready
//     //   stop: undefined, // callback on layoutstop
//     //   transform(node, position) {
//     // const anim = new Animation({
//     //   autoplay: false,
//     //   from: {
//     //     ...node.position(),
//     //   },
//     //   to: position,
//     //   update: (s) => {
//     //     node.position(s)
//     //     getContext(node).render()
//     //   },
//     // })
//     // anim.play()
//     //     return position
//     //   },
//     // })
//     let cy = graphs[graphID]
//     if (filter) {
//       // @ts-ignore
//       cy = graphUtil.filter(cy, filter)
//     }
//     const layoutInstance = cy.createLayout(options)
//     if (onReady) {
//       layout.on('layoutready', () => onReady(layoutInstance))
//     }
//     if (onStart) {
//       layout.on('layoutstart', () => onStart(layoutInstance))
//     }
//     if (onStop) {
//       layout.on('layoutstop', () => onStop(layoutInstance))
//     }
//     return layoutInstance
//   }, [filter, graphID, onReady, onStart, onStop, options])
//   return {
//     layout,
//   }
// }
