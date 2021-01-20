import * as PIXI from 'pixi.js'
import { initializeYogaLayout, yogaSetRenderer } from './flex-layout'

initializeYogaLayout()
yogaSetRenderer(PIXI.autoDetectRenderer())

// const containerStyle = {
//   justifyContent: 'space-between',
//   flexWrap: 'wrap',
//   width: 200,
// }

// const container = new PIXI.Container()
// container.flex = true
// container.yoga.fromConfig(containerStyle)
// container.yoga.flexDirection = 'row'
// container.yoga.animationConfig = {
//   time: 200,
//   easing: (t) => t,
// }
