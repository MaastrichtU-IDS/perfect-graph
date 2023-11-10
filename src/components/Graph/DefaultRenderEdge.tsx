import {RenderEdge} from '@type'
import {cyUnselectAll} from '@utils'
import React from 'react'
import {Text as GraphText} from '../Text'
import {View as GraphView} from '../View'

/**
 * Default render edge component. If renderEdge is not suplied, it will render.
 */
export const DefaultRenderEdge: RenderEdge = ({
  cy,
  element,
  config,
  // item,
  label
}) => {
  const {
    view: {labelVisible}
  } = config

  return (
    <GraphView
      pointertap={() => {
        cyUnselectAll(cy)
        element.select()
      }}
    >
      {labelVisible && <GraphText text={label} />}
    </GraphView>
  )
}
