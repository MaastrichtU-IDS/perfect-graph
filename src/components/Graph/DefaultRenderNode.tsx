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
      style={{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        backgroundColor: hasSelectedEdge
          ? theme.palette.secondary.main
          : (element.selected()
            ? theme.palette.primary.main
            : theme.palette.background.paper),
        borderRadius: 50,
      }}
      interactive
      pointertap={() => {
        cyUnselectAll(cy)
        element.select()
      }}
    >
      <GraphText
        style={{
          position: 'absolute',
          top: -40,
          color: 'black',
        }}
        isSprite
      >
        {R.last(item.id.split('/'))?.substring(0, 10) ?? item.id}
      </GraphText>
    </GraphView>
  )
}
