import '@utils/addFlexLayout'
import cytoscape from 'cytoscape'
import * as PIXI from 'pixi.js'
// @ts-ignore
import euler from 'cytoscape-euler'
// @ts-ignore
import cise from 'cytoscape-cise'
import d3Force from 'cytoscape-d3-force'
import cola from 'cytoscape-cola'
import avsdf from 'cytoscape-avsdf'
import dagre from 'cytoscape-dagre'
import spread from 'cytoscape-spread'
import klay from 'cytoscape-klay'

cytoscape.use(klay)
spread(cytoscape)
cytoscape.use(dagre)
cytoscape.use(avsdf)
cytoscape.use(euler)
cytoscape.use(cise)
cytoscape.use(cola)
cytoscape.use(d3Force)

PIXI.settings.ROUND_PIXELS = true
PIXI.settings.PRECISION_FRAGMENT = 'highp'
PIXI.settings.RESOLUTION = 32// 64// window.devicePixelRatio
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
