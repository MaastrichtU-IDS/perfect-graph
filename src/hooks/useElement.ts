import React from 'react'
import { Core, NodeSingular, EdgeSingular } from 'cytoscape'
import {
  ElementContext, Element,
  ElementConfig,
  ElementData,
} from '@type'
import { CYTOSCAPE_EVENT } from '@utils/constants'
import { calculateVisibilityByContext } from '@utils'

export type Props = {
  element: Element;
  item?: ElementData
  cy: Core;
  contextRef: React.RefObject<ElementContext>;
  config?: ElementConfig;
}

type Result = {

}

export const useElement = (props: Props): Result => {
  const {
    // cy,
    element,
    contextRef,
    config = {},
    item,
  } = props
  const {
    renderEvents = [],
  } = config
  // EventListeners
  React.useEffect(
    () => {
      renderEvents.forEach((eventName) => {
        element.on(eventName, () => {
          contextRef.current?.render?.()
        })
      })
      /// ADD SELECT_EDGE and SELECT_NODE Events ***
      const isNode = element.isNode()
      element.on(CYTOSCAPE_EVENT.select, () => {
        if (isNode) {
          (element as NodeSingular).connectedEdges().forEach((edge) => {
            edge.emit(CYTOSCAPE_EVENT.selectNode)
          })
        } else {
          const edge = element as EdgeSingular
          edge.source().emit(CYTOSCAPE_EVENT.selectEdge)
          edge.target().emit(CYTOSCAPE_EVENT.selectEdge)
        }
      })
      element.on(CYTOSCAPE_EVENT.unselect, () => {
        if (isNode) {
          (element as NodeSingular).connectedEdges().forEach((edge) => {
            edge.emit(CYTOSCAPE_EVENT.unselectNode)
          })
        } else {
          const edge = element as EdgeSingular
          edge.source().emit(CYTOSCAPE_EVENT.unselectEdge)
          edge.target().emit(CYTOSCAPE_EVENT.unselectEdge)
        }
      })
      /// ***ADD SELECT_EDGE and SELECT_NODE Events
      return () => {
        renderEvents.forEach((eventName) => {
          element.off(eventName)
        })
        /// ADD SELECT_EDGE and SELECT_NODE Events ***
        element.off(CYTOSCAPE_EVENT.select)
        element.off(CYTOSCAPE_EVENT.unselect)
        /// *** ADD SELECT_EDGE and SELECT_NODE Events
      }
    },
    [element, renderEvents],
  )
  // Filter
  React.useEffect(() => {
    const oldFilterVisibility = contextRef.current!.settings.visibility.filter
    const oldVisible = calculateVisibilityByContext(contextRef.current)
    const filtered = config.filter?.({ element, item }) ?? true
    contextRef.current!.settings.visibility.filter = filtered
    if (oldFilterVisibility !== filtered) {
      element.data({
        context: contextRef.current,
      })
      if (oldVisible !== calculateVisibilityByContext(contextRef.current)) {
        contextRef.current?.render()
      }
    }
  }, [config.filter])
  return {

  }
}
