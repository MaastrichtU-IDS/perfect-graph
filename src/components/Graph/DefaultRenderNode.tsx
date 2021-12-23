import { RenderNode } from '@type'
import { cyUnselectAll } from '@utils'
import React from 'react'
import { Text as GraphText } from '../Text'
import { View as GraphView } from '../View'

export const DefaultRenderNode: RenderNode = ({
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
  // const isThereSelected = cy.elements(':selected').length > 0
  const alpha = 1
  // isThereSelected && (hasSelectedEdge || element.selected())
  //   ? 1
  //   : 0.5
  return (
    <GraphView
      width={width}
      height={height}
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
      radius={radius}
      interactive
      alpha={alpha}
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
