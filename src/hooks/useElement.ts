import React from 'react'
import { Core, NodeSingular, EdgeSingular } from 'cytoscape'
import {
  ElementContext, Element,
  NodeConfig,
  EdgeConfig,
  ElementData,
  ElementFilterOption,
} from '@type'
import { CYTOSCAPE_EVENT, ELEMENT_DATA_FIELDS } from '@utils/constants'
import { calculateVisibilityByContext, contextUtils } from '@utils'
import { useInitializedRef } from 'colay-ui/hooks/useInitializedRef'

export type Props = {
  element: Element;
  item: ElementData
  cy: Core;
  contextRef: React.RefObject<ElementContext>;
  config: NodeConfig | EdgeConfig;
  filter?: ElementFilterOption<Element>
}

type Result = {

}

export const useElement = (props: Props): Result => {
  const {
    // cy,
    element,
    contextRef,
    config,
    item,
  } = props
  const {
    renderEvents = [],
  } = config
  const initializedRef = useInitializedRef()
  // Update data
  React.useEffect(
    () => {
      if (initializedRef.current) {
        element.data({
          [ELEMENT_DATA_FIELDS.DATA]: item?.data,
        })
      }
    },
    [item?.data],
  )
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
    const oldFiltered = contextRef.current!.settings.filtered
    // @ts-ignore
    const filtered = config.filter?.test?.({ element, item }) ?? true
    contextRef.current!.settings.filtered = filtered
    if (oldFiltered !== filtered) {
      contextUtils.update(element, contextRef.current)
      // @ts-ignore
      if (calculateVisibilityByContext(contextRef.current!)) {
        contextRef.current?.render()
      }
    }
  }, [config.filter])
  return {

  }
}
