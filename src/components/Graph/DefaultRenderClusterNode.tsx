import { RenderNode } from '@type'
import { cyUnselectAll } from '@utils'
import * as R from 'colay/ramda'
import React from 'react'
import { Text as GraphText } from '../Text'
import { View as GraphView } from '../View'

export const DefaultRenderClusterNode: RenderNode = ({
  item, element,
  cy,
  config,
}) => {
  const hasSelectedEdge = element.connectedEdges(':selected').length > 0
  const {
    view: {
      width,
      height,
      radius,
      fill,
      labelVisible,
    },
  } = config
  return (
    <GraphView
      width={150}
      height={150}
      fill={hasSelectedEdge
        ? fill.edgeSelected
        : (element.selected()
          ? fill.selected
          : (
            element.hovered()
              ? fill.hovered
              : fill.default
          )
        )}
      radius={10}
      interactive
      pointertap={() => {
        cyUnselectAll(cy)
        element.select()
      }}
    >
      {
        labelVisible && (
          <GraphText
            // isSprite
            // text={R.last(item.id.split('/'))?.substring(0, 10) ?? item.id}
            text={'Node'}
          />
        )
      }
    </GraphView>
  )
}
