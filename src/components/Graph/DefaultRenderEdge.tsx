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
      // width: 20,
      // height: 20,
      position: 'absolute',

      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
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
      style={{
        // position: 'absolute',
        // top: -40,
        // backgroundColor: DefaultTheme.palette.background.paper,
        color: 'black',
        fontSize: 12,
      }}
      isSprite
    >
      {R.last(item.id.split('/'))?.substring(0, 10) ?? item.id}
    </GraphText>
  </GraphView>
)
