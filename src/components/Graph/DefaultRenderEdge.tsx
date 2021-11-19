import { RenderEdge } from '@type'
import { cyUnselectAll } from '@utils'
import * as R from 'colay/ramda'
import React from 'react'
import { Text as GraphText } from '../Text'
import { View as GraphView } from '../View'

export const DefaultRenderEdge: RenderEdge = ({
  cy,
  item,
  element,
}) => (
  <GraphView
    style={{
      // backgroundColor: DefaultTheme.palette.background.paper,
      // element.selected()
      //   ? DefaultTheme.palette.primary.main
      //   : DefaultTheme.palette.background.paper,
      // borderRadius: 50,
    }}
    pointertap={() => {
      cyUnselectAll(cy)
      element.select()
    }}
  >
    <GraphText
      isSprite
      text={R.last(item.id.split('/'))?.substring(0, 10) ?? item.id}
    />
  </GraphView>
)
