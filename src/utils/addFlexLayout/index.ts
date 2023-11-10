import * as PIXI from 'pixi.js'
import {IS_FLEX_DEFAULT} from '@utils'
import {initializeYogaLayout, yogaSetRenderer} from './flex-layout'

if (IS_FLEX_DEFAULT) {
  console.log('FLEX_LAYOUT_ADDED')
  initializeYogaLayout()
  // @ts-ignore
  yogaSetRenderer(PIXI.autoDetectRenderer())
}

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
