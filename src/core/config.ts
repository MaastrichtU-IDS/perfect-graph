// import '@utils/addFlexLayout'
import * as PIXI from 'pixi.js'
// @ts-ignore
// import euler from 'cytoscape-euler'
// @ts-ignore
// import cise from 'cytoscape-cise'
// @ts-ignore
// import d3Force from 'cytoscape-d3-force'
// @ts-ignore
// import cola from 'cytoscape-cola'
// @ts-ignore
// import avsdf from 'cytoscape-avsdf'
// @ts-ignore
// import dagre from 'cytoscape-dagre'
// @ts-ignore
// import spread from 'cytoscape-spread'
// @ts-ignore
// import klay from 'cytoscape-klay'

// cytoscape.use(klay)
// spread(cytoscape)
// cytoscape.use(dagre)
// cytoscape.use(avsdf)
// cytoscape.use(euler)
// cytoscape.use(cise)
// cytoscape.use(cola)
// cytoscape.use(d3Force)

// HIGH
// PIXI.settings.ROUND_PIXELS = true
// // @ts-ignore
// PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
// PIXI.settings.RESOLUTION = 32// 64// window.devicePixelRatio
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR

// LOW
PIXI.settings.ROUND_PIXELS = false // true
// @ts-ignore
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.LOW
PIXI.settings.RESOLUTION = 1 // 32// 64// window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
