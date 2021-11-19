import { RenderNode } from '@type'
import { cyUnselectAll } from '@utils'
import * as R from 'colay/ramda'
import React from 'react'
import { Text as GraphText } from '../Text'
import { View as GraphView } from '../View'

export const DefaultRenderNode: RenderNode = ({
  item, element, cy, theme,
}) => {
  const hasSelectedEdge = element.connectedEdges(':selected').length > 0
  return (
    <GraphView
      width={50}
      height={50}
      fill={hasSelectedEdge
        ? theme.palette.secondary.main
        : (element.selected()
          ? theme.palette.primary.main
          : theme.palette.background.paper)}
      radius={50}
      interactive
      pointertap={() => {
        cyUnselectAll(cy)
        element.select()
      }}
    >
      <GraphText
        // isSprite
        // text={R.last(item.id.split('/'))?.substring(0, 10) ?? item.id}
        text={'Node'}
      />
    </GraphView>
  )
}
